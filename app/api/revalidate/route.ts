import type { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { parseBody } from "next-sanity/webhook";

// Called by a Sanity webhook whenever published content changes (setup in README).
//
// Pages and their Sanity fetches are cached. <SanityLive /> only refreshes that cache
// when a visitor's open browser receives the change, so content published while
// nobody has the site open would otherwise stay stale. The site is small, so any
// change refreshes every page; each page re-renders on its next visit.
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[revalidate] SANITY_WEBHOOK_SECRET is not set");
    return Response.json({ outcome: "not configured" }, { status: 500 });
  }

  try {
    // Also waits briefly so re-rendered pages see the just-published content.
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(request, secret, true);
    if (!isValidSignature) return Response.json({ outcome: "invalid signature" }, { status: 401 });
    revalidatePath("/", "layout");
    return Response.json({ outcome: "revalidated", type: body?._type ?? null });
  } catch {
    return Response.json({ outcome: "invalid body" }, { status: 400 });
  }
}
