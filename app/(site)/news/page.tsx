import type { Metadata } from "next";
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/live";
import { pageMetadata } from "@/lib/metadata";
import { ContentSections } from "@/components/content-sections";
import { SanityImage, type SanityImageValue } from "@/components/sanity-image";
import { formatDate } from "@/lib/datetime";
import { truncateText } from "@/lib/text";

const POSTS_QUERY = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc){
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  coverImage,
  excerpt,
  "bodyText": pt::text(body)
}`;

type PostSummary = {
  _id: string;
  title: string;
  slug: string;
  publishedAt?: string;
  coverImage?: SanityImageValue;
  excerpt?: string;
  bodyText?: string;
};

export const metadata: Metadata = pageMetadata({
  title: "News",
  description: "Latest news and updates from Mount Vernon Wrestling Club.",
  path: "/news",
});

export default async function NewsPage() {
  const { data } = await sanityFetch({ query: POSTS_QUERY });
  const posts = (data as PostSummary[] | null) ?? [];

  return (
    <div className="container px-4 sm:px-6 lg:px-8 py-12 md:py-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">News</h1>
        <div className="space-y-6">
          <p className="text-muted-foreground">
            Latest news and updates from Mount Vernon Wrestling Club.
          </p>

          <ContentSections page="news" />

          {posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map((post) => (
                <article
                  key={post._id}
                  className="group relative overflow-hidden border rounded-lg transition-colors hover:bg-primary/5 sm:flex"
                >
                  {post.coverImage && (
                    <div className="sm:w-64 sm:shrink-0">
                      <SanityImage
                        image={post.coverImage}
                        width={640}
                        aspect={16 / 9}
                        sizes="(min-width: 640px) 256px, 100vw"
                        className="h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-2">
                      {/* Stretched link makes the whole card clickable */}
                      <Link
                        href={`/news/${post.slug}`}
                        className="after:absolute after:inset-0 group-hover:underline"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    {post.publishedAt && (
                      <p className="text-sm text-muted-foreground mb-4">
                        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                      </p>
                    )}
                    <p className="text-muted-foreground">
                      {post.excerpt || truncateText(post.bodyText ?? "", 200)}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2">Welcome to MVWC</h2>
              <p className="text-sm text-muted-foreground mb-4">Posted: Coming Soon</p>
              <p className="text-muted-foreground">
                Stay tuned for news, announcements, and updates about our wrestling
                program.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
