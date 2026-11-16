import { sanityClient } from "@/sanity/lib/client";
import { CALENDAR_EVENTS_QUERY, feedSince, icsCalendar } from "@/lib/calendar";

// Subscribable calendar of club events (webcal://…/calendar.ics). Regenerated hourly, and
// right away when content is published (the revalidation webhook refreshes every route).
export const revalidate = 3600;

export async function GET() {
  const { events, contact } = await sanityClient.fetch(
    CALENDAR_EVENTS_QUERY,
    { since: feedSince() },
    { perspective: "published", stega: false, next: { revalidate } },
  );
  return new Response(icsCalendar(events, contact, { feed: true }), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="mvwc-schedule.ics"',
    },
  });
}
