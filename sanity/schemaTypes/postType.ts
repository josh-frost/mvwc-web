import { defineField, defineType } from "sanity";
import { contentGroups, defineImageField, seoField } from "./fields";

export const postType = defineType({
  name: "post",
  title: "Post",
  type: "document",
  groups: [...contentGroups, { name: "newsletter", title: "Newsletter" }],
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
    // Read by the Sanity webhook that calls app/api/newsletter/post-published/route.ts.
    defineField({
      name: "emailSubscribers",
      title: "Email this post to subscribers",
      type: "boolean",
      group: "newsletter",
      initialValue: false,
      description:
        "When the post is published, email its title, cover image and summary to everyone on the newsletter list. The email is scheduled 10 minutes after publishing; to stop it, cancel it under Broadcasts in Resend within that time. Each post is only emailed once.",
      readOnly: ({ document }) => Boolean(document?.newsletterEmailedAt),
    }),
    defineField({
      name: "newsletterEmailedAt",
      title: "Emailed to subscribers",
      type: "datetime",
      group: "newsletter",
      readOnly: true,
      hidden: ({ document }) => !document?.newsletterEmailedAt,
      description: "Set automatically when the email is scheduled (it goes out 10 minutes later).",
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
