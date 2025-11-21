"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileNav } from "./mobile-nav";
import { navLinks } from "./nav-links";

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between px-6 md:px-8">
        <div className="flex items-center gap-12">
          <Link
            href="/"
            className="flex items-center transition-opacity hover:opacity-80 py-2"
          >
            <Image
              src="/main-logo.svg"
              alt="MVWC Logo"
              width={120}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>
          <nav className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm lg:text-base xl:text-lg font-semibold transition-all duration-200 hover:text-foreground relative group px-4 py-6 ${
                  pathname === link.href ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-0 left-0 right-0 h-0.5 bg-primary transition-all duration-200 ${
                    pathname === link.href
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-50"
                  }`}
                />
              </Link>
            ))}
          </nav>
        </div>
        <MobileNav />
      </div>
    </header>
  );
}
