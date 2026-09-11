import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "atvncg_admin";
const SESSION_SECONDS = 60 * 60 * 8;

function secret() {
  const configured = process.env.ADMIN_SESSION_SECRET;
  if (configured && configured.length >= 32) return configured;
  if (process.env.NODE_ENV === "production") return null;
  return "dev-only-change-this-session-secret";
}

function sign(value: string) {
  const key = secret();
  return key ? createHmac("sha256", key).update(value).digest("base64url") : null;
}

export function createAdminToken() {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const payload = String(expiresAt);
  const signature = sign(payload);
  if (!signature) throw new Error("ADMIN_SESSION_SECRET is missing or too short.");
  return `${payload}.${signature}`;
}

export function verifyAdminToken(token?: string) {
  if (!token) return false;
  const [expiresAt, signature] = token.split(".");
  if (!expiresAt || !signature || Number(expiresAt) < Date.now() / 1000) return false;

  const expectedSignature = sign(expiresAt);
  if (!expectedSignature) return false;
  const expected = Buffer.from(expectedSignature);
  const actual = Buffer.from(signature);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function verifyAdminPassword(password: string) {
  const configured = process.env.ADMIN_PASSWORD;
  if (!configured) return process.env.NODE_ENV !== "production" && password === "ATVNCG2026!admin";

  const expected = Buffer.from(configured);
  const actual = Buffer.from(password);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export const adminCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_SECONDS,
};
