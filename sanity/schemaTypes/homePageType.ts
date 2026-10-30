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
    defineField({
      name: "newsletter",
      title: "Newsletter Signup",
      type: "object",
      group: "content",
      description: "Email signup section on the home page (also shown in Coming Soon mode)",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "enabled",
          title: "Show signup",
          type: "boolean",
          initialValue: true,
        }),
        defineField({
          name: "heading",
          title: "Heading",
          type: "string",
          placeholder: "Stay in the loop",
        }),
        defineField({
          name: "text",
          title: "Text",
          type: "text",
          rows: 2,
          placeholder: "Get club news, schedule updates, and announcements by email.",
        }),
        defineField({
          name: "successHeading",
          title: "After signing up: heading",
          type: "string",
          description: "Shown in place of the form after someone signs up",
          placeholder: "Check your inbox to confirm.",
        }),
        defineField({
          name: "successText",
          title: "After signing up: text",
          type: "text",
          rows: 2,
          placeholder:
            "We sent a confirmation link to your email. If you don't see it in a few minutes, check your spam folder.",
        }),
      ],
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
