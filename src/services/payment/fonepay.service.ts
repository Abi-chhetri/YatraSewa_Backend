// src/services/payment/fonepay.service.ts

import type { PaymentGatewayClient } from "./payment.types.js";

import { getFonePayConfig } from "./payment-config.js";

import { throwPaymentUnavailable } from "./payment-error.js";

export const fonepayService: PaymentGatewayClient = {
  initiatePayment(input) {
    const config = getFonePayConfig();

    return initiateFonePayPayment(input, config);
  },

  verifyPayment(input) {
    const config = getFonePayConfig();

    return verifyFonePayPayment(input, config);
  },
};

function initiateFonePayPayment(
  input: Parameters<PaymentGatewayClient["initiatePayment"]>[0],
  config: ReturnType<typeof getFonePayConfig>,
) {
  void input;
  void config;

  return throwPaymentUnavailable("fonepay");
}

function verifyFonePayPayment(
  input: Parameters<PaymentGatewayClient["verifyPayment"]>[0],
  config: ReturnType<typeof getFonePayConfig>,
) {
  void input;
  void config;

  return throwPaymentUnavailable("fonepay");
}
