"use server";

import { checkBotId } from "botid/server";
import { normalizeEmail } from "@/lib/newsletter/email-address";
import { addSubscriber, sendConfirmationEmail } from "@/lib/newsletter/resend";
import { verifyConfirmToken } from "@/lib/newsletter/token";
import {
  HONEYPOT_FIELD,
  MIN_FILL_TIME_MS,
  type ConfirmState,
  type SignupState,
} from "@/lib/newsletter/types";

const GENERIC_ERROR = "Something went wrong. Please try again in a few minutes.";

/**
 * Step 1: send a confirmation email. Nothing is stored until the link is confirmed.
 * The response is the same whether or not the address is already subscribed, so the
 * form can't be used to discover who's on the list.
 */
export async function requestSubscription(_prev: SignupState, formData: FormData): Promise<SignupState> {
  const rawEmail = formData.get("email");

  // Bots that fill every field, or that BotID flags, get the normal success response
  // but nothing is sent, so they learn nothing.
  // Drops are logged (without the address) so false positives can be diagnosed.
  if (formData.get(HONEYPOT_FIELD)) {
    console.warn("Newsletter signup dropped: honeypot field was filled");
    return { status: "sent" };
  }
  const { isBot } = await checkBotId();
  if (isBot) {
    console.warn("Newsletter signup dropped: BotID classified the request as a bot");
    return { status: "sent" };
  }

  const startedAt = Number(formData.get("startedAt"));
  if (!startedAt || Date.now() - startedAt < MIN_FILL_TIME_MS) {
    return {
      status: "error",
      message: "Please wait a moment and try again.",
      email: typeof rawEmail === "string" ? rawEmail : undefined,
    };
  }

  const email = normalizeEmail(rawEmail);
  if (!email) {
    return {
      status: "error",
      message: "Please enter a valid email address.",
      email: typeof rawEmail === "string" ? rawEmail : undefined,
    };
  }

  try {
    await sendConfirmationEmail(email);
  } catch (error) {
    // Log the failure without the subscriber's address.
    console.error("Newsletter confirmation email failed:", error instanceof Error ? error.message : error);
    return { status: "error", message: GENERIC_ERROR, email };
  }
  return { status: "sent" };
}

/** Step 2: the subscriber clicked "Confirm subscription" on the page the email linked to. */
export async function confirmSubscription(_prev: ConfirmState, formData: FormData): Promise<ConfirmState> {
  const { isBot } = await checkBotId();
  if (isBot) {
    console.warn("Newsletter confirm rejected: BotID classified the request as a bot");
    return { status: "error", message: GENERIC_ERROR };
  }

  let token: ReturnType<typeof verifyConfirmToken>;
  try {
    token = verifyConfirmToken(formData.get("token")?.toString());
  } catch (error) {
    // Misconfiguration (e.g. NEWSLETTER_CONFIRMATION_SECRET missing)
    console.error("Newsletter token check failed:", error instanceof Error ? error.message : error);
    return { status: "error", message: GENERIC_ERROR };
  }
  if (token.status === "expired") {
    return { status: "error", message: "This confirmation link has expired. Please sign up again." };
  }
  if (token.status !== "valid") {
    return { status: "error", message: "This confirmation link isn't valid. Please sign up again." };
  }

  try {
    await addSubscriber(token.email);
  } catch (error) {
    console.error("Newsletter subscribe failed:", error instanceof Error ? error.message : error);
    return { status: "error", message: GENERIC_ERROR };
  }
  return { status: "confirmed" };
}
