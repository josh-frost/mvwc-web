import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { telHref } from "@/lib/phone";
import { sanityFetch } from "@/sanity/lib/live";
import { ContentSections } from "@/components/content-sections";
import { isSocialPlatform, SocialIcon, socialPlatformLabels } from "@/components/social-icons";
import { pageMetadata } from "@/lib/metadata";

const CONTACT_QUERY = `*[_type == "contactInfo" && _id == "contactInfo"][0]{
  email,
  phone,
  address,
  city,
  state,
  hours,
  socialLinks[defined(url)]{ _key, platform, url }
}`;

type SocialLink = {
  _key: string;
  platform?: string;
  url: string;
};

type ContactInfo = {
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  hours?: string;
  socialLinks?: SocialLink[];
};

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: "Get in touch with Mount Vernon Wrestling Club.",
  path: "/contact",
});

export default async function ContactPage() {
  const { data } = await sanityFetch({ query: CONTACT_QUERY });
  const contactInfo = data as ContactInfo | null;

  const location = [contactInfo?.city, contactInfo?.state].filter(Boolean).join(", ");
  const socialLinks = contactInfo?.socialLinks ?? [];
  const hasDetails = Boolean(
    contactInfo?.email ||
      contactInfo?.phone ||
      contactInfo?.address ||
      location ||
      contactInfo?.hours ||
      socialLinks.length,
  );

  return (
    <div className="container px-4 sm:px-6 lg:px-8 py-12 md:py-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
        <div className="space-y-8">
          <p className="text-muted-foreground">
            Get in touch with Mount Vernon Wrestling Club.
          </p>

          {hasDetails ? (
            <div className="space-y-6">
              {contactInfo?.email && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Email</h2>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    {contactInfo.email}
                  </a>
                </div>
              )}
              {contactInfo?.phone && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Phone</h2>
                  <a
                    href={telHref(contactInfo.phone)}
                    className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    {contactInfo.phone}
                  </a>
                </div>
              )}
              {(contactInfo?.address || location) && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Location</h2>
                  <p className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className="whitespace-pre-line">
                      {[contactInfo?.address, location].filter(Boolean).join("\n")}
                    </span>
                  </p>
                </div>
              )}
              {contactInfo?.hours && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Hours</h2>
                  <p className="text-muted-foreground whitespace-pre-line">{contactInfo.hours}</p>
                </div>
              )}
              {socialLinks.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Follow Us</h2>
                  <ul className="flex flex-wrap gap-x-6 gap-y-2">
                    {socialLinks.map((link) => {
                      const platform = link.platform ?? "";
                      const label = socialPlatformLabels[platform] ?? "Social media";
                      return (
                        <li key={link._key}>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                          >
                            {isSocialPlatform(platform) && (
                              <SocialIcon platform={platform} className="h-4 w-4" />
                            )}
                            {label}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground">Contact details coming soon.</p>
          )}

          <ContentSections page="contact" />
        </div>
      </div>
    </div>
  );
}
