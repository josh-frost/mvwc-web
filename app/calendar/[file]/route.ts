import { sanityClient } from "@/sanity/lib/client";
import { CALENDAR_EVENT_QUERY, icsCalendar } from "@/lib/calendar";

export const revalidate = 3600;

/** One event as an .ics file (/calendar/<event id>.ics), for "Add to calendar" in Apple Calendar and Outlook. */
export async function GET(_request: Request, ctx: RouteContext<"/calendar/[file]">) {
  const { file } = await ctx.params;
  const id = decodeURIComponent(file).replace(/\.ics$/, "");
  // Published event IDs never contain dots (drafts and versions do).
  if (!file.endsWith(".ics") || !id || id.includes(".")) return notFound();

  const { event, contact } = await sanityClient.fetch(
    CALENDAR_EVENT_QUERY,
    { id },
    { perspective: "published", stega: false, next: { revalidate } },
  );
  if (!event) return notFound();

  const filename = event.title.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "event";
  return new Response(icsCalendar([event], contact, { feed: false }), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}.ics"`,
    },
  });
}

function notFound() {
  return new Response("Not found", { status: 404 });
}
