import type { PortableTextBlock } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";
import { PortableText } from "@/components/portable-text";
import { SanityImage, type SanityImageValue } from "@/components/sanity-image";
import { cn } from "@/lib/utils";

// Sections without an order sort after numbered ones, then oldest first.
const SECTIONS_QUERY = `*[_type == "content" && page == $page]
  | order(coalesce(order, 9999) asc, _createdAt asc){
  _id,
  title,
  "anchor": slug.current,
  image,
  body
}`;

type Section = {
  _id: string;
  title: string;
  anchor?: string;
  image?: SanityImageValue;
  body?: PortableTextBlock[];
};

export type ContentPage = "home" | "about" | "schedule" | "news" | "contact";

/** Renders the Content Sections assigned to a page in the Studio. */
export async function ContentSections({
  page,
  className,
}: {
  page: ContentPage;
  className?: string;
}) {
  const { data } = await sanityFetch({ query: SECTIONS_QUERY, params: { page } });
  const sections = (data as Section[] | null) ?? [];
  if (sections.length === 0) return null;

  return (
    <div className={cn("space-y-14 md:space-y-16", className)}>
      {sections.map((section) => (
        <section key={section._id} id={section.anchor} className="scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
          {section.image && (
            <SanityImage
              image={section.image}
              width={1200}
              sizes="(min-width: 768px) 768px, 100vw"
              className="mb-6 rounded-lg"
            />
          )}
          <PortableText value={section.body} />
        </section>
      ))}
    </div>
  );
}
