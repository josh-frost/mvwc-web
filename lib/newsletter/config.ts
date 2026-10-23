import "server-only";
import { isProductionDeployment, SITE_NAME, SITE_URL } from "@/lib/site";

// coaches@ is a real inbox, so replies to the confirmation email go straight to the coaches.
export const NEWSLETTER_FROM = `${SITE_NAME} <coaches@mountvernonwrestlingclub.com>`;

// Base URL for confirmation links. Production always uses the canonical domain; previews
// use their stable branch URL; local development uses localhost.
export function newsletterBaseUrl() {
  if (isProductionDeployment) return SITE_URL;
  if (process.env.VERCEL_BRANCH_URL) return `https://${process.env.VERCEL_BRANCH_URL}`;
  return process.env.NEWSLETTER_BASE_URL || "http://localhost:3000";
}

export function confirmUrl(token: string) {
  return `${newsletterBaseUrl()}/newsletter/confirm?token=${encodeURIComponent(token)}`;
}

/** Resend segment that confirmed subscribers join ("Newsletter" in production, "Test signups" elsewhere). */
export function newsletterSegmentId() {
  const id = process.env.RESEND_NEWSLETTER_SEGMENT_ID;
  if (!id) throw new Error("RESEND_NEWSLETTER_SEGMENT_ID is not set");
  return id;
}
