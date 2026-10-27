import { defineQuery } from "next-sanity";
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import type { ORGANIZATION_CONTACT_QUERY_RESULT } from "@/sanity.types";

// schema.org structured data for the home page: the website and the club as a
// sports organization. Helps search engines connect the site, logo, location, and
// social profiles to "Mount Vernon Wrestling Club" (a common name across states).


// GROQ for the Contact Information fields the structured data uses.
export const ORGANIZATION_CONTACT_QUERY = defineQuery(`*[_type == "contactInfo" && _id == "contactInfo"][0]{
  email, phone, city, state, socialLinks[defined(url)]{ url }
}`);

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

export function homeStructuredData(contact: ORGANIZATION_CONTACT_QUERY_RESULT) {
  const sameAs = (contact?.socialLinks ?? []).map((link) => link.url).filter((url): url is string => Boolean(url));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: SITE_NAME,
        alternateName: "MVWC",
        publisher: { "@id": ORGANIZATION_ID },
      },
      {
        "@type": "SportsOrganization",
        "@id": ORGANIZATION_ID,
        name: SITE_NAME,
        alternateName: "MVWC",
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
        description: DEFAULT_DESCRIPTION,
        sport: "Wrestling",
        address: {
          "@type": "PostalAddress",
          // The club is in Mount Vernon, Iowa; Contact Information overrides when set.
          addressLocality: contact?.city || "Mount Vernon",
          addressRegion: contact?.state || "IA",
          addressCountry: "US",
        },
        ...(contact?.email && { email: contact.email }),
        ...(contact?.phone && { telephone: contact.phone }),
        ...(sameAs.length > 0 && { sameAs }),
      },
    ],
  };
}
