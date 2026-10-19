import type { PortableTextBlock } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";
import { PortableText } from "@/components/portable-text";
import { ContentSections } from "@/components/content-sections";
import { SanityImage, type SanityImageValue } from "@/components/sanity-image";

const ABOUT_QUERY = `*[_type == "aboutPage" && _id == "aboutPage"][0]{
  title,
  mission,
  image,
  body,
  history
}`;

type AboutPageData = {
  title?: string;
  mission?: string;
  image?: SanityImageValue;
  body?: PortableTextBlock[];
  history?: PortableTextBlock[];
};

export default async function AboutPage() {
  const { data } = await sanityFetch({ query: ABOUT_QUERY });
  const aboutPage = data as AboutPageData | null;

  return (
    <main className="container px-4 sm:px-6 lg:px-8 py-12 md:py-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">
          {aboutPage?.title || "Mount Vernon Wrestling Club"}
        </h1>

        {aboutPage?.mission && (
          <div className="mb-8">
            <p className="text-xl text-muted-foreground italic">{aboutPage.mission}</p>
          </div>
        )}

        <SanityImage
          image={aboutPage?.image}
          width={1200}
          aspect={16 / 9}
          sizes="(min-width: 768px) 768px, 100vw"
          priority
          className="mb-8 rounded-lg"
        />

        <PortableText value={aboutPage?.body} className="mb-8" />

        <ContentSections page="about" className="mb-12" />

        {aboutPage?.history && aboutPage.history.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">Our History</h2>
            <PortableText value={aboutPage.history} />
          </section>
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
