// src/services/payment/connect-ips.service.ts

import type {
  PaymentGatewayClient,
} from "./payment.types.js";

import {
  getConnectIpsConfig,
} from "./payment-config.js";

import {
  throwPaymentUnavailable,
} from "./payment-error.js";

export const connectIpsService:
  PaymentGatewayClient = {
    initiatePayment(input) {
      const config =
        getConnectIpsConfig();

      return initiateConnectIpsPayment(
        input,
        config,
      );
    },

    verifyPayment(input) {
      const config =
        getConnectIpsConfig();

      return verifyConnectIpsPayment(
        input,
        config,
      );
    },
  };

function initiateConnectIpsPayment(
  input: Parameters<
    PaymentGatewayClient["initiatePayment"]
  >[0],
  config: ReturnType<
    typeof getConnectIpsConfig
  >,
) {
  void input;
  void config;

  return throwPaymentUnavailable(
    "connectips",
  );
}

function verifyConnectIpsPayment(
  input: Parameters<
    PaymentGatewayClient["verifyPayment"]
  >[0],
  config: ReturnType<
    typeof getConnectIpsConfig
  >,
) {
  void input;
  void config;

  return throwPaymentUnavailable(
    "connectips",
  );
}