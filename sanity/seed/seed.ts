/**
 * Seeds a non-production dataset with sample content for local development.
 *
 *   npm run seed                          # seeds the "development" dataset
 *   SEED_DATASET=my-dataset npm run seed  # seeds another dataset
 *
 * Runs via `sanity exec --with-user-token`, so it uses your `sanity login` session.
 * Documents use fixed IDs, so re-running replaces them instead of duplicating.
 * Placeholder images in ./images are uploaded once; Sanity dedupes identical uploads.
 */
import { createReadStream } from "node:fs";
import path from "node:path";
import { getCliClient } from "sanity/cli";

const dataset = process.env.SEED_DATASET || "development";
if (dataset === "production") {
  throw new Error('Refusing to seed the "production" dataset.');
}

const client = getCliClient({ apiVersion: "2025-11-08" }).withConfig({ dataset });

let keyCounter = 0;
const key = () => `seed${(keyCounter++).toString(36)}`;

type Style = "normal" | "h2" | "h3" | "blockquote";

function block(text: string, style: Style = "normal") {
  return {
    _type: "block",
    _key: key(),
    style,
    markDefs: [],
    children: [{ _type: "span", _key: key(), text, marks: [] }],
  };
}

function bullet(text: string) {
  return { ...block(text), listItem: "bullet", level: 1 };
}

function linkBlock(before: string, linkText: string, href: string, after = "") {
  const linkKey = key();
  return {
    _type: "block",
    _key: key(),
    style: "normal",
    markDefs: [{ _type: "link", _key: linkKey, href }],
    children: [
      { _type: "span", _key: key(), text: before, marks: [] },
      { _type: "span", _key: key(), text: linkText, marks: [linkKey] },
      { _type: "span", _key: key(), text: after, marks: [] },
    ],
  };
}

// Dates relative to today so "upcoming" and "past" stay meaningful.
// 23:00 UTC is 6 PM CDT / 5 PM CST.
function daysFromNow(days: number, utcHour = 23, minutes = 0) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + days);
  d.setUTCHours(utcHour, minutes, 0, 0);
  return d.toISOString();
}

const documents: Array<{ _id: string; _type: string; [field: string]: unknown }> = [
  // Singletons
  {
    _id: "homePage",
    _type: "homePage",
    title: "Mount Vernon Wrestling Club",
    subtitle: "Youth wrestling in Mount Vernon, Iowa",
    showComingSoon: false,
    body: [
      block(
        "Sample content: MVWC is a youth wrestling club for athletes of all experience levels. " +
          "We focus on fundamentals, hard work, and having fun on the mat.",
      ),
    ],
  },
  {
    _id: "aboutPage",
    _type: "aboutPage",
    title: "About MVWC",
    mission: "Sample mission: building confident, disciplined athletes through the sport of wrestling.",
    body: [
      block("Who we are", "h2"),
      block(
        "Sample content: we're a volunteer-run club of parents and coaches. " +
          "Wrestlers from kindergarten through middle school are welcome.",
      ),
      block("What we offer", "h2"),
      bullet("Technique-focused practices for every age group"),
      bullet("Local and regional tournament opportunities"),
      bullet("A supportive team environment"),
    ],
    history: [
      block(
        "Sample content: the club started as a handful of families in a borrowed gym " +
          "and has grown every season since.",
      ),
    ],
  },
  {
    _id: "schedulePage",
    _type: "schedulePage",
    intro: "Sample content: practice times for the current season. Events are listed below.",
    seasonNote: "Practices run November through February.",
    practices: [
      {
        _type: "practice",
        _key: key(),
        group: "K-2",
        days: ["Monday", "Wednesday"],
        time: "5:30 – 6:30 PM",
        location: "Main gym",
      },
      {
        _type: "practice",
        _key: key(),
        group: "3-5",
        days: ["Monday", "Wednesday"],
        time: "6:30 – 7:45 PM",
        location: "Main gym",
      },
      {
        _type: "practice",
        _key: key(),
        group: "Middle School",
        days: ["Tuesday", "Thursday"],
        time: "6:00 – 7:30 PM",
        location: "Main gym",
        notes: "Bring a water bottle and wrestling shoes",
      },
    ],
  },
  {
    _id: "contactInfo",
    _type: "contactInfo",
    email: "info@example.com",
    phone: "(555) 555-0100",
    city: "Mount Vernon",
    state: "IA",
    hours: "Questions? Email us any time, or catch a coach after practice.",
    socialLinks: [
      { _type: "object", _key: key(), platform: "facebook", url: "https://facebook.com/example" },
      { _type: "object", _key: key(), platform: "instagram", url: "https://instagram.com/example" },
    ],
  },

  // Content sections
  {
    _id: "seed-content-mission",
    _type: "content",
    page: "about",
    title: "Club Mission (sample)",
    slug: { _type: "slug", current: "mission" },
    order: 10,
    body: [
      block("Sample content: every wrestler leaves practice a little better than they arrived."),
    ],
  },
  {
    _id: "seed-content-join",
    _type: "content",
    page: "home",
    title: "Join the Club",
    slug: { _type: "slug", current: "join" },
    order: 10,
    body: [
      block("Sample content: new wrestlers are welcome all season. No experience needed."),
      linkBlock("Questions? ", "Contact us", "mailto:info@example.com", " and we'll get you started."),
    ],
  },
  {
    _id: "seed-content-what-to-bring",
    _type: "content",
    page: "schedule",
    title: "What to Bring",
    order: 10,
    body: [
      bullet("Athletic shorts and a t-shirt"),
      bullet("Wrestling shoes (or clean gym shoes to start)"),
      bullet("A water bottle"),
    ],
  },

  // Events: two past with results, three upcoming
  {
    _id: "seed-event-past-tournament",
    _type: "event",
    title: "Season Opener Tournament",
    eventType: "tournament",
    start: daysFromNow(-21, 14),
    end: daysFromNow(-21, 21),
    location: "Sample High School",
    isHomeEvent: false,
    result: "3 champions, 5 place-winners",
  },
  {
    _id: "seed-event-past-match",
    _type: "event",
    title: "Dual Meet",
    eventType: "match",
    start: daysFromNow(-7),
    location: "Main gym",
    opponent: "Sample Valley WC",
    isHomeEvent: true,
    result: "W 42-30",
  },
  {
    _id: "seed-event-parent-meeting",
    _type: "event",
    title: "Parent Meeting",
    eventType: "other",
    start: daysFromNow(3, 0, 30),
    end: daysFromNow(3, 1, 30),
    location: "Library meeting room",
    description: "Season overview, volunteer sign-ups, and Q&A.",
  },
  {
    _id: "seed-event-upcoming-match",
    _type: "event",
    title: "Dual Meet",
    eventType: "match",
    start: daysFromNow(10),
    location: "Sample Middle School",
    opponent: "Sample City WC",
    isHomeEvent: false,
  },
  {
    _id: "seed-event-upcoming-tournament",
    _type: "event",
    title: "MVWC Invitational",
    eventType: "tournament",
    start: daysFromNow(24, 14),
    end: daysFromNow(24, 22),
    location: "Main gym",
    isHomeEvent: true,
    description: "Our home tournament. Volunteers needed for tables and concessions.",
  },

  // Posts
  {
    _id: "seed-post-welcome",
    _type: "post",
    title: "Welcome to the New Season",
    slug: { _type: "slug", current: "welcome-to-the-new-season" },
    publishedAt: daysFromNow(-30, 15),
    excerpt: "Registration is open and practices start soon. Here's what you need to know.",
    body: [
      block("Sample content: we're excited to kick off another season of MVWC wrestling."),
      block("Getting started", "h2"),
      bullet("Register online before the first practice"),
      bullet("Check the schedule page for your group's practice times"),
      bullet("Join our parent group for updates"),
      linkBlock("See the ", "schedule", "/schedule", " for practice times."),
    ],
  },
  {
    _id: "seed-post-opener-recap",
    _type: "post",
    title: "Season Opener Recap",
    slug: { _type: "slug", current: "season-opener-recap" },
    publishedAt: daysFromNow(-20, 15),
    excerpt: "A strong start with three champions at the season opener.",
    body: [
      block("Sample content: great effort from every wrestler at the season opener."),
      block("Hard work shows up on the mat.", "blockquote"),
    ],
  },
  {
    _id: "seed-post-volunteers",
    _type: "post",
    title: "Volunteers Needed for the Invitational",
    slug: { _type: "slug", current: "volunteers-needed-for-the-invitational" },
    publishedAt: daysFromNow(-2, 15),
    body: [
      block(
        "Sample content: our home tournament is coming up and we need help running tables, " +
          "concessions, and setup. This post has no excerpt, so list views show the body instead.",
      ),
    ],
  },
];

// Placeholder images (sanity/seed/images) and where they go, by document _id
const images = {
  hero: { file: "hero.jpg", alt: "Sample hero image in club colors" },
  about: { file: "about.jpg", alt: "Sample About page image" },
  postWelcome: { file: "post-welcome.jpg", alt: "Sample cover image for the new season post" },
  postRecap: { file: "post-recap.jpg", alt: "Sample cover image for the season opener recap" },
};
type ImageName = keyof typeof images;

const imageFields: Record<string, Record<string, ImageName>> = {
  homePage: { heroImage: "hero" },
  aboutPage: { image: "about" },
  "seed-post-welcome": { coverImage: "postWelcome" },
  "seed-post-opener-recap": { coverImage: "postRecap" },
};

// Inline images appended to a document's body, to exercise rich-text image rendering
const bodyImages: Record<string, ImageName> = {
  "seed-post-opener-recap": "about",
};

type ImageValue = { _type: "image"; asset: { _type: "reference"; _ref: string }; alt: string };

async function uploadImages() {
  const uploaded = {} as Record<ImageName, ImageValue>;
  for (const name of Object.keys(images) as ImageName[]) {
    const { file, alt } = images[name];
    const asset = await client.assets.upload(
      "image",
      createReadStream(path.join(process.cwd(), "sanity/seed/images", file)),
      { filename: file },
    );
    uploaded[name] = { _type: "image", asset: { _type: "reference", _ref: asset._id }, alt };
  }
  return uploaded;
}

async function main() {
  const { projectId } = client.config();
  console.log(`Uploading ${Object.keys(images).length} images to ${projectId}/${dataset}…`);
  const uploaded = await uploadImages();

  for (const doc of documents) {
    for (const [field, name] of Object.entries(imageFields[doc._id] ?? {})) {
      doc[field] = uploaded[name];
    }
    const bodyImage = bodyImages[doc._id];
    if (bodyImage && Array.isArray(doc.body)) {
      doc.body = [...doc.body, { ...uploaded[bodyImage], _key: key() }];
    }
  }

  console.log(`Seeding ${documents.length} documents into ${projectId}/${dataset}…`);
  const tx = client.transaction();
  for (const doc of documents) tx.createOrReplace(doc);
  await tx.commit({ visibility: "async" });

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
