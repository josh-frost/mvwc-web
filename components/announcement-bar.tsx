"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Megaphone, TriangleAlert, X } from "lucide-react";
import { ANNOUNCEMENT_DISMISSED_KEY, ANNOUNCEMENT_ELEMENT_ID } from "@/lib/announcement";
import { cn } from "@/lib/utils";

// Longest delay setTimeout supports (~24.8 days); later expiries are caught on the next page load.
const MAX_TIMEOUT_MS = 2 ** 31 - 1;

function shouldHide(rev: string, expiresAt: string | null) {
  if (expiresAt && Date.parse(expiresAt) <= Date.now()) return true;
  try {
    return localStorage.getItem(ANNOUNCEMENT_DISMISSED_KEY) === rev;
  } catch {
    return false;
  }
}

export function AnnouncementBar({
  rev,
  message,
  urgent,
  href,
  linkText,
  expiresAt,
}: {
  /** Document revision: a dismissal only applies to the version that was dismissed. */
  rev: string;
  message: string;
  urgent: boolean;
  href: string | null;
  linkText: string;
  expiresAt: string | null;
}) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // Mirrors the inline script; also re-runs when a live content update changes the banner.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing with localStorage and the clock after hydration
    setHidden(shouldHide(rev, expiresAt));
    if (!expiresAt) return;
    const remaining = Date.parse(expiresAt) - Date.now();
    if (remaining <= 0 || remaining > MAX_TIMEOUT_MS) return;
    const timer = setTimeout(() => setHidden(true), remaining);
    return () => clearTimeout(timer);
  }, [rev, expiresAt]);

  function dismiss() {
    try {
      localStorage.setItem(ANNOUNCEMENT_DISMISSED_KEY, rev);
    } catch {
      // Storage unavailable (e.g. private mode): hide for this page view only.
    }
    setHidden(true);
  }

  const Icon = urgent ? TriangleAlert : Megaphone;
  const linkClass = "whitespace-nowrap font-semibold underline underline-offset-2 hover:no-underline";
  const isInternal = href?.startsWith("/");
  const opensNewTab = href && !isInternal && !/^(mailto|tel):/.test(href);

  return (
    <aside
      id={ANNOUNCEMENT_ELEMENT_ID}
      aria-label="Announcement"
      data-rev={rev}
      data-expires={expiresAt ?? undefined}
      hidden={hidden}
      // The inline script may set `hidden` before hydration.
      suppressHydrationWarning
      className={cn(
        "w-full",
        // Fixed yellow (not a theme token) so urgent notices stand out in every theme.
        urgent ? "bg-yellow-300 text-neutral-950" : "bg-primary text-primary-foreground",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-start gap-3 px-4 py-2.5 sm:items-center">
        <div className="flex flex-1 items-start gap-2 sm:items-center sm:justify-center">
          <Icon className="mt-0.5 h-4 w-4 shrink-0 sm:mt-0" aria-hidden="true" />
          <p className="text-sm font-medium sm:text-base">
            {message}
            {href && (
              <>
                {" "}
                {isInternal ? (
                  <Link href={href} className={linkClass}>
                    {linkText}
                  </Link>
                ) : (
                  <a
                    href={href}
                    className={linkClass}
                    {...(opensNewTab && { target: "_blank", rel: "noopener noreferrer" })}
                  >
                    {linkText}
                  </a>
                )}
              </>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss announcement"
          className="-m-1 shrink-0 rounded p-1 transition-colors hover:bg-black/10 focus-visible:outline-2 focus-visible:outline-current"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
}
