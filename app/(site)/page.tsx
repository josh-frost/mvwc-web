import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import Link from "next/link";
import type { PortableTextBlock } from "next-sanity";
import { pageMetadata, SEO_PROJECTION, type Seo } from "@/lib/metadata";
import { SITE_NAME } from "@/lib/site";
import { MVWCLogo } from "@/components/mvwc-logo";
import { PortableText } from "@/components/portable-text";
import { ContentSections } from "@/components/content-sections";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { JsonLd } from "@/components/json-ld";
import {
  homeStructuredData,
  ORGANIZATION_CONTACT_QUERY,
  type OrganizationContact,
} from "@/lib/structured-data";
import { SanityImage, type SanityImageValue } from "@/components/sanity-image";
import { sanityFetch } from "@/sanity/lib/live";
import { formatDate, formatEventDate, formatEventTime } from "@/lib/datetime";
import { truncateText } from "@/lib/text";

// Upcoming events are picked at render time; re-render hourly so past events drop off.
export const revalidate = 3600;

const HOME_QUERY = `{
  "home": *[_type == "homePage" && _id == "homePage"][0]{
    title,
    subtitle,
    showComingSoon,
    heroImage,
    body,
    newsletter{ enabled, heading, text }
  },
  "events": *[_type == "event" && defined(start)] | order(start asc){
    _id, title, start, end, location, opponent
  },
  "posts": *[_type == "post" && defined(slug.current)] | order(publishedAt desc)[0...2]{
    _id, title, "slug": slug.current, publishedAt, excerpt, "bodyText": pt::text(body)
  }
}`;

type HomePageData = {
  home: {
    title?: string;
    subtitle?: string;
    showComingSoon?: boolean;
    heroImage?: SanityImageValue;
    body?: PortableTextBlock[];
    newsletter?: { enabled?: boolean; heading?: string; text?: string };
  } | null;
  events: {
    _id: string;
    title: string;
    start: string;
    end?: string;
    location?: string;
    opponent?: string;
  }[];
  posts: {
    _id: string;
    title: string;
    slug: string;
    publishedAt?: string;
    excerpt?: string;
    bodyText?: string;
  }[];
};

const HOME_METADATA_QUERY = `*[_type == "homePage" && _id == "homePage"][0]{
  title, subtitle, heroImage, ${SEO_PROJECTION}
}`;

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await sanityFetch({ query: HOME_METADATA_QUERY, stega: false });
  const home = data as {
    title?: string;
    subtitle?: string;
    heroImage?: SanityImageValue;
    seo?: Seo;
  } | null;
  return pageMetadata({
    seo: home?.seo,
    title: home?.title || SITE_NAME,
    description: home?.subtitle,
    image: home?.heroImage,
    path: "/",
    absoluteTitle: true,
  });
}

export default async function Home() {
  const [{ data }, { data: contact }] = await Promise.all([
    sanityFetch({ query: HOME_QUERY }),
    sanityFetch({ query: ORGANIZATION_CONTACT_QUERY, stega: false }),
  ]);
  const structuredData = <JsonLd data={homeStructuredData(contact as OrganizationContact)} />;
  const { home, events, posts } = (data as HomePageData | null) ?? {
    home: null,
    events: [],
    posts: [],
  };

  // Newsletter signup is on unless explicitly turned off in the Studio.
  const signup =
    home?.newsletter?.enabled !== false ? (
      <NewsletterSignup
        heading={home?.newsletter?.heading || "Stay in the loop"}
        text={home?.newsletter?.text || "Get club news, schedule updates, and announcements by email."}
      />
    ) : null;

  if (home?.showComingSoon !== false) {
    return (
      <div className="flex w-full justify-center items-center min-h-[calc(100vh-5rem)] bg-background font-sans">
        {structuredData}
        <main className="flex flex-col w-full max-w-3xl items-center justify-center py-16 px-4 sm:px-8 md:px-16">
          <MVWCLogo className="w-full max-w-2xl h-auto text-primary transition-colors duration-300" />
          <h1 className="text-center text-balance text-3xl sm:text-4xl font-semibold py-5 text-foreground">
            Coming Soon
          </h1>
          {signup && <div className="mt-8 w-full max-w-xl">{signup}</div>}
        </main>
      </div>
    );
  }

  // Reading the clock is intentional: this server component re-renders hourly (see `revalidate`).
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();
  const upcoming = events
    .filter((event) => new Date(event.end ?? event.start).getTime() >= now)
    .slice(0, 3);

  const hasPreviews = upcoming.length > 0 || posts.length > 0;

  return (
    <main className="w-full font-sans">
      {structuredData}
      {/* Hero */}
      <section className="flex flex-col items-center px-4 pt-12 pb-14 sm:px-8 md:pt-20 md:pb-20">
        {home.heroImage ? (
          <SanityImage
            image={home.heroImage}
            width={1600}
            aspect={21 / 9}
            sizes="(min-width: 1024px) 1024px, 100vw"
            priority
            className="mb-10 max-w-5xl rounded-lg"
          />
        ) : (
          <MVWCLogo className="mb-6 w-full max-w-xl h-auto text-primary transition-colors duration-300" />
        )}
        {home.title && (
          <h1 className="text-center text-balance text-3xl sm:text-4xl font-semibold text-foreground">
            {home.title}
          </h1>
        )}
        {home.subtitle && (
          <p className="mt-4 text-center text-balance text-lg sm:text-xl text-muted-foreground">
            {home.subtitle}
          </p>
        )}
      </section>

      <div className="mx-auto max-w-5xl px-4 pb-20 sm:px-8 md:pb-28 space-y-16 md:space-y-20">
        {home.body && home.body.length > 0 && (
          <PortableText value={home.body} className="mx-auto max-w-3xl" />
        )}

        <ContentSections page="home" className="mx-auto max-w-3xl" />

        {/* Signup comes before the previews: it's the main call to action. */}
        {signup && <div className="mx-auto max-w-3xl">{signup}</div>}

        {/* Upcoming events + latest news, each shown only when it has content. */}
        {hasPreviews && (
          <div
            className={`border-t border-border/40 pt-16 md:pt-20 grid gap-12 md:gap-10 ${
              upcoming.length > 0 && posts.length > 0 ? "md:grid-cols-2" : "mx-auto max-w-3xl"
            }`}
          >
            {upcoming.length > 0 && (
              <section>
                <div className="mb-5 flex items-baseline justify-between gap-4">
                  <h2 className="text-2xl font-semibold">Upcoming Events</h2>
                  <Link href="/schedule" className="text-sm text-muted-foreground hover:text-foreground">
                    Full schedule →
                  </Link>
                </div>
                <ul className="space-y-3">
                  {upcoming.map((event) => (
                    <li key={event._id} className="border rounded-lg p-4">
                      <p className="font-semibold">
                        {event.title}
                        {event.opponent && ` vs ${event.opponent}`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatEventDate(event.start)} · {formatEventTime(event.start, event.end)}
                      </p>
                      {event.location && (
                        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                          {event.location}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {posts.length > 0 && (
              <section>
                <div className="mb-5 flex items-baseline justify-between gap-4">
                  <h2 className="text-2xl font-semibold">Latest News</h2>
                  <Link href="/news" className="text-sm text-muted-foreground hover:text-foreground">
                    All news →
                  </Link>
                </div>
                <ul className="space-y-3">
                  {posts.map((post) => (
                    <li
                      key={post._id}
                      className="group relative border rounded-lg p-4 transition-colors hover:bg-primary/5"
                    >
                      <Link
                        href={`/news/${post.slug}`}
                        className="font-semibold after:absolute after:inset-0 group-hover:underline"
                      >
                        {post.title}
                      </Link>
                      {post.publishedAt && (
                        <p className="text-sm text-muted-foreground">
                          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                        </p>
                      )}
                      <p className="mt-2 text-sm text-muted-foreground">
                        {post.excerpt || truncateText(post.bodyText ?? "", 140)}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
