import { brandImage } from "@/lib/brand-image";

// Default share image at a stable URL (/og-image.png): the MVWC logo in the Home
// theme colors. Used by lib/metadata.ts when a page has no SEO or page image.
// A plain route (not the opengraph-image file convention) because pages that set
// their own openGraph metadata replace the inherited file-based image entirely.
export const dynamic = "force-static";

export function GET() {
  return brandImage({ width: 1200, height: 630, logoWidth: 640 });
}
