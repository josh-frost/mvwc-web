import { sanityFetch } from "@/sanity/lib/live";

const EVENTS_QUERY = `*[_type == "event"] | order(date asc){
  _id,
  title,
  eventType,
  date,
  startTime,
  endTime,
  location,
  description,
  ageGroup,
  isRecurring,
  recurringPattern,
  opponent,
  isHomeEvent,
  result
}`;

type Event = {
  _id: string;
  title: string;
  eventType: "practice" | "match" | "tournament" | "other";
  date: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  description?: string;
  ageGroup?: string;
  isRecurring?: boolean;
  recurringPattern?: string;
  opponent?: string;
  isHomeEvent?: boolean;
  result?: string;
};

export default async function SchedulePage() {
  const { data: events } = await sanityFetch({ query: EVENTS_QUERY });

  const practices = events?.filter((e: Event) => e.eventType === "practice") || [];
  const matches =
    events?.filter(
      (e: Event) => e.eventType === "match" || e.eventType === "tournament",
    ) || [];

  const formatDate = (dateString: string) => {
    // Append T00:00:00 to treat the date as local time, not UTC
    // Without this, "2026-02-15" is parsed as midnight UTC, which can
    // display as the previous day in timezones behind UTC
    const localDate = new Date(dateString + "T00:00:00");
    return localDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (start?: string, end?: string) => {
    if (!start) return null;
    return end ? `${start} - ${end}` : start;
  };

  return (
    <div className="container px-4 sm:px-6 lg:px-8 py-12 md:py-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Schedule</h1>
        <div className="space-y-8">
          {/* Practice Schedule */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Practice Schedule</h2>
            {practices.length > 0 ? (
              <div className="space-y-4">
                {practices.map((practice: Event) => (
                  <div key={practice._id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{practice.title}</h3>
                      {practice.ageGroup && (
                        <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                          {practice.ageGroup}
                        </span>
                      )}
                    </div>
                    {practice.isRecurring && practice.recurringPattern ? (
                      <p className="text-muted-foreground">{practice.recurringPattern}</p>
                    ) : (
                      <p className="text-muted-foreground">{formatDate(practice.date)}</p>
                    )}
                    {formatTime(practice.startTime, practice.endTime) && (
                      <p className="text-sm text-muted-foreground">
                        {formatTime(practice.startTime, practice.endTime)}
                      </p>
                    )}
                    {practice.location && (
                      <p className="text-sm text-muted-foreground">
                        📍 {practice.location}
                      </p>
                    )}
                    {practice.description && (
                      <p className="text-sm text-muted-foreground">
                        {practice.description}
                      </p>
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

          {/* Matches & Tournaments */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Upcoming Matches</h2>
            {matches.length > 0 ? (
              <div className="space-y-4">
                {matches.map((match: Event) => (
                  <div key={match._id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">
                        {match.title}
                        {match.opponent && ` vs ${match.opponent}`}
                      </h3>
                      <div className="flex gap-2">
                        {match.isHomeEvent !== undefined && (
                          <span
                            className={`text-sm px-2 py-1 rounded ${
                              match.isHomeEvent
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            }`}
                          >
                            {match.isHomeEvent ? "Home" : "Away"}
                          </span>
                        )}
                        <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded capitalize">
                          {match.eventType}
                        </span>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{formatDate(match.date)}</p>
                    {formatTime(match.startTime, match.endTime) && (
                      <p className="text-sm text-muted-foreground">
                        {formatTime(match.startTime, match.endTime)}
                      </p>
                    )}
                    {match.location && (
                      <p className="text-sm text-muted-foreground">📍 {match.location}</p>
                    )}
                    {match.result && (
                      <p className="text-sm font-medium">Result: {match.result}</p>
                    )}
                    {match.description && (
                      <p className="text-sm text-muted-foreground">{match.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Match schedule coming soon.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
