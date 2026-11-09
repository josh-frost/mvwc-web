import { defineField, defineType } from "sanity";

// Site-wide banner shown above the navigation on every page (components/announcement-banner.tsx).
export const announcementType = defineType({
  name: "announcement",
  title: "Announcement",
  type: "document",
  fields: [
    defineField({
      name: "enabled",
      title: "Show announcement",
      type: "boolean",
      initialValue: false,
      description: "Turn off to hide the banner without deleting the message",
    }),
    defineField({
      name: "message",
      title: "Message",
      type: "text",
      rows: 2,
      description: "One or two short sentences, e.g. \"Practice is cancelled tonight due to weather.\"",
      validation: (Rule) =>
        Rule.max(200).custom((message, context) => {
          const enabled = (context.document as { enabled?: boolean } | undefined)?.enabled;
          return enabled && !message?.trim() ? "A message is required while the announcement is shown" : true;
        }),
    }),
    defineField({
      name: "style",
      title: "Style",
      type: "string",
      initialValue: "info",
      options: {
        list: [
          { title: "Info (club colors)", value: "info" },
          { title: "Urgent (yellow, for cancellations and changes)", value: "urgent" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "linkUrl",
      title: "Link (optional)",
      type: "url",
      description: "A full URL, or a page on this site such as /schedule or /news/my-post",
      validation: (Rule) =>
        Rule.uri({ allowRelative: true, scheme: ["http", "https", "mailto", "tel"] }),
    }),
    defineField({
      name: "linkText",
      title: "Link text",
      type: "string",
      placeholder: "Details",
      hidden: ({ document }) => !document?.linkUrl,
    }),
    defineField({
      name: "expiresAt",
      title: "Hide after (optional)",
      type: "datetime",
      description: "The banner disappears on its own at this time. Leave empty to show it until turned off.",
      validation: (Rule) =>
        Rule.custom((expiresAt) =>
          expiresAt && Date.parse(expiresAt) <= Date.now()
            ? { message: "This time has passed, so the banner won't show", level: "warning" }
            : true,
        ),
    }),
  ],
  preview: {
    select: { message: "message", enabled: "enabled" },
    prepare({ message, enabled }) {
      return {
        title: "Announcement",
        subtitle: enabled ? message || "(no message)" : "Hidden",
      };
    },
  },
});
