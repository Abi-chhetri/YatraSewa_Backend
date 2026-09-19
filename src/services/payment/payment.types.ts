// src/services/payment/payment.types.ts

import { z } from "zod";

export const paymentGatewaySchema = z.enum([
  "esewa",
  "khalti",
  "fonepay",
  "connectips",
]);

export type PaymentGateway = z.infer<typeof paymentGatewaySchema>;

const positiveAmount = z.number().positive().max(10_000_000);

const paymentUrl = z.url();

export const paymentInitiationSchema = z.object({
  gateway: paymentGatewaySchema,

  orderId: z.string().min(1).max(100),

  amount: positiveAmount,

  currency: z.literal("NPR").default("NPR"),

  description: z.string().min(1).max(500).optional(),

  returnUrl: paymentUrl,

  webhookUrl: paymentUrl.optional(),

  customerId: z.string().max(100).optional(),

  metadata: z.record(z.string(), z.string()).optional(),
});

export type PaymentInitiationInput = z.infer<typeof paymentInitiationSchema>;

export const paymentVerificationSchema = z.object({
  gateway: paymentGatewaySchema,

  orderId: z.string().min(1).max(100),

  gatewayReference: z.string().min(1).max(200),

  amount: positiveAmount,

  currency: z.literal("NPR").default("NPR"),
});

export type PaymentVerificationInput = z.infer<
  typeof paymentVerificationSchema
>;

export type PaymentStatus = "SUCCESS" | "PENDING" | "FAILED";

export interface PaymentInitiationResult {
  gateway: PaymentGateway;
  orderId: string;
  gatewayReference?: string;
  redirectUrl?: string;
  raw?: unknown;
}

export interface PaymentVerificationResult {
  gateway: PaymentGateway;
  orderId: string;
  status: PaymentStatus;
  raw?: unknown;
}

export interface PaymentGatewayClient {
  initiatePayment(
    input: PaymentInitiationInput,
  ): Promise<PaymentInitiationResult>;

  verifyPayment(
    input: PaymentVerificationInput,
  ): Promise<PaymentVerificationResult>;
}
