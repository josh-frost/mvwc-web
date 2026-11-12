"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CopyLinkButton({ url, label = "Copy link" }: { url: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Clipboard blocked (e.g. insecure context): let the visitor copy it by hand.
      window.prompt("Copy this link:", url);
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={copy}>
      {copied ? <Check aria-hidden="true" /> : <Link2 aria-hidden="true" />}
      <span aria-live="polite">{copied ? "Copied" : label}</span>
    </Button>
  );
}
