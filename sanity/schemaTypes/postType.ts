import { defineField, defineType } from "sanity";
import { contentGroups, defineImageField, seoField } from "./fields";

export const postType = defineType({
  name: "post",
  title: "Post",
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
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      group: "content",
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
    defineImageField({ name: "coverImage", title: "Cover Image", group: "content" }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      group: "content",
      description: "Brief summary of the post for list views",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    seoField,
  ],
  orderings: [
    {
      title: "Published Date, Newest",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
    {
      title: "Published Date, Oldest",
      name: "publishedAtAsc",
      by: [{ field: "publishedAt", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      publishedAt: "publishedAt",
      media: "coverImage",
    },
    prepare({ title, publishedAt, media }) {
      return {
        title,
        subtitle: publishedAt ? new Date(publishedAt).toLocaleDateString() : "No date",
        media,
      };
    },
  },
});
