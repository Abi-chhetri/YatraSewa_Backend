// src/services/communication/resend.service.ts

import { Resend } from "resend";
import { z } from "zod";

import { env, requireEnv } from "../../config/env.js";

import {
  IntegrationError,
  toIntegrationError,
} from "../../utils/integration-error.js";

export interface SendEmailInput {
  to: string[];
  subject: string;
  html?: string;
  text?: string;
}

export interface SentEmail {
  id: string;
}

const emailListSchema = z.array(z.email()).min(1);

let resendClient: Resend | null = null;

export async function sendTransactionalEmail(
  input: SendEmailInput,
): Promise<SentEmail> {
  validateEmailInput(input);

  const request = buildEmailRequest(input);

  try {
    const response = await getResendClient().emails.send(request);

    return parseResendResponse(response.data, response.error);
  } catch (error) {
    throw toIntegrationError(error, {
      provider: "resend",
      code: "NETWORK_ERROR",
      message: "Failed to send email through Resend.",
      retryable: true,
    });
  }
}

function validateEmailInput(input: SendEmailInput): void {
  if (!input || !Array.isArray(input.to) || input.to.length === 0) {
    throw new IntegrationError({
      provider: "resend",
      code: "INVALID_INPUT",
      message: "At least one email recipient is required.",
      statusCode: 400,
    });
  }

  const recipients = emailListSchema.safeParse(input.to);

  if (!recipients.success) {
    throw new IntegrationError({
      provider: "resend",
      code: "INVALID_INPUT",
      message: "At least one valid email recipient is required.",
      statusCode: 400,
      cause: recipients.error,
    });
  }

  if (typeof input.subject !== "string" || input.subject.trim() === "") {
    throw new IntegrationError({
      provider: "resend",
      code: "INVALID_INPUT",
      message: "Email subject cannot be empty.",
      statusCode: 400,
    });
  }

  if (!input.html && !input.text) {
    throw new IntegrationError({
      provider: "resend",
      code: "EMAIL_BODY_MISSING",
      message: "Email must include html or text content.",
      statusCode: 400,
    });
  }
}

function buildEmailRequest(input: SendEmailInput) {
  const base = {
    from: requireEnv(env.RESEND_FROM_EMAIL, "RESEND_FROM_EMAIL", "resend"),
    to: input.to,
    subject: input.subject,
  };

  if (input.html) {
    return { ...base, html: input.html };
  }

  return { ...base, text: input.text ?? "" };
}

function getResendClient(): Resend {
  if (resendClient) {
    return resendClient;
  }

  resendClient = new Resend(
    requireEnv(env.RESEND_API_KEY, "RESEND_API_KEY", "resend"),
  );

  return resendClient;
}

function parseResendResponse(
  data: { id?: string } | null | undefined,
  error: unknown,
): SentEmail {
  if (error) {
    throw new IntegrationError({
      provider: "resend",
      code: "PROVIDER_REJECTED",
      message: "Resend rejected the email request.",
      statusCode: 502,
      cause: error,
    });
  }

  if (!data?.id) {
    throw new IntegrationError({
      provider: "resend",
      code: "INVALID_RESPONSE",
      message: "Resend returned an invalid response.",
      statusCode: 502,
      cause: data,
    });
  }

  return {
    id: data.id,
  };
}
