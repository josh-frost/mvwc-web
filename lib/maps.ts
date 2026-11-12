// The club's town, used to narrow map searches for a bare location name like "Middle School Gym".
// Contact Information's city and state override it when set.
const DEFAULT_AREA = "Mount Vernon, IA";

export function clubArea(contact?: { city?: string | null; state?: string | null } | null) {
  const area = [contact?.city, contact?.state].filter(Boolean).join(", ");
  return area || DEFAULT_AREA;
}

/**
 * Where a place is, as text a map or calendar app can search for: the location name plus its
 * address when one is set. Without an address, home and practice locations get the club's town
 * appended; away events (isHomeEvent === false) don't, since they're usually elsewhere.
 */
export function placeQuery(
  place: { location?: string | null; address?: string | null; isHomeEvent?: boolean | null },
  area: string,
) {
  const location = place.location?.trim();
  const address = place.address?.trim();
  if (address) return location ? `${location}, ${address}` : address;
  if (!location) return null;
  return place.isHomeEvent === false ? location : `${location}, ${area}`;
}

/** Google Maps search link; on phones it opens the maps app. */
export function mapUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
