import { defineField, defineType } from "sanity";
import { formatEventDate, SITE_TIME_ZONE } from "../../lib/datetime";

// One-off events: matches, tournaments, and other club events.
// Recurring practices live on the Schedule Page singleton instead.
export const eventType = defineType({
  name: "event",
  title: "Event",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "eventType",
      title: "Event Type",
      type: "string",
      options: {
        list: [
          { title: "Match", value: "match" },
          { title: "Tournament", value: "tournament" },
          { title: "Other", value: "other" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "start",
      title: "Start",
      type: "datetime",
      description: "Central Time",
      options: { timeStep: 15, displayTimeZone: SITE_TIME_ZONE, allowTimeZoneSwitch: false },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "end",
      title: "End",
      type: "datetime",
      options: { timeStep: 15, displayTimeZone: SITE_TIME_ZONE, allowTimeZoneSwitch: false },
      validation: (Rule) =>
        Rule.custom((end, context) => {
          const start = (context.parent as { start?: string } | undefined)?.start;
          return end && start && end <= start ? "End must be after start" : true;
        }),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    // Match/Tournament-specific fields
    defineField({
      name: "opponent",
      title: "Opponent",
      type: "string",
      hidden: ({ parent }) => parent?.eventType !== "match",
    }),
    defineField({
      name: "isHomeEvent",
      title: "Home Event",
      type: "boolean",
      description: "Is this hosted by MVWC?",
      hidden: ({ parent }) =>
        parent?.eventType !== "match" && parent?.eventType !== "tournament",
    }),
    defineField({
      name: "result",
      title: "Result",
      type: "string",
      description: "Score or result after the event (optional)",
      hidden: ({ parent }) =>
        parent?.eventType !== "match" && parent?.eventType !== "tournament",
    }),
  ],
  orderings: [
    {
      title: "Date, Newest",
      name: "startDesc",
      by: [{ field: "start", direction: "desc" }],
    },
    {
      title: "Date, Oldest",
      name: "startAsc",
      by: [{ field: "start", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      eventType: "eventType",
      start: "start",
      opponent: "opponent",
    },
    prepare({ title, eventType, start, opponent }) {
      const typeLabel = eventType
        ? eventType.charAt(0).toUpperCase() + eventType.slice(1)
        : "Event";
      const dateStr = start ? formatEventDate(start) : "No date";
      const subtitle = opponent
        ? `${typeLabel} vs ${opponent} - ${dateStr}`
        : `${typeLabel} - ${dateStr}`;
      return {
        title,
        subtitle,
      };
    },
  },
});
