import { brandImage } from "@/lib/brand-image";

// Square logo for structured data (Google prefers a square-ish logo, at least 112×112).
export const dynamic = "force-static";

export function GET() {
  return brandImage({ width: 512, height: 512, logoWidth: 420 });
}
