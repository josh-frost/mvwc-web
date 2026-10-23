import type { Metadata } from "next";
import type { PortableTextBlock } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";
import { pageMetadata, SEO_PROJECTION, type Seo } from "@/lib/metadata";
import { PortableText } from "@/components/portable-text";
import { ContentSections } from "@/components/content-sections";
import { SanityImage, type SanityImageValue } from "@/components/sanity-image";

const ABOUT_QUERY = `*[_type == "aboutPage" && _id == "aboutPage"][0]{
  title,
  missionHeading,
  mission,
  image,
  body,
  historyHeading,
  history
}`;

type AboutPageData = {
  title?: string;
  missionHeading?: string;
  mission?: string;
  image?: SanityImageValue;
  body?: PortableTextBlock[];
  historyHeading?: string;
  history?: PortableTextBlock[];
};

const ABOUT_METADATA_QUERY = `*[_type == "aboutPage" && _id == "aboutPage"][0]{
  title, mission, image, ${SEO_PROJECTION}
}`;

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await sanityFetch({ query: ABOUT_METADATA_QUERY, stega: false });
  const about = data as {
    title?: string;
    mission?: string;
    image?: SanityImageValue;
    seo?: Seo;
  } | null;
  return pageMetadata({
    seo: about?.seo,
    title: about?.title || "About",
    description: about?.mission,
    image: about?.image,
    path: "/about",
  });
}

export default async function AboutPage() {
  const { data } = await sanityFetch({ query: ABOUT_QUERY });
  const aboutPage = data as AboutPageData | null;

  return (
    <main className="container px-4 sm:px-6 lg:px-8 py-12 md:py-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 md:mb-12">
          {aboutPage?.title || "Mount Vernon Wrestling Club"}
        </h1>

        {/* Each block is its own section with the same heading style as Content Sections. */}
        <div className="space-y-14 md:space-y-16">
          {aboutPage?.mission && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                {aboutPage.missionHeading || "Our Mission"}
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-line">
                {aboutPage.mission}
              </p>
            </section>
          )}

          <SanityImage
            image={aboutPage?.image}
            width={1200}
            aspect={16 / 9}
            sizes="(min-width: 768px) 768px, 100vw"
            priority
            className="rounded-lg"
          />

          <PortableText value={aboutPage?.body} />

          <ContentSections page="about" />

          {aboutPage?.history && aboutPage.history.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                {aboutPage.historyHeading || "Our History"}
              </h2>
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
      </div>
    </main>
  );
}
