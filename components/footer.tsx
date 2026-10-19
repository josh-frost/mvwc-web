import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { sanityFetch } from "@/sanity/lib/live";
import { MVWCLogo } from "@/components/mvwc-logo";
import { navLinks } from "@/components/navigation/nav-links";
import { isSocialPlatform, SocialIcon } from "@/components/social-icons";

const FOOTER_QUERY = `*[_type == "contactInfo" && _id == "contactInfo"][0]{
  email,
  phone,
  city,
  state,
  socialLinks[defined(url)]{ _key, platform, url }
}`;

type FooterData = {
  email?: string;
  phone?: string;
  city?: string;
  state?: string;
  socialLinks?: { _key: string; platform?: string; url: string }[];
};

const platformLabels: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  twitter: "X (Twitter)",
  youtube: "YouTube",
};

export async function Footer() {
  const { data } = await sanityFetch({ query: FOOTER_QUERY });
  const contact = data as FooterData | null;

  const location = [contact?.city, contact?.state].filter(Boolean).join(", ");
  const socialLinks = contact?.socialLinks ?? [];

  return (
    <footer className="mt-auto border-t border-border/40 bg-background">
      {/* Full width with px-4 to line up with the navbar; flex so missing sections leave no gaps */}
      <div className="flex flex-col gap-8 px-4 py-10 md:flex-row md:justify-between">
        <div className="space-y-3">
          <Link href="/" className="inline-block text-primary transition-opacity hover:opacity-80">
            <MVWCLogo className="h-10 w-auto" />
          </Link>
          {socialLinks.length > 0 && (
            <ul className="flex gap-3">
              {socialLinks.map((link) => {
                const platform = link.platform ?? "";
                const label = platformLabels[platform] ?? "Social media";
                return (
                  <li key={link._key}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      title={label}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                    >
                      {isSocialPlatform(platform) ? (
                        <SocialIcon platform={platform} className="h-5 w-5" />
                      ) : (
                        <span className="text-sm font-semibold">{label.charAt(0)}</span>
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="flex flex-col gap-8 sm:flex-row sm:gap-16">
          <nav aria-label="Footer">
            <h2 className="mb-3 text-sm font-semibold text-foreground">Explore</h2>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {(contact?.email || contact?.phone || location) && (
            <div>
              <h2 className="mb-3 text-sm font-semibold text-foreground">Contact</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {contact?.email && (
                  <li>
                    <a
                      href={`mailto:${contact.email}`}
                      className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
                    >
                      <Mail className="h-4 w-4" aria-hidden="true" />
                      {contact.email}
                    </a>
                  </li>
                )}
                {contact?.phone && (
                  <li>
                    <a
                      href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}
                      className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
                    >
                      <Phone className="h-4 w-4" aria-hidden="true" />
                      {contact.phone}
                    </a>
                  </li>
                )}
                {location && (
                  <li className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                    {location}
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-border/40">
        <p className="px-4 py-4 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Mount Vernon Wrestling Club
        </p>
      </div>
    </footer>
  );
}
