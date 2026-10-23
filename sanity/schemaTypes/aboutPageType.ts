import { defineField, defineType } from "sanity";
import { contentGroups, defineImageField, seoField } from "./fields";

export const aboutPageType = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  groups: contentGroups,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "missionHeading",
      title: "Mission Heading",
      type: "string",
      group: "content",
      placeholder: "Our Mission",
      description: 'Heading shown above the mission statement. Defaults to "Our Mission".',
    }),
    defineField({
      name: "mission",
      title: "Mission Statement",
      type: "text",
      rows: 3,
      group: "content",
      description: "Brief mission statement for the club",
    }),
    defineImageField({ name: "image", title: "Image", group: "content" }),
    defineField({
      name: "body",
      title: "About Content",
      type: "blockContent",
      group: "content",
      description: "Main content about the wrestling club",
    }),
    defineField({
      name: "historyHeading",
      title: "History Heading",
      type: "string",
      group: "content",
      placeholder: "Our History",
      description: 'Heading shown above the club history. Defaults to "Our History".',
    }),
    defineField({
      name: "history",
      title: "Club History",
      type: "blockContent",
      group: "content",
      description: "History of the wrestling club",
    }),
    seoField,
  ],
  preview: {
    prepare() {
      return {
        title: "About Page",
      };
    },
  },
});
