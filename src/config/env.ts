// src/config/env.ts

import "dotenv/config";
import { z } from "zod";

import {
  IntegrationError,
  type IntegrationProvider,
} from "../utils/integration-error.js";

const emptyToUndefined = (value: unknown): unknown => {
  if (typeof value === "string" && value.trim() === "") {
    return undefined;
  }

  return value;
};

const optionalString = z.preprocess(emptyToUndefined, z.string().optional());

const optionalUrl = z.preprocess(emptyToUndefined, z.url().optional());

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),

  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  DATABASE_URL: optionalString,

  PAYMENT_MOCK_ENABLED: z.preprocess(
    emptyToUndefined,
    z.enum(["true", "false"]).default("false"),
  ),

  // Resend
  RESEND_API_KEY: optionalString,
  RESEND_FROM_EMAIL: optionalString,

  // Sparrow SMS
  SPARROW_SMS_BASE_URL: optionalUrl,
  SPARROW_SMS_SEND_PATH: z.preprocess(
    emptyToUndefined,
    z.string().default("/api/v1/sms"),
  ),
  SPARROW_SMS_TOKEN: optionalString,
  SPARROW_SMS_FROM: optionalString,

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: optionalString,
  CLOUDINARY_API_KEY: optionalString,
  CLOUDINARY_API_SECRET: optionalString,

  // eSewa
  ESEWA_BASE_URL: optionalUrl,
  ESEWA_MERCHANT_CODE: optionalString,
  ESEWA_SECRET: optionalString,

  // Khalti
  KHALTI_BASE_URL: optionalUrl,
  KHALTI_SECRET_KEY: optionalString,

  // FonePay
  FONEPAY_BASE_URL: optionalUrl,
  FONEPAY_MERCHANT_ID: optionalString,
  FONEPAY_SECRET: optionalString,

  // ConnectIPS
  CONNECT_IPS_BASE_URL: optionalUrl,
  CONNECT_IPS_CLIENT_ID: optionalString,
  CONNECT_IPS_SECRET: optionalString,
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(
    "Invalid environment configuration: " +
      parsed.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; "),
  );
}

export const env = parsed.data;

export function requireEnv(
  value: string | undefined,
  name: string,
  provider: IntegrationProvider,
): string {
  if (value === undefined || value.trim() === "") {
    throw new IntegrationError({
      provider,
      code: "NOT_CONFIGURED",
      message: `Missing environment variable: ${name}`,
      statusCode: 503,
    });
  }

  return value;
}
