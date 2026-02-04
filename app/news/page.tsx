import { sanityFetch } from "@/sanity/lib/live";
import { PortableText } from "next-sanity";

const POSTS_QUERY = `*[_type == "post"] | order(publishedAt desc){
  _id,
  title,
  slug,
  publishedAt,
  excerpt,
  body
}`;

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  excerpt?: string;
  body: any[];
};

export default async function NewsPage() {
  const { data: posts } = await sanityFetch({ query: POSTS_QUERY });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="container px-4 sm:px-6 lg:px-8 py-12 md:py-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">News</h1>
        <div className="space-y-6">
          <p className="text-muted-foreground">
            Latest news and updates from Mount Vernon Wrestling Club.
          </p>

          {posts && posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map((post: Post) => (
                <article key={post._id} className="border rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Posted: {formatDate(post.publishedAt)}
                  </p>
                  {post.excerpt ? (
                    <p className="text-muted-foreground">{post.excerpt}</p>
                  ) : (
                    post.body && (
                      <div className="prose dark:prose-invert max-w-none text-muted-foreground">
                        <PortableText value={post.body} />
                      </div>
                    )
                  )}
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
