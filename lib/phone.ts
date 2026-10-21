/**
 * Builds a `tel:` href from a human-formatted phone number. Formatting is
 * stripped, and an extension ("ext. 2", "extension 2", "x2") is kept as a
 * dialing pause (",2"), which phone dialers wait on before entering the digits.
 */
export function telHref(phone: string) {
  const match = phone.match(/^(.*?)(?:[\s,]*(?:ext\.?|extension|x)\s*(\d+))?\s*$/i);
  const number = (match?.[1] ?? phone).replace(/[^\d+]/g, "");
  const extension = match?.[2];
  return `tel:${number}${extension ? `,${extension}` : ""}`;
}
