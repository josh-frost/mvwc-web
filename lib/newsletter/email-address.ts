// Practical email check: something@domain.tld, no spaces, within the RFC length limit.
// Deliverability is ultimately proven by the subscriber clicking the confirmation link.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_EMAIL_LENGTH = 254;

/** Returns the normalized (trimmed, lowercased) address, or null if it isn't valid. */
export function normalizeEmail(value: unknown) {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  if (email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) return null;
  return email;
}
