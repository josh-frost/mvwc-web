// Shared by AnnouncementBar (client) and the inline script in AnnouncementBanner (server).
// Kept out of the "use client" module: server code importing values from it gets client
// references, not the strings.
export const ANNOUNCEMENT_ELEMENT_ID = "site-announcement";
export const ANNOUNCEMENT_DISMISSED_KEY = "mvwc-announcement-dismissed";
