export const SITE_NAME = "Mount Vernon Wrestling Club";

// Canonical production URL. Used for absolute URLs in metadata, sitemap, and robots.
export const SITE_URL = "https://www.mountvernonwrestlingclub.com";

export const DEFAULT_DESCRIPTION =
  "Youth wrestling in Mount Vernon, Iowa. Practice schedules, events, results, and club news.";

// Only the production deployment should be indexed by search engines; Vercel
// previews and local builds are marked noindex.
export const isProductionDeployment = process.env.VERCEL_ENV === "production";
