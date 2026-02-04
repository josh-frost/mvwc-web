import type { StructureResolver } from "sanity/structure";

// Singleton document types - only one instance allowed
const singletonTypes = new Set(["homePage", "aboutPage", "contactInfo"]);

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      // Singleton items - show as direct edit links
      S.listItem()
        .title("Home Page")
        .id("homePage")
        .child(S.document().schemaType("homePage").documentId("homePage")),
      S.listItem()
        .title("About Page")
        .id("aboutPage")
        .child(S.document().schemaType("aboutPage").documentId("aboutPage")),
      S.listItem()
        .title("Contact Information")
        .id("contactInfo")
        .child(S.document().schemaType("contactInfo").documentId("contactInfo")),
      S.divider(),
      // Regular document lists (excluding singletons)
      ...S.documentTypeListItems().filter(
        (listItem) => !singletonTypes.has(listItem.getId() as string),
      ),
    ]);
