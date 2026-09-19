// src/services/payment/payment-error.ts

import {
  IntegrationError,
  type IntegrationProvider,
} from "../../utils/integration-error.js";

export function throwPaymentUnavailable(provider: IntegrationProvider): never {
  throw new IntegrationError({
    provider,
    code: "PAYMENT_NOT_IMPLEMENTED",
    message: "Payment operation is unavailable.",
    statusCode: 501,
  });
}
