import { defineQuery } from "next-sanity";
import type { MetadataRoute } from "next";
import { sanityClient } from "@/sanity/lib/client";
import { SITE_URL } from "@/lib/site";

// Regenerate hourly so new posts appear without a deploy.
export const revalidate = 3600;

const SITEMAP_QUERY = defineQuery(`{
  "pages": *[_id in ["homePage", "aboutPage", "schedulePage", "contactInfo"]]{ _id, _updatedAt },
  "posts": *[_type == "post" && defined(slug.current)] | order(publishedAt desc){
    "slug": slug.current, _updatedAt
  },
  "latestPost": *[_type == "post"] | order(_updatedAt desc)[0]._updatedAt,
  "latestEvent": *[_type == "event"] | order(_updatedAt desc)[0]._updatedAt
}`);


// The newest of the given timestamps, so a page's lastModified reflects any content it shows
function latest(...dates: (string | null | undefined)[]) {
  const times = dates.filter(Boolean).map((d) => new Date(d as string).getTime());
  return times.length ? new Date(Math.max(...times)) : undefined;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await sanityClient.fetch(
    SITEMAP_QUERY,
    {},
    { perspective: "published", stega: false, next: { revalidate } },
  );
  const updated = (id: string) => data.pages.find((p) => p._id === id)?._updatedAt;

  return [
    { url: `${SITE_URL}/`, lastModified: latest(updated("homePage"), data.latestPost, data.latestEvent) },
    { url: `${SITE_URL}/about`, lastModified: latest(updated("aboutPage")) },
    { url: `${SITE_URL}/schedule`, lastModified: latest(updated("schedulePage"), data.latestEvent) },
    { url: `${SITE_URL}/news`, lastModified: latest(data.latestPost) },
    { url: `${SITE_URL}/contact`, lastModified: latest(updated("contactInfo")) },
    ...data.posts.map((post) => ({
      url: `${SITE_URL}/news/${post.slug}`,
      lastModified: new Date(post._updatedAt),
    })),
  ];
}
