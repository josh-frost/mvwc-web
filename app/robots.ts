import type { MetadataRoute } from "next";
import { isProductionDeployment, SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Keep Vercel previews and local builds out of search engines entirely.
  if (!isProductionDeployment) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: "/admin" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
