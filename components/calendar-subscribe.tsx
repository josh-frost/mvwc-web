import { CalendarSync } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyLinkButton } from "@/components/copy-link-button";
import { calendarFeedUrls } from "@/lib/calendar";

/** Schedule page box for subscribing to the club calendar feed (/calendar.ics). */
export function CalendarSubscribe() {
  const urls = calendarFeedUrls();
  return (
    <div className="rounded-lg border bg-muted/40 p-4 space-y-3">
      <div className="flex items-start gap-2">
        <CalendarSync className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
        <div className="space-y-1">
          <h3 className="font-semibold">Get the schedule in your calendar</h3>
          <p className="text-sm text-muted-foreground">
            Subscribe once and matches, tournaments and club events show up in your calendar, with
            changes and cancellations updated automatically.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button asChild size="sm">
          <a href={urls.webcal}>iPhone, Mac &amp; Outlook</a>
        </Button>
        <Button asChild size="sm">
          <a href={urls.google} target="_blank" rel="noopener noreferrer">
            Google Calendar
          </a>
        </Button>
        <CopyLinkButton url={urls.https} label="Copy calendar link" />
      </div>
      <p className="text-xs text-muted-foreground">
        Calendar apps check for updates every few hours; Google Calendar can take up to a day.
        On Android, use the Google Calendar option.
      </p>
    </div>
  );
}
