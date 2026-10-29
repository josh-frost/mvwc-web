/** Escapes text for use in email HTML (element content and quoted attributes). */
export const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
