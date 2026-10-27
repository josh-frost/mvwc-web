import { defineQuery } from "next-sanity";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { telHref } from "@/lib/phone";
import { sanityFetch } from "@/sanity/lib/live";
import { MVWCLogo } from "@/components/mvwc-logo";
import { navLinks } from "@/components/navigation/nav-links";
import { isSocialPlatform, SocialIcon, socialPlatformLabels } from "@/components/social-icons";

const FOOTER_QUERY = defineQuery(`*[_type == "contactInfo" && _id == "contactInfo"][0]{
  email,
  phone,
  city,
  state,
  socialLinks[defined(url)]{ _key, platform, url }
}`);


const linkClass = "transition-colors hover:text-foreground";

export async function Footer() {
  const { data } = await sanityFetch({ query: FOOTER_QUERY });
  const contact = data;

  const location = [contact?.city, contact?.state].filter(Boolean).join(", ");
  const socialLinks = contact?.socialLinks ?? [];
  const hasContact = Boolean(contact?.email || contact?.phone || location);

  return (
    <footer className="mt-auto border-t border-border/40 bg-background">
      <div className="flex flex-col items-center gap-4 px-4 py-8 text-center text-sm text-muted-foreground">
        <Link href="/" className="text-primary transition-opacity hover:opacity-80">
          <MVWCLogo className="h-10 w-auto" />
        </Link>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {socialLinks.length > 0 && (
          <ul className="flex gap-2">
            {socialLinks.map((link) => {
              const platform = link.platform ?? "";
              const label = socialPlatformLabels[platform] ?? "Social media";
              return (
                <li key={link._key}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-primary/10 hover:text-primary"
                  >
                    {isSocialPlatform(platform) ? (
                      <SocialIcon platform={platform} className="h-5 w-5" />
                    ) : (
                      <span className="font-semibold">{label.charAt(0)}</span>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        )}

        {hasContact && (
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {contact?.email && (
              <li>
                <a href={`mailto:${contact.email}`} className={`inline-flex items-center gap-1.5 ${linkClass}`}>
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  {contact.email}
                </a>
              </li>
            )}
            {contact?.phone && (
              <li>
                <a
                  href={telHref(contact.phone)}
                  className={`inline-flex items-center gap-1.5 ${linkClass}`}
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {contact.phone}
                </a>
              </li>
            )}
            {location && (
              <li className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {location}
              </li>
            )}
          </ul>
        )}

        <p className="text-xs">© {new Date().getFullYear()} Mount Vernon Wrestling Club</p>
      </div>
    </footer>
  );
}
