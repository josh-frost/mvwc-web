export const SITE_NAME = "Mount Vernon Wrestling Club";

// Canonical production URL. Used for absolute URLs in metadata, sitemap, and robots.
export const SITE_URL = "https://www.mountvernonwrestlingclub.com";

export const DEFAULT_DESCRIPTION =
  "Youth wrestling in Mount Vernon, Iowa. Practice schedules, events, results, and club news.";

// Only the production deployment should be indexed by search engines; Vercel
// previews and local builds are marked noindex.
//
// IMPORTANT: this fails closed. VERCEL_ENV is only set when the Vercel project's
// "Enable access to System Environment Variables" setting is on (verified on
// 2026-10-20). If that setting is turned off, or the site is self-hosted or moved
// to another host, VERCEL_ENV is undefined and PRODUCTION would get robots.txt
// "Disallow: /" plus noindex on every page. In that case, set VERCEL_ENV=production
// in the production environment, or change this check (e.g. to an explicit
// SITE_ENV variable). Used by app/robots.ts and app/(site)/layout.tsx.
export const isProductionDeployment = process.env.VERCEL_ENV === "production";
