import { sanityFetch } from "@/sanity/lib/live";
import { PortableText } from "next-sanity";

const ABOUT_QUERY = `*[_type == "aboutPage" && _id == "aboutPage"][0]{
  title,
  mission,
  body,
  history
}`;

export default async function AboutPage() {
  const { data: aboutPage } = await sanityFetch({ query: ABOUT_QUERY });

  return (
    <main className="container py-12 md:py-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">
          {aboutPage?.title || "Mount Vernon Wrestling Club"}
        </h1>

        {aboutPage?.mission && (
          <div className="mb-8">
            <p className="text-xl text-muted-foreground italic">{aboutPage.mission}</p>
          </div>
        )}

        {aboutPage?.body && (
          <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
            <PortableText value={aboutPage.body} />
          </div>
        )}

        {aboutPage?.history && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">Our History</h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <PortableText value={aboutPage.history} />
            </div>
          </div>
        )}

        {!aboutPage && (
          <p className="text-muted-foreground">
            Content coming soon. Check back later for information about Mount Vernon
            Wrestling Club.
          </p>
        )}
      </div>
    </main>
  );
}
