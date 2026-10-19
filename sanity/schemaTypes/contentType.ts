import { defineField, defineType } from "sanity";
import { defineImageField } from "./fields";

// Pages that can display content sections. Values match the site routes.
export const contentPages = [
  { title: "Home", value: "home" },
  { title: "About", value: "about" },
  { title: "Schedule", value: "schedule" },
  { title: "News", value: "news" },
  { title: "Contact", value: "contact" },
];

// Modular content sections that can be added to any page.
export const contentType = defineType({
  name: "content",
  title: "Content Section",
  type: "document",
  fields: [
    defineField({
      name: "page",
      title: "Page",
      type: "string",
      description: "Which page this section appears on",
      options: { list: contentPages },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Anchor",
      type: "slug",
      description: "Optional. Lets you link directly to this section (e.g. /about#mission)",
      options: {
        source: "title",
        maxLength: 96,
      },
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Lower numbers appear first on the page",
      initialValue: 10,
      validation: (Rule) => Rule.integer(),
    }),
    defineImageField({ name: "image", title: "Image" }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
      validation: (Rule) => Rule.required(),
    }),
  ],
  orderings: [
    {
      title: "Page, then Order",
      name: "pageOrder",
      by: [
        { field: "page", direction: "asc" },
        { field: "order", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: {
      title: "title",
      page: "page",
      order: "order",
      media: "image",
    },
    prepare({ title, page, order, media }) {
      const pageLabel = contentPages.find((p) => p.value === page)?.title ?? "No page";
      return {
        title,
        subtitle: order === undefined ? pageLabel : `${pageLabel} · #${order}`,
        media,
      };
    },
  },
});
