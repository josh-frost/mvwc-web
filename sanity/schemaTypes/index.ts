import { type SchemaTypeDefinition } from "sanity";
import { contentType } from "./contentType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [contentType],
};
