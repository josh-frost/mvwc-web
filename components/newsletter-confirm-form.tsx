"use client";

import { useActionState } from "react";
import Link from "next/link";
import { confirmSubscription } from "@/app/(site)/newsletter/actions";
import type { ConfirmState } from "@/lib/newsletter/types";

const initialState: ConfirmState = { status: "idle" };

// See components/newsletter-signup.tsx: keep network/BotID failures inside the form.
async function submitConfirm(prev: ConfirmState, formData: FormData): Promise<ConfirmState> {
  try {
    return await confirmSubscription(prev, formData);
  } catch {
    return {
      status: "error",
      message:
        "We couldn't confirm from this browser. If you use an ad or tracker blocker, try pausing it for this site and try again.",
    };
  }
}

// Confirmation needs a button press rather than happening when the link is opened,
// because email security scanners open links automatically.
export function NewsletterConfirmForm({ token, email }: { token: string; email: string }) {
  const [state, formAction, pending] = useActionState(submitConfirm, initialState);

  if (state.status === "confirmed") {
    return (
      <div role="status">
        <h1 className="text-4xl font-bold">You&apos;re subscribed!</h1>
        <p className="mt-4 text-muted-foreground">
          Thanks for joining the Mount Vernon Wrestling Club email list. You can unsubscribe any
          time from the link at the bottom of our emails.
        </p>
        <Link href="/" className="mt-8 inline-block underline">
          Back to the home page
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-bold">Confirm your subscription</h1>
      <p className="mt-4 text-muted-foreground">
        Confirm that <strong className="text-foreground">{email}</strong> should receive email
        updates from Mount Vernon Wrestling Club.
      </p>
      <form action={formAction} className="mt-8">
        <input type="hidden" name="token" value={token} />
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-primary px-5 py-2.5 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "Confirming…" : "Confirm subscription"}
        </button>
      </form>
      <p aria-live="polite" className="mt-4 text-sm">
        {state.status === "error" ? state.message : ""}
      </p>
    </div>
  );
}
