"use client";

import { useActionState, useEffect, useRef } from "react";
import { MailCheck } from "lucide-react";
import { requestSubscription } from "@/app/(site)/newsletter/actions";
import { HONEYPOT_FIELD, type SignupState } from "@/lib/newsletter/types";
import { cn } from "@/lib/utils";

const initialState: SignupState = { status: "idle" };

// Wraps the Server Action so failures before it responds (offline, or BotID's script
// blocked by an ad/tracker blocker) show a message instead of crashing the page.
async function submitSignup(prev: SignupState, formData: FormData): Promise<SignupState> {
  try {
    return await requestSubscription(prev, formData);
  } catch {
    const email = formData.get("email");
    return {
      status: "error",
      message:
        "We couldn't sign you up from this browser. If you use an ad or tracker blocker, try pausing it for this site, or email coaches@mountvernonwrestlingclub.com.",
      email: typeof email === "string" ? email : undefined,
    };
  }
}

export function NewsletterSignup({
  heading,
  text,
  className,
}: {
  heading: string;
  text?: string;
  className?: string;
}) {
  const [state, formAction, pending] = useActionState(submitSignup, initialState);
  const startedAtRef = useRef<HTMLInputElement>(null);

  // Record when the form became usable in the browser (pages are prerendered, so this
  // can't come from the server). Submissions faster than a person could type are rejected.
  useEffect(() => {
    if (startedAtRef.current) startedAtRef.current.value = String(Date.now());
  }, []);

  return (
    <section
      id="newsletter"
      aria-labelledby="newsletter-heading"
      className={cn("w-full scroll-mt-24 rounded-lg border p-6 sm:p-8", className)}
    >
      <h2 id="newsletter-heading" className="text-2xl font-semibold">
        {heading}
      </h2>
      {text && <p className="mt-2 text-muted-foreground">{text}</p>}

      {state.status === "sent" ? (
        <div role="status" className="mt-6 flex items-start gap-3">
          <MailCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          <div>
            <p className="font-semibold">Check your inbox to confirm.</p>
            <p className="text-sm text-muted-foreground">
              We sent a confirmation link to your email. If you don&apos;t see it in a few minutes,
              check your spam folder.
            </p>
          </div>
        </div>
      ) : (
        <form action={formAction} className="mt-6" noValidate>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              placeholder="you@example.com"
              defaultValue={state.status === "error" ? state.email : undefined}
              aria-invalid={state.status === "error" || undefined}
              aria-describedby={state.status === "error" ? "newsletter-error" : undefined}
              className="min-w-0 flex-1 rounded-md border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="submit"
              disabled={pending}
              className="rounded-md bg-primary px-5 py-2.5 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {pending ? "Subscribing…" : "Subscribe"}
            </button>
          </div>

          {/* Honeypot: hidden from people and assistive tech; bots that fill it are ignored. */}
          <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
            <label htmlFor={`newsletter-${HONEYPOT_FIELD}`}>Leave this field empty</label>
            <input
              id={`newsletter-${HONEYPOT_FIELD}`}
              name={HONEYPOT_FIELD}
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
          <input ref={startedAtRef} type="hidden" name="startedAt" />

          <p
            id="newsletter-error"
            aria-live="polite"
            className={cn("mt-2 text-sm", state.status === "error" ? "text-foreground" : "sr-only")}
          >
            {state.status === "error" ? state.message : ""}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            We&apos;ll only email club news and updates. Unsubscribe any time.
          </p>
        </form>
      )}

      <noscript>
        <p className="mt-4 text-sm text-muted-foreground">
          Signing up needs JavaScript. You can also email{" "}
          <a href="mailto:coaches@mountvernonwrestlingclub.com" className="underline">
            coaches@mountvernonwrestlingclub.com
          </a>{" "}
          and ask to be added.
        </p>
      </noscript>
    </section>
  );
}
