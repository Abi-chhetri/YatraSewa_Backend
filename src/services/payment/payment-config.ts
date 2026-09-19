// src/services/payment/payment-config.ts

import { env, requireEnv } from "../../config/env.js";

export function getEsewaConfig() {
  return {
    baseUrl: requireEnv(env.ESEWA_BASE_URL, "ESEWA_BASE_URL", "esewa"),
    merchantCode: requireEnv(
      env.ESEWA_MERCHANT_CODE,
      "ESEWA_MERCHANT_CODE",
      "esewa",
    ),
    secret: requireEnv(env.ESEWA_SECRET, "ESEWA_SECRET", "esewa"),
  };
}

export function getKhaltiConfig() {
  return {
    baseUrl: requireEnv(env.KHALTI_BASE_URL, "KHALTI_BASE_URL", "khalti"),
    secretKey: requireEnv(env.KHALTI_SECRET_KEY, "KHALTI_SECRET_KEY", "khalti"),
  };
}

export function getFonePayConfig() {
  return {
    baseUrl: requireEnv(env.FONEPAY_BASE_URL, "FONEPAY_BASE_URL", "fonepay"),
    merchantId: requireEnv(
      env.FONEPAY_MERCHANT_ID,
      "FONEPAY_MERCHANT_ID",
      "fonepay",
    ),
    secret: requireEnv(env.FONEPAY_SECRET, "FONEPAY_SECRET", "fonepay"),
  };
}

export function getConnectIpsConfig() {
  return {
    baseUrl: requireEnv(
      env.CONNECT_IPS_BASE_URL,
      "CONNECT_IPS_BASE_URL",
      "connectips",
    ),
    clientId: requireEnv(
      env.CONNECT_IPS_CLIENT_ID,
      "CONNECT_IPS_CLIENT_ID",
      "connectips",
    ),
    secret: requireEnv(
      env.CONNECT_IPS_SECRET,
      "CONNECT_IPS_SECRET",
      "connectips",
    ),
  };
}
