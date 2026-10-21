import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import { sanityFetch } from "@/sanity/lib/live";
import { ContentSections } from "@/components/content-sections";
import { pageMetadata, SEO_PROJECTION, type Seo } from "@/lib/metadata";
import { formatEventDate, formatEventTime } from "@/lib/datetime";

// Upcoming vs. results is decided at render time, so re-render hourly to move
// finished events into results even when no content has changed.
export const revalidate = 3600;

const MAX_RESULTS = 10;

const SCHEDULE_QUERY = `{
  "page": *[_type == "schedulePage" && _id == "schedulePage"][0]{
    intro,
    practices[]{ _key, group, days, time, location, notes },
    seasonNote
  },
  "events": *[_type == "event" && defined(start)] | order(start asc){
    _id,
    title,
    eventType,
    start,
    end,
    location,
    description,
    opponent,
    isHomeEvent,
    result
  }
}`;

type Practice = {
  _key: string;
  group: string;
  days?: string[];
  time?: string;
  location?: string;
  notes?: string;
};

type Event = {
  _id: string;
  title: string;
  eventType: "match" | "tournament" | "other";
  start: string;
  end?: string;
  location?: string;
  description?: string;
  opponent?: string;
  isHomeEvent?: boolean;
  result?: string;
};

type ScheduleData = {
  page: { intro?: string; practices?: Practice[]; seasonNote?: string } | null;
  events: Event[];
};

const SCHEDULE_METADATA_QUERY = `*[_type == "schedulePage" && _id == "schedulePage"][0]{
  intro, ${SEO_PROJECTION}
}`;

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await sanityFetch({ query: SCHEDULE_METADATA_QUERY, stega: false });
  const page = data as { intro?: string; seo?: Seo } | null;
  return pageMetadata({
    seo: page?.seo,
    title: "Schedule",
    description: page?.intro || "Practice times, upcoming events, and recent results.",
    path: "/schedule",
  });
}

function renderEvent(event: Event) {
  return (
    <div key={event._id} className="border rounded-lg p-4 space-y-2">
      <div className="flex flex-wrap justify-between items-start gap-2">
        <h3 className="font-semibold">
          {event.title}
          {event.opponent && ` vs ${event.opponent}`}
        </h3>
        <div className="flex gap-2">
          {event.isHomeEvent !== undefined && event.isHomeEvent !== null && (
            <span
              // Theme tokens rather than dark: variants, which follow the OS setting, not the theme toggle
              className={`text-sm px-2 py-1 rounded ${
                event.isHomeEvent
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-foreground"
              }`}
            >
              {event.isHomeEvent ? "Home" : "Away"}
            </span>
          )}
          <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded capitalize">
            {event.eventType}
          </span>
        </div>
      </div>
      <p className="text-muted-foreground">{formatEventDate(event.start)}</p>
      <p className="text-sm text-muted-foreground">{formatEventTime(event.start, event.end)}</p>
      {event.location && (
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {event.location}
        </p>
      )}
      {event.result && <p className="text-sm font-medium">Result: {event.result}</p>}
      {event.description && (
        <p className="text-sm text-muted-foreground">{event.description}</p>
      )}
    </div>
  );
}

export default async function SchedulePage() {
  const { data } = await sanityFetch({ query: SCHEDULE_QUERY });
  const { page, events } = (data as ScheduleData) ?? { page: null, events: [] };
  const practices = page?.practices ?? [];

  // An event counts as upcoming until it ends (or starts, if it has no end).
  // Reading the clock is intentional: this server component re-renders hourly (see `revalidate`).
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();
  const isUpcoming = (event: Event) => new Date(event.end ?? event.start).getTime() >= now;
  const upcoming = events.filter(isUpcoming);
  const results = events
    .filter((event) => !isUpcoming(event))
    .reverse()
    .slice(0, MAX_RESULTS);

  return (
    <div className="container px-4 sm:px-6 lg:px-8 py-12 md:py-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Schedule</h1>
        {page?.intro && <p className="text-muted-foreground mb-8">{page.intro}</p>}
        <div className="space-y-8">
          {/* Practice Schedule */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Practice Schedule</h2>
            {page?.seasonNote && (
              <p className="text-muted-foreground mb-4">{page.seasonNote}</p>
            )}
            {practices.length > 0 ? (
              <div className="space-y-4">
                {practices.map((practice) => (
                  <div key={practice._key} className="border rounded-lg p-4 space-y-2">
                    <h3 className="font-semibold">{practice.group}</h3>
                    {practice.days && practice.days.length > 0 && (
                      <p className="text-muted-foreground">{practice.days.join(", ")}</p>
                    )}
                    {practice.time && (
                      <p className="text-sm text-muted-foreground">{practice.time}</p>
                    )}
                    {practice.location && (
                      <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        {practice.location}
                      </p>
                    )}
                    {practice.notes && (
                      <p className="text-sm text-muted-foreground">{practice.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                Practice times and locations will be posted here.
              </p>
            )}
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
            {upcoming.length > 0 ? (
              <div className="space-y-4">{upcoming.map(renderEvent)}</div>
            ) : (
              <p className="text-muted-foreground">
                No upcoming events right now. Check back soon.
              </p>
            )}
          </section>

          {results.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">Recent Results</h2>
              <div className="space-y-4">{results.map(renderEvent)}</div>
            </section>
          )}

          <ContentSections page="schedule" />
        </div>
      </div>
    </div>
  );
}
