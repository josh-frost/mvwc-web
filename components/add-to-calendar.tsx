import { stegaClean } from "next-sanity";
import { CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { eventDownloadPath, googleCalendarEventUrl, type CalendarLinkEvent } from "@/lib/calendar";

/** "Add to calendar" menu for one event: Google Calendar, or an .ics file for Apple Calendar and Outlook. */
export function AddToCalendar({ event, area }: { event: CalendarLinkEvent; area: string }) {
  const clean = stegaClean(event);
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <CalendarPlus aria-hidden="true" />
          Add to calendar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem asChild>
          <a href={googleCalendarEventUrl(clean, area)} target="_blank" rel="noopener noreferrer">
            Google Calendar
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={eventDownloadPath(clean)} download>
            Apple Calendar / Outlook (.ics)
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
