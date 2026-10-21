/** Shortens text to at most `max` characters, breaking at a word boundary. */
export function truncateText(text: string, max: number) {
  const trimmed = text.trim();
  return trimmed.length > max ? `${trimmed.slice(0, max).replace(/\s+\S*$/, "")}…` : trimmed;
}
