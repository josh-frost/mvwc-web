import { type SchemaTypeDefinition } from "sanity";
import { blockContentType } from "./blockContentType";
import { seoType } from "./seoType";
import { contentType } from "./contentType";
import { homePageType } from "./homePageType";
import { aboutPageType } from "./aboutPageType";
import { schedulePageType } from "./schedulePageType";
import { contactInfoType } from "./contactInfoType";
import { postType } from "./postType";
import { eventType } from "./eventType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Shared types
    blockContentType,
    seoType,
    // Singletons
    homePageType,
    aboutPageType,
    schedulePageType,
    contactInfoType,
    // Collections
    contentType,
    postType,
    eventType,
  ],
};
