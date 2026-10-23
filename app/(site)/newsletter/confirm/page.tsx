import type { Metadata } from "next";
import Link from "next/link";
import { NewsletterConfirmForm } from "@/components/newsletter-confirm-form";
import { verifyConfirmToken } from "@/lib/newsletter/token";

export const metadata: Metadata = {
  title: "Confirm Subscription",
  robots: { index: false, follow: false },
};

export default async function NewsletterConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const { token: rawToken } = await searchParams;
  const token = typeof rawToken === "string" ? rawToken : undefined;
  let result: ReturnType<typeof verifyConfirmToken>;
  try {
    result = verifyConfirmToken(token);
  } catch (error) {
    // Misconfiguration (e.g. NEWSLETTER_CONFIRMATION_SECRET missing): show the invalid-link message, log why.
    console.error("Newsletter token check failed:", error instanceof Error ? error.message : error);
    result = { status: "invalid" };
  }

  return (
    <main className="container px-4 sm:px-6 lg:px-8 py-24 md:py-32">
      <div className="max-w-xl mx-auto text-center">
        {result.status === "valid" && token ? (
          <NewsletterConfirmForm token={token} email={result.email} />
        ) : (
          <div>
            <h1 className="text-4xl font-bold">
              {result.status === "expired" ? "This link has expired" : "This link isn't valid"}
            </h1>
            <p className="mt-4 text-muted-foreground">
              {result.status === "expired"
                ? "Confirmation links last 72 hours."
                : "The confirmation link may be incomplete or out of date."}{" "}
              You can sign up again on the home page.
            </p>
            <Link href="/#newsletter" className="mt-8 inline-block underline">
              Sign up for email updates
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
