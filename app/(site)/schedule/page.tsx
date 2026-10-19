import { sanityFetch } from "@/sanity/lib/live";
import { formatEventDate, formatEventTime } from "@/lib/datetime";

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

export default async function SchedulePage() {
  const { data } = await sanityFetch({ query: SCHEDULE_QUERY });
  const { page, events } = (data as ScheduleData) ?? { page: null, events: [] };
  const practices = page?.practices ?? [];

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
                      <p className="text-sm text-muted-foreground">📍 {practice.location}</p>
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

          {/* Matches, Tournaments & Events */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Events</h2>
            {events.length > 0 ? (
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event._id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">
                        {event.title}
                        {event.opponent && ` vs ${event.opponent}`}
                      </h3>
                      <div className="flex gap-2">
                        {event.isHomeEvent !== undefined && event.isHomeEvent !== null && (
                          <span
                            className={`text-sm px-2 py-1 rounded ${
                              event.isHomeEvent
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
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
                    <p className="text-sm text-muted-foreground">
                      {formatEventTime(event.start, event.end)}
                    </p>
                    {event.location && (
                      <p className="text-sm text-muted-foreground">📍 {event.location}</p>
                    )}
                    {event.result && (
                      <p className="text-sm font-medium">Result: {event.result}</p>
                    )}
                    {event.description && (
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Event schedule coming soon.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
