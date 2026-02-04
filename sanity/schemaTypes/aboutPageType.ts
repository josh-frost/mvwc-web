import { defineField, defineType } from "sanity";

export const aboutPageType = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "mission",
      title: "Mission Statement",
      type: "text",
      rows: 3,
      description: "Brief mission statement for the club",
    }),
    defineField({
      name: "body",
      title: "About Content",
      type: "array",
      of: [{ type: "block" }],
      description: "Main content about the wrestling club",
    }),
    defineField({
      name: "history",
      title: "Club History",
      type: "array",
      of: [{ type: "block" }],
      description: "History of the wrestling club",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "About Page",
      };
    },
  },
});
