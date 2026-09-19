// src/services/payment/payment.service.ts

import { z } from "zod";

import { env } from "../../config/env.js";

import {
  IntegrationError,
} from "../../utils/integration-error.js";

import {
  connectIpsService,
} from "./connect-ips.service.js";

import {
  esewaService,
} from "./esewa.service.js";

import {
  fonepayService,
} from "./fonepay.service.js";

import {
  khaltiService,
} from "./khalti.service.js";

import {
  paymentGatewaySchema,
  paymentInitiationSchema,
  paymentVerificationSchema,
  type PaymentGateway,
  type PaymentGatewayClient,
  type PaymentInitiationInput,
  type PaymentInitiationResult,
  type PaymentVerificationInput,
  type PaymentVerificationResult,
} from "./payment.types.js";

const gatewayClients: Record<
  PaymentGateway,
  PaymentGatewayClient
> = {
  esewa: esewaService,
  khalti: khaltiService,
  fonepay: fonepayService,
  connectips: connectIpsService,
};

export async function initiatePayment(
  rawInput: unknown,
): Promise<PaymentInitiationResult> {
  const input =
    parsePaymentInput(
      paymentInitiationSchema,
      rawInput,
    );

  if (isPaymentMockEnabled()) {
    return createMockInitiation(input);
  }

  return gatewayClients[
    input.gateway
  ].initiatePayment(input);
}

export async function verifyPayment(
  rawInput: unknown,
): Promise<PaymentVerificationResult> {
  const input =
    parsePaymentInput(
      paymentVerificationSchema,
      rawInput,
    );

  if (isPaymentMockEnabled()) {
    return createMockVerification(input);
  }

  return gatewayClients[
    input.gateway
  ].verifyPayment(input);
}

function parsePaymentInput<T>(
  schema: z.ZodType<T>,
  rawInput: unknown,
): T {
  const result =
    schema.safeParse(rawInput);

  if (result.success) {
    return result.data;
  }

  const provider =
    getPaymentErrorProvider(rawInput);

  throw new IntegrationError({
    provider,
    code: "INVALID_INPUT",
    message:
      result.error.issues
        .map(
          (issue) =>
            `${issue.path.join(".") || "(root)"}: ${issue.message}`,
        )
        .join("; "),
    statusCode: 400,
    cause: result.error,
  });
}

function getPaymentErrorProvider(
  rawInput: unknown,
) {
  if (
    typeof rawInput !== "object" ||
    rawInput === null
  ) {
    return "payment" as const;
  }

  const candidate =
    (rawInput as {
      gateway?: unknown;
    }).gateway;

  const result =
    paymentGatewaySchema.safeParse(
      candidate,
    );

  return result.success
    ? result.data
    : ("payment" as const);
}

function isPaymentMockEnabled(): boolean {
  return (
    env.PAYMENT_MOCK_ENABLED === "true" &&
    env.NODE_ENV !== "production"
  );
}

function createMockInitiation(
  input: PaymentInitiationInput,
): PaymentInitiationResult {
  return {
    gateway: input.gateway,
    orderId: input.orderId,
    gatewayReference:
      `mock_${input.orderId}`,
    raw: {
      mocked: true,
    },
  };
}

function createMockVerification(
  input: PaymentVerificationInput,
): PaymentVerificationResult {
  return {
    gateway: input.gateway,
    orderId: input.orderId,
    status: "PENDING",
    raw: {
      mocked: true,
    },
  };
}