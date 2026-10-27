// Sanity stores datetimes in UTC; always display them in the club's local time
// so server-rendered pages don't depend on the server's timezone.
export const SITE_TIME_ZONE = "America/Chicago";

export function formatEventDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    timeZone: SITE_TIME_ZONE,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatEventTime(start: string, end?: string | null) {
  const fmt = (iso: string) =>
    new Date(iso).toLocaleTimeString("en-US", {
      timeZone: SITE_TIME_ZONE,
      hour: "numeric",
      minute: "2-digit",
    });
  return end ? `${fmt(start)} – ${fmt(end)}` : fmt(start);
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    timeZone: SITE_TIME_ZONE,
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
