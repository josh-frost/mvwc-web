import { defineField, defineType } from "sanity";

export const homePageType = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
      description: "Optional subtitle or tagline displayed below the title",
    }),
    defineField({
      name: "showComingSoon",
      title: "Show Coming Soon",
      type: "boolean",
      description: "Toggle to show/hide the 'Coming Soon' message",
      initialValue: true,
    }),
    defineField({
      name: "body",
      title: "Body Content",
      type: "array",
      of: [{ type: "block" }],
      description: "Optional content to display on the home page",
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare() {
      return {
        title: "Home Page",
      };
    },
  },
});
