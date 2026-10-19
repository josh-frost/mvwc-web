import { defineArrayMember, defineField, defineType } from "sanity";
import { contentGroups, seoField } from "./fields";

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const schedulePageType = defineType({
  name: "schedulePage",
  title: "Schedule Page",
  type: "document",
  groups: contentGroups,
  fields: [
    defineField({
      name: "intro",
      title: "Intro",
      type: "text",
      rows: 3,
      group: "content",
      description: "Optional text shown at the top of the Schedule page",
    }),
    defineField({
      name: "practices",
      title: "Practice Schedule",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          name: "practice",
          type: "object",
          fields: [
            defineField({
              name: "group",
              title: "Group",
              type: "string",
              description: "e.g. K-2, 3-5, Middle School",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "days",
              title: "Days",
              type: "array",
              of: [{ type: "string" }],
              options: {
                list: weekdays.map((day) => ({ title: day, value: day })),
                layout: "grid",
              },
              validation: (Rule) => Rule.required().min(1),
            }),
            defineField({
              name: "time",
              title: "Time",
              type: "string",
              description: "e.g. 6:00 – 7:30 PM",
            }),
            defineField({
              name: "location",
              title: "Location",
              type: "string",
            }),
            defineField({
              name: "notes",
              title: "Notes",
              type: "string",
            }),
          ],
          preview: {
            select: { title: "group", days: "days", time: "time" },
            prepare({ title, days, time }) {
              const dayList = Array.isArray(days)
                ? days.map((d: string) => d.slice(0, 3)).join(", ")
                : "";
              return { title, subtitle: [dayList, time].filter(Boolean).join(" · ") };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "seasonNote",
      title: "Season Note",
      type: "string",
      group: "content",
      description: "e.g. Practices run November through February",
    }),
    seoField,
  ],
  preview: {
    prepare() {
      return { title: "Schedule Page" };
    },
  },
});
