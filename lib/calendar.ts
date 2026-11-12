import { defineQuery } from "next-sanity";
import { isProductionDeployment, SITE_NAME, SITE_URL } from "@/lib/site";
import { SITE_TIME_ZONE } from "@/lib/datetime";
import { clubArea, placeQuery } from "@/lib/maps";
import type { CALENDAR_EVENTS_QUERY_RESULT } from "@/sanity.types";

// Calendar entries for events from the Studio: the subscribable feed (/calendar.ics), one-event
// downloads (/calendar/<id>.ics) and Google Calendar "add event" links. Practices aren't included:
// their times are free text, not dates.

/** How far back the feed goes, so subscribers keep recent events (and their results). */
const FEED_HISTORY_DAYS = 90;

/** Events without an end time are shown as this long in calendars. */
const DEFAULT_DURATION_MS = 2 * 60 * 60 * 1000;

/** How often calendar apps that honor it should re-check the feed. */
const REFRESH_INTERVAL = "PT6H";

const UID_DOMAIN = new URL(SITE_URL).hostname;

// The two queries project the same event fields (TypeGen needs literal GROQ, so they are repeated).
export const CALENDAR_EVENTS_QUERY = defineQuery(`{
  "events": *[_type == "event" && defined(start) && start >= $since] | order(start asc){
    _id, _updatedAt, title, eventType, start, end, location, address, description, opponent, isHomeEvent, result
  },
  "contact": *[_type == "contactInfo" && _id == "contactInfo"][0]{ city, state }
}`);

export const CALENDAR_EVENT_QUERY = defineQuery(`{
  "event": *[_type == "event" && _id == $id && defined(start)][0]{
    _id, _updatedAt, title, eventType, start, end, location, address, description, opponent, isHomeEvent, result
  },
  "contact": *[_type == "contactInfo" && _id == "contactInfo"][0]{ city, state }
}`);

export type CalendarEvent = CALENDAR_EVENTS_QUERY_RESULT["events"][number];

/** The event fields a Google Calendar link needs (the Schedule page's own query has them too). */
export type CalendarLinkEvent = Pick<
  CalendarEvent,
  "_id" | "title" | "start" | "end" | "location" | "address" | "description" | "opponent" | "isHomeEvent" | "result"
>;

export function feedSince(now = Date.now()) {
  return new Date(now - FEED_HISTORY_DAYS * 24 * 60 * 60 * 1000).toISOString();
}

/**
 * This deployment's own URL: the canonical domain in production, the branch URL on previews,
 * localhost in development. Calendar links point here so they can be tried before release.
 */
export function deploymentUrl() {
  if (isProductionDeployment) return SITE_URL;
  if (process.env.VERCEL_BRANCH_URL) return `https://${process.env.VERCEL_BRANCH_URL}`;
  return "http://localhost:3000";
}

export function calendarFeedUrls() {
  const https = `${deploymentUrl()}/calendar.ics`;
  const webcal = https.replace(/^https?:/, "webcal:");
  return {
    https,
    /** Opens the subscribe prompt in Apple Calendar, Outlook and most phone calendar apps. */
    webcal,
    /** Google Calendar's "add this calendar" page. Google fetches the feed itself, so it needs a public URL. */
    google: `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(webcal)}`,
  };
}

export function eventDownloadPath(event: { _id: string }) {
  return `/calendar/${encodeURIComponent(event._id)}.ics`;
}

export function eventSummary(event: Pick<CalendarEvent, "title" | "opponent">) {
  return event.opponent ? `${event.title} vs ${event.opponent}` : event.title;
}

function eventTimes(event: Pick<CalendarEvent, "start" | "end">) {
  const start = new Date(event.start);
  const end = event.end ? new Date(event.end) : new Date(start.getTime() + DEFAULT_DURATION_MS);
  return { start, end };
}

function eventDetails(event: CalendarLinkEvent) {
  const home = event.isHomeEvent === true ? "Home" : event.isHomeEvent === false ? "Away" : null;
  return [
    event.description?.trim(),
    event.result?.trim() && `Result: ${event.result.trim()}`,
    home,
    `${SITE_NAME}: ${SITE_URL}/schedule`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

/** Google Calendar link that opens a prefilled "new event" form. */
export function googleCalendarEventUrl(event: CalendarLinkEvent, area: string) {
  const { start, end } = eventTimes(event);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: eventSummary(event),
    dates: `${icsDate(start)}/${icsDate(end)}`,
    details: eventDetails(event),
    ctz: SITE_TIME_ZONE,
  });
  const location = placeQuery(event, area);
  if (location) params.set("location", location);
  return `https://calendar.google.com/calendar/render?${params}`;
}

// --- iCalendar (RFC 5545) ---

/** UTC date-time, e.g. 20261110T221500Z. */
function icsDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function icsText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

const encoder = new TextEncoder();

/** Lines longer than 75 bytes continue on the next line after a space, without splitting characters. */
function foldLine(line: string) {
  const parts: string[] = [];
  let current = "";
  let bytes = 0;
  for (const char of line) {
    const size = encoder.encode(char).length;
    const limit = parts.length === 0 ? 75 : 74; // continuation lines start with a space
    if (bytes + size > limit) {
      parts.push(current);
      current = "";
      bytes = 0;
    }
    current += char;
    bytes += size;
  }
  parts.push(current);
  return parts.join("\r\n ");
}

function icsEvent(event: CalendarEvent, area: string) {
  const { start, end } = eventTimes(event);
  const location = placeQuery(event, area);
  const updated = icsDate(new Date(event._updatedAt));
  return [
    "BEGIN:VEVENT",
    `UID:${event._id}@${UID_DOMAIN}`,
    `DTSTAMP:${updated}`,
    `LAST-MODIFIED:${updated}`,
    `DTSTART:${icsDate(start)}`,
    `DTEND:${icsDate(end)}`,
    `SUMMARY:${icsText(eventSummary(event))}`,
    ...(location ? [`LOCATION:${icsText(location)}`] : []),
    `DESCRIPTION:${icsText(eventDetails(event))}`,
    `URL:${SITE_URL}/schedule`,
    "END:VEVENT",
  ];
}

export function icsCalendar(
  events: CalendarEvent[],
  contact: { city?: string | null; state?: string | null } | null,
  options: { feed: boolean },
) {
  const area = clubArea(contact);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${SITE_NAME}//Schedule//EN`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...(options.feed
      ? [
          `X-WR-CALNAME:${icsText(SITE_NAME)}`,
          `X-WR-CALDESC:${icsText(`Matches, tournaments and club events from ${SITE_URL}/schedule`)}`,
          `X-WR-TIMEZONE:${SITE_TIME_ZONE}`,
          `REFRESH-INTERVAL;VALUE=DURATION:${REFRESH_INTERVAL}`,
          `X-PUBLISHED-TTL:${REFRESH_INTERVAL}`,
        ]
      : []),
    ...events.flatMap((event) => icsEvent(event, area)),
    "END:VCALENDAR",
  ];
  return lines.map(foldLine).join("\r\n") + "\r\n";
}
