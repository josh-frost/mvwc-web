import { defineField, defineType } from "sanity";

export const seoType = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  description: "Optional overrides for search results and link previews",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Defaults to the page title",
      validation: (Rule) => Rule.max(60).warning("Titles over 60 characters may be cut off"),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
      validation: (Rule) =>
        Rule.max(160).warning("Descriptions over 160 characters may be cut off"),
    }),
    defineField({
      name: "image",
      title: "Share Image",
      type: "image",
      description: "Shown when the page is shared on social media (1200×630 recommended)",
    }),
  ],
});
