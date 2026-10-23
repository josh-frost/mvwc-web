import "server-only";
import { Resend } from "resend";
import { confirmUrl, NEWSLETTER_FROM, newsletterSegmentId } from "@/lib/newsletter/config";
import { createConfirmToken } from "@/lib/newsletter/token";
import { SITE_NAME } from "@/lib/site";

let client: Resend | undefined;

// Created lazily so builds don't need the key. Managing contacts requires a
// full-access API key (sending-only keys are rejected for contact operations).
function resend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  client ??= new Resend(key);
  return client;
}

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/** Sends the "confirm your subscription" email with a signed, expiring link. */
export async function sendConfirmationEmail(email: string) {
  const url = confirmUrl(createConfirmToken(email));
  const subject = `Confirm your ${SITE_NAME} email updates`;

  const text = [
    `Thanks for signing up for email updates from ${SITE_NAME}!`,
    "",
    "Please confirm your subscription by opening this link:",
    url,
    "",
    "The link expires in 72 hours. If you didn't sign up, you can ignore this email and you won't be added.",
  ].join("\n");

  const html = `<!doctype html>
<html><body style="font-family:Arial,sans-serif;color:#222;line-height:1.5;max-width:560px;margin:0 auto;padding:24px">
  <p>Thanks for signing up for email updates from <strong>${escapeHtml(SITE_NAME)}</strong>!</p>
  <p>Please confirm your subscription:</p>
  <p><a href="${escapeHtml(url)}" style="display:inline-block;background:#702E3E;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none">Confirm subscription</a></p>
  <p style="font-size:13px;color:#555">Or copy this link into your browser:<br>${escapeHtml(url)}</p>
  <p style="font-size:13px;color:#555">The link expires in 72 hours. If you didn't sign up, you can ignore this email and you won't be added.</p>
</body></html>`;

  const { error } = await resend().emails.send({ from: NEWSLETTER_FROM, to: email, subject, text, html });
  if (error) throw new Error(`Resend send failed: ${error.name}: ${error.message}`);
}

/**
 * Adds a confirmed subscriber: creates the contact (or re-subscribes an existing one)
 * and adds it to the newsletter segment. Safe to call more than once.
 */
export async function addSubscriber(email: string) {
  const segmentId = newsletterSegmentId();

  const existing = await resend().contacts.get({ email });
  if (existing.data) {
    const updated = await resend().contacts.update({ email, unsubscribed: false });
    if (updated.error) throw new Error(`Resend update failed: ${updated.error.name}: ${updated.error.message}`);
  } else if (existing.error?.name === "not_found") {
    const created = await resend().contacts.create({ email, unsubscribed: false, segments: [{ id: segmentId }] });
    if (created.error) throw new Error(`Resend create failed: ${created.error.name}: ${created.error.message}`);
    return;
  } else if (existing.error) {
    throw new Error(`Resend lookup failed: ${existing.error.name}: ${existing.error.message}`);
  }

  // Existing contact (e.g. a re-subscribe): make sure it's in the segment.
  const added = await resend().contacts.segments.add({ email, segmentId });
  if (added.error) throw new Error(`Resend segment add failed: ${added.error.name}: ${added.error.message}`);
}
