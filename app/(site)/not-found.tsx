import type { Metadata } from "next";
import Link from "next/link";
import { navLinks } from "@/components/navigation/nav-links";

export const metadata: Metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <main className="container px-4 sm:px-6 lg:px-8 py-24 md:py-32">
      <div className="max-w-xl mx-auto text-center">
        <p className="text-sm font-semibold text-muted-foreground">404</p>
        <h1 className="mt-2 text-4xl font-bold">Page not found</h1>
        <p className="mt-4 text-muted-foreground">
          Sorry, we couldn&apos;t find that page. It may have moved, or the link may be out of
          date.
        </p>
        <nav aria-label="Suggested pages" className="mt-8">
          <ul className="flex flex-wrap justify-center gap-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-block rounded-md border px-4 py-2 text-sm transition-colors hover:bg-primary/10"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </main>
  );
}
