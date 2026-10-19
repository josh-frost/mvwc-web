import { defineField } from "sanity";

// Image field with hotspot and required alt text.
export function defineImageField({
  name,
  title,
  description,
  group,
}: {
  name: string;
  title: string;
  description?: string;
  group?: string;
}) {
  return defineField({
    name,
    title,
    type: "image",
    description,
    group,
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        title: "Alternative Text",
        type: "string",
        description: "Describe the image for screen readers and search engines",
        validation: (Rule) =>
          Rule.custom((alt, context) => {
            const parent = context.parent as { asset?: unknown } | undefined;
            return parent?.asset && !alt ? "Alternative text is required" : true;
          }),
      }),
    ],
  });
}

export const seoField = defineField({
  name: "seo",
  title: "SEO",
  type: "seo",
  group: "seo",
});

export const contentGroups = [
  { name: "content", title: "Content", default: true },
  { name: "seo", title: "SEO" },
];
