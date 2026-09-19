export type IntegrationProvider =
  | "payment"
  | "resend"
  | "sparrow-sms"
  | "cloudinary"
  | "esewa"
  | "khalti"
  | "fonepay"
  | "connectips";

export type IntegrationErrorCode =
  | "NOT_CONFIGURED"
  | "INVALID_INPUT"
  | "EMAIL_BODY_MISSING"
  | "SMS_INVALID_PHONE"
  | "SMS_INVALID_OTP"
  | "EMPTY_UPLOAD"
  | "NETWORK_ERROR"
  | "PROVIDER_REJECTED"
  | "INVALID_RESPONSE"
  | "PAYMENT_NOT_IMPLEMENTED"
  | "UNKNOWN";

const STATUS_BY_CODE: Record<IntegrationErrorCode, number> = {
  NOT_CONFIGURED: 503,
  INVALID_INPUT: 400,
  EMAIL_BODY_MISSING: 400,
  SMS_INVALID_PHONE: 400,
  SMS_INVALID_OTP: 400,
  EMPTY_UPLOAD: 400,
  NETWORK_ERROR: 502,
  PROVIDER_REJECTED: 502,
  INVALID_RESPONSE: 502,
  PAYMENT_NOT_IMPLEMENTED: 501,
  UNKNOWN: 500,
};

const RETRYABLE_BY_CODE: Record<IntegrationErrorCode, boolean> = {
  NOT_CONFIGURED: false,
  INVALID_INPUT: false,
  EMAIL_BODY_MISSING: false,
  SMS_INVALID_PHONE: false,
  SMS_INVALID_OTP: false,
  EMPTY_UPLOAD: false,
  NETWORK_ERROR: true,
  PROVIDER_REJECTED: false,
  INVALID_RESPONSE: false,
  PAYMENT_NOT_IMPLEMENTED: false,
  UNKNOWN: false,
};

const PUBLIC_MESSAGE_BY_CODE: Record<IntegrationErrorCode, string> = {
  NOT_CONFIGURED: "Service is not configured.",
  INVALID_INPUT: "Invalid input.",
  EMAIL_BODY_MISSING: "Email could not be sent.",
  SMS_INVALID_PHONE: "Invalid phone number.",
  SMS_INVALID_OTP: "Invalid OTP.",
  EMPTY_UPLOAD: "Upload failed.",
  NETWORK_ERROR: "Service temporarily unavailable. Please try again.",
  PROVIDER_REJECTED: "Request was rejected by the provider.",
  INVALID_RESPONSE: "Unexpected response from the provider.",
  PAYMENT_NOT_IMPLEMENTED: "Payment method not available.",
  UNKNOWN: "Something went wrong.",
};

export interface IntegrationErrorOptions {
  provider: IntegrationProvider;
  code: IntegrationErrorCode;
  message: string;
  statusCode?: number;
  retryable?: boolean;
  requestId?: string;
  providerReference?: string;
  cause?: unknown;
}

export class IntegrationError extends Error {
  readonly provider: IntegrationProvider;
  readonly code: IntegrationErrorCode;
  readonly statusCode: number;
  readonly retryable: boolean;
  readonly publicMessage: string;
  readonly requestId?: string;
  readonly providerReference?: string;

  constructor(options: IntegrationErrorOptions) {
    super(options.message, { cause: options.cause });

    Object.setPrototypeOf(this, IntegrationError.prototype);

    this.name = "IntegrationError";
    this.provider = options.provider;
    this.code = options.code;
    this.statusCode =
      options.statusCode ?? STATUS_BY_CODE[options.code];
    this.retryable =
      options.retryable ?? RETRYABLE_BY_CODE[options.code];
    this.publicMessage =
      PUBLIC_MESSAGE_BY_CODE[options.code];
    this.requestId = options.requestId;
    this.providerReference = options.providerReference;
  }

    toClientJSON() {
    return {
      success: false,
      error: {
        provider: this.provider,
        code: this.code,
        message: this.publicMessage,
        statusCode: this.statusCode,
        retryable: this.retryable,
        ...(this.requestId
          ? { requestId: this.requestId }
          : {}),
      },
    };
  }
}

export function isIntegrationError(
  value: unknown,
): value is IntegrationError {
  if (value instanceof IntegrationError) {
    return true;
  }

  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const candidate = value as {
    name?: unknown;
    provider?: unknown;
    code?: unknown;
  };

  return (
    candidate.name === "IntegrationError" &&
    typeof candidate.provider === "string" &&
    typeof candidate.code === "string"
  );
}

export function toIntegrationError(
  cause: unknown,
  options: Omit<IntegrationErrorOptions, "cause">,
): IntegrationError {
  if (isIntegrationError(cause)) {
    return cause;
  }

  return new IntegrationError({
    ...options,
    cause,
  });
}