// src/services/payment/khalti.service.ts

import type {
  PaymentGatewayClient,
} from "./payment.types.js";

import {
  getKhaltiConfig,
} from "./payment-config.js";

import {
  throwPaymentUnavailable,
} from "./payment-error.js";

export const khaltiService:
  PaymentGatewayClient = {
    initiatePayment(input) {
      const config =
        getKhaltiConfig();

      return initiateKhaltiPayment(
        input,
        config,
      );
    },

    verifyPayment(input) {
      const config =
        getKhaltiConfig();

      return verifyKhaltiPayment(
        input,
        config,
      );
    },
  };

function initiateKhaltiPayment(
  input: Parameters<
    PaymentGatewayClient["initiatePayment"]
  >[0],
  config: ReturnType<
    typeof getKhaltiConfig
  >,
) {
  void input;
  void config;

  return throwPaymentUnavailable(
    "khalti",
  );
}

function verifyKhaltiPayment(
  input: Parameters<
    PaymentGatewayClient["verifyPayment"]
  >[0],
  config: ReturnType<
    typeof getKhaltiConfig
  >,
) {
  void input;
  void config;

  return throwPaymentUnavailable(
    "khalti",
  );
}