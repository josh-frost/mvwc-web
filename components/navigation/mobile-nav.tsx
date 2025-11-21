"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { navLinks } from "./nav-links";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden hover:bg-accent transition-colors"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader className="mb-8 flex items-center gap-3">
          <Image
            src="/main-logo.svg"
            alt="MVWC Logo"
            width={80}
            height={26}
            className="h-8 w-auto"
          />
        </SheetHeader>
        <Separator className="my-6" />
        <nav className="flex flex-col space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`text-base sm:text-lg font-semibold transition-all duration-200 hover:text-foreground hover:translate-x-1 py-3 ${
                pathname === link.href
                  ? "text-foreground border-l-2 border-primary pl-4"
                  : "text-muted-foreground pl-4"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
