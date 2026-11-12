import { stegaClean } from "next-sanity";
import { MapPin } from "lucide-react";
import { mapUrl, placeQuery } from "@/lib/maps";

/** A location line that opens the place in Google Maps (the maps app on phones). */
export function MapLink({
  location,
  address,
  isHomeEvent,
  area,
}: {
  location?: string | null;
  address?: string | null;
  isHomeEvent?: boolean | null;
  area: string;
}) {
  if (!location && !address) return null;
  const query = placeQuery(
    { location: stegaClean(location), address: stegaClean(address), isHomeEvent },
    area,
  );

  return (
    <p className="flex items-start gap-1.5 text-sm text-muted-foreground">
      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {query ? (
        <a
          href={mapUrl(query)}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-dotted underline-offset-2 hover:text-foreground hover:decoration-solid"
        >
          {location || address}
          <span className="sr-only"> (open in maps)</span>
        </a>
      ) : (
        <span>{location || address}</span>
      )}
    </p>
  );
}
