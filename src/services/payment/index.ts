// src/services/payment/index.ts

export {
  initiatePayment,
  verifyPayment,
} from "./payment.service.js";

export type {
  PaymentGateway,
  PaymentGatewayClient,
  PaymentInitiationInput,
  PaymentInitiationResult,
  PaymentVerificationInput,
  PaymentVerificationResult,
} from "./payment.types.js";