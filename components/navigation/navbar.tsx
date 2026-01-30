"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileNav } from "./mobile-nav";
import { navLinks } from "./nav-links";
import { ThemeToggle } from "@/components/theme-toggle";
import { MVWCLogo } from "@/components/mvwc-logo";

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/60">
      <div className="flex h-20 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center transition-opacity hover:opacity-80 py-2 text-primary"
          >
            <MVWCLogo className="h-10 w-auto" />
          </Link>
          <nav className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-base font-semibold transition-all duration-200 hover:text-foreground hover:bg-white/10 relative group px-4 py-6 ${
                  pathname === link.href ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {link.label}
                <span
                  className={`absolute bottom-0 left-0 right-0 h-0.5 bg-primary transition-all duration-200 ${
                    pathname === link.href
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-50"
                  }`}
                />
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center">
          <MobileNav />
          <div className="hidden lg:flex">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
