import { defineField, defineType } from "sanity";

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
          { title: "Practice", value: "practice" },
          { title: "Match", value: "match" },
          { title: "Tournament", value: "tournament" },
          { title: "Other", value: "other" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "startTime",
      title: "Start Time",
      type: "string",
      description: "e.g., 6:00 PM",
    }),
    defineField({
      name: "endTime",
      title: "End Time",
      type: "string",
      description: "e.g., 8:00 PM",
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
    // Practice-specific fields
    defineField({
      name: "ageGroup",
      title: "Age Group",
      type: "string",
      description: "e.g., K-2, 3-5, 6-8, High School",
      hidden: ({ parent }) => parent?.eventType !== "practice",
    }),
    defineField({
      name: "isRecurring",
      title: "Recurring Event",
      type: "boolean",
      description: "Is this a recurring practice?",
      initialValue: false,
      hidden: ({ parent }) => parent?.eventType !== "practice",
    }),
    defineField({
      name: "recurringPattern",
      title: "Recurring Pattern",
      type: "string",
      description: "e.g., Every Monday and Wednesday",
      hidden: ({ parent }) => parent?.eventType !== "practice" || !parent?.isRecurring,
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
      description: "Is this a home match?",
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
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
    {
      title: "Date, Oldest",
      name: "dateAsc",
      by: [{ field: "date", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      eventType: "eventType",
      date: "date",
      opponent: "opponent",
    },
    prepare({ title, eventType, date, opponent }) {
      const typeLabel = eventType
        ? eventType.charAt(0).toUpperCase() + eventType.slice(1)
        : "Event";
      // Append T00:00:00 to treat the date as local time, not UTC
      const dateStr = date
        ? new Date(date + "T00:00:00").toLocaleDateString()
        : "No date";
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
