import { defineField, defineType } from "sanity";
import { contentGroups, defineImageField, seoField } from "./fields";

export const homePageType = defineType({
  name: "homePage",
  title: "Home Page",
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
      name: "subtitle",
      title: "Subtitle",
      type: "string",
      group: "content",
      description: "Optional subtitle or tagline displayed below the title",
    }),
    defineField({
      name: "showComingSoon",
      title: "Show Coming Soon",
      type: "boolean",
      group: "content",
      description: "Toggle to show/hide the 'Coming Soon' message",
      initialValue: true,
    }),
    defineImageField({
      name: "heroImage",
      title: "Hero Image",
      description: "Large image at the top of the home page",
      group: "content",
    }),
    defineField({
      name: "body",
      title: "Body Content",
      type: "blockContent",
      group: "content",
      description: "Optional content to display on the home page",
    }),
    seoField,
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
