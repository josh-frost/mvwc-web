import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMetadata, SEO_PROJECTION, type Seo } from "@/lib/metadata";
import { truncateText } from "@/lib/text";
import type { PortableTextBlock } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";
import { PortableText } from "@/components/portable-text";
import { SanityImage, type SanityImageValue } from "@/components/sanity-image";
import { formatDate } from "@/lib/datetime";

const POST_SLUGS_QUERY = `*[_type == "post" && defined(slug.current)]{ "slug": slug.current }`;

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]{
  title,
  publishedAt,
  coverImage,
  body
}`;

type Post = {
  title: string;
  publishedAt?: string;
  coverImage?: SanityImageValue;
  body?: PortableTextBlock[];
};

// Pre-render every published post at build time; new posts render on first request.
export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: POST_SLUGS_QUERY,
    perspective: "published",
    stega: false,
  });
  return (data as { slug: string }[] | null) ?? [];
}

const POST_METADATA_QUERY = `*[_type == "post" && slug.current == $slug][0]{
  title, excerpt, "bodyText": pt::text(body), coverImage, ${SEO_PROJECTION}
}`;

type PostPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await sanityFetch({ query: POST_METADATA_QUERY, params: { slug }, stega: false });
  const post = data as {
    title: string;
    excerpt?: string;
    bodyText?: string;
    coverImage?: SanityImageValue;
    seo?: Seo;
  } | null;
  if (!post) return { title: "Post Not Found" };

  const metadata = pageMetadata({
    seo: post.seo,
    title: post.title,
    description: post.excerpt || truncateText(post.bodyText ?? "", 160),
    image: post.coverImage,
    path: `/news/${slug}`,
  });
  return { ...metadata, openGraph: { ...metadata.openGraph, type: "article" } };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const { data } = await sanityFetch({ query: POST_QUERY, params: { slug } });
  const post = data as Post | null;
  if (!post) notFound();

  return (
    <main className="container px-4 sm:px-6 lg:px-8 py-12 md:py-24">
      <article className="max-w-3xl mx-auto">
        <Link
          href="/news"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← All news
        </Link>
        <h1 className="text-4xl font-bold mt-4 mb-2">{post.title}</h1>
        {post.publishedAt && (
          <p className="text-sm text-muted-foreground mb-8">
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          </p>
        )}
        <SanityImage
          image={post.coverImage}
          width={1200}
          aspect={16 / 9}
          sizes="(min-width: 768px) 768px, 100vw"
          priority
          className="mb-8 rounded-lg"
        />
        <PortableText value={post.body} />
      </article>
    </main>
  );
}
