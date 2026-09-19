// src/services/payment/esewa.service.ts

import type { PaymentGatewayClient } from "./payment.types.js";

import { getEsewaConfig } from "./payment-config.js";

import { throwPaymentUnavailable } from "./payment-error.js";

export const esewaService: PaymentGatewayClient = {
  initiatePayment(input) {
    const config = getEsewaConfig();

    return initiateEsewaPayment(input, config);
  },

  verifyPayment(input) {
    const config = getEsewaConfig();

    return verifyEsewaPayment(input, config);
  },
};

function initiateEsewaPayment(
  input: Parameters<PaymentGatewayClient["initiatePayment"]>[0],
  config: ReturnType<typeof getEsewaConfig>,
) {
  void input;
  void config;

  return throwPaymentUnavailable("esewa");
}

function verifyEsewaPayment(
  input: Parameters<PaymentGatewayClient["verifyPayment"]>[0],
  config: ReturnType<typeof getEsewaConfig>,
) {
  void input;
  void config;

  return throwPaymentUnavailable("esewa");
}
