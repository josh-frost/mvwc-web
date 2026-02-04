import { type SchemaTypeDefinition } from "sanity";
import { contentType } from "./contentType";
import { homePageType } from "./homePageType";
import { aboutPageType } from "./aboutPageType";
import { contactInfoType } from "./contactInfoType";
import { postType } from "./postType";
import { eventType } from "./eventType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [contentType, homePageType, aboutPageType, contactInfoType, postType, eventType],
};
