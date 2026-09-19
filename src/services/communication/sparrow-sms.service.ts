// src/services/communication/sparrow-sms.service.ts

import { env, requireEnv } from "../../config/env.js";

import {
  IntegrationError,
  toIntegrationError,
} from "../../utils/integration-error.js";

export interface SendSmsInput {
  to: string;
  message: string;
}

export interface SendOtpInput {
  to: string;
  otp: string;
}

export interface SmsResponse {
  success: boolean;
  messageId?: string;
  raw?: unknown;
}

const PHONE_PATTERN = /^\+?\d{10,15}$/;

const OTP_PATTERN = /^\d{4,8}$/;

export async function sendSms(input: SendSmsInput): Promise<SmsResponse> {
  const phoneNumber = normalizePhoneNumber(input.to);

  validateSmsMessage(input.message);

  const payload = buildSmsPayload(phoneNumber, input.message);

  const raw = await sendSparrowRequest(payload);

  return buildSmsResponse(raw);
}

export async function sendOtpSms(input: SendOtpInput): Promise<SmsResponse> {
  validateOtp(input.otp);

  return sendSms({
    to: input.to,
    message: `Your YatraSewa OTP is ${input.otp}. ` + "Do not share this code.",
  });
}

export async function sendAlertSms(
  to: string,
  message: string,
): Promise<SmsResponse> {
  return sendSms({
    to,
    message,
  });
}

function normalizePhoneNumber(phone: string): string {
  if (typeof phone !== "string") {
    throw new IntegrationError({
      provider: "sparrow-sms",
      code: "SMS_INVALID_PHONE",
      message: "A valid phone number is required.",
      statusCode: 400,
    });
  }

  const normalized = phone.replace(/[^\d+]/g, "");

  if (!PHONE_PATTERN.test(normalized)) {
    throw new IntegrationError({
      provider: "sparrow-sms",
      code: "SMS_INVALID_PHONE",
      message: "Phone number must contain 10 to 15 digits.",
      statusCode: 400,
    });
  }

  return normalized;
}

function validateSmsMessage(message: string): void {
  if (typeof message !== "string" || message.trim() === "") {
    throw new IntegrationError({
      provider: "sparrow-sms",
      code: "INVALID_INPUT",
      message: "SMS message cannot be empty.",
      statusCode: 400,
    });
  }
}

function validateOtp(otp: string): void {
  if (typeof otp !== "string" || !OTP_PATTERN.test(otp)) {
    throw new IntegrationError({
      provider: "sparrow-sms",
      code: "SMS_INVALID_OTP",
      message: "OTP must be 4 to 8 digits.",
      statusCode: 400,
    });
  }
}

function buildSmsPayload(to: string, message: string): Record<string, string> {
  return {
    from: requireEnv(env.SPARROW_SMS_FROM, "SPARROW_SMS_FROM", "sparrow-sms"),
    to,
    message,
  };
}

async function sendSparrowRequest(
  payload: Record<string, string>,
): Promise<unknown> {
  const url = buildSparrowUrl();

  let response: Response;

  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${requireEnv(
          env.SPARROW_SMS_TOKEN,
          "SPARROW_SMS_TOKEN",
          "sparrow-sms",
        )}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    throw toIntegrationError(error, {
      provider: "sparrow-sms",
      code: "NETWORK_ERROR",
      message: "Failed to reach Sparrow SMS.",
      retryable: true,
    });
  }

  const raw = await response.json().catch(() => null);

  if (!response.ok) {
    throw new IntegrationError({
      provider: "sparrow-sms",
      code: "PROVIDER_REJECTED",
      message: "Sparrow SMS rejected the request.",
      statusCode:
        response.status >= 400 && response.status < 500 ? response.status : 502,
      cause: raw,
    });
  }

  return raw;
}

function buildSparrowUrl(): string {
  const baseUrl = requireEnv(
    env.SPARROW_SMS_BASE_URL,
    "SPARROW_SMS_BASE_URL",
    "sparrow-sms",
  );

  return baseUrl.replace(/\/+$/, "") + env.SPARROW_SMS_SEND_PATH;
}

function buildSmsResponse(raw: unknown): SmsResponse {
  return {
    success: true,
    messageId: extractMessageId(raw),
    raw,
  };
}

function extractMessageId(raw: unknown): string | undefined {
  if (typeof raw !== "object" || raw === null) {
    return undefined;
  }

  const response = raw as Record<string, unknown>;

  if (response.messageId != null) {
    return String(response.messageId);
  }

  if (response.id != null) {
    return String(response.id);
  }

  return undefined;
}
