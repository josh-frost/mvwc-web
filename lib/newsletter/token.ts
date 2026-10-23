import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

// Confirmation links carry a signed token: base64url(JSON payload) + "." + base64url(HMAC).
// Nothing is stored server-side until the subscriber confirms.

const TOKEN_TTL_MS = 72 * 60 * 60 * 1000;

type Payload = { e: string; x: number }; // email, expires-at (ms)

function secret() {
  const value = process.env.NEWSLETTER_CONFIRMATION_SECRET;
  if (!value || value.length < 32) {
    throw new Error("NEWSLETTER_CONFIRMATION_SECRET must be set to at least 32 characters");
  }
  return value;
}

function sign(data: string) {
  return createHmac("sha256", secret()).update(data).digest("base64url");
}

export function createConfirmToken(email: string, now = Date.now()) {
  const payload: Payload = { e: email, x: now + TOKEN_TTL_MS };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${data}.${sign(data)}`;
}

export type TokenResult =
  | { status: "valid"; email: string }
  | { status: "expired" }
  | { status: "invalid" };

export function verifyConfirmToken(token: string | undefined | null, now = Date.now()): TokenResult {
  if (!token || token.length > 1024) return { status: "invalid" };
  const [data, signature, ...rest] = token.split(".");
  if (!data || !signature || rest.length) return { status: "invalid" };

  const expected = Buffer.from(sign(data));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    return { status: "invalid" };
  }

  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf8")) as Payload;
    if (typeof payload.e !== "string" || typeof payload.x !== "number") return { status: "invalid" };
    if (payload.x < now) return { status: "expired" };
    return { status: "valid", email: payload.e };
  } catch {
    return { status: "invalid" };
  }
}
