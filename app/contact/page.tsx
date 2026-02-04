import { sanityFetch } from "@/sanity/lib/live";

const CONTACT_QUERY = `*[_type == "contactInfo" && _id == "contactInfo"][0]{
  email,
  phone,
  address,
  city,
  state,
  hours,
  socialLinks
}`;

export default async function ContactPage() {
  const { data: contactInfo } = await sanityFetch({ query: CONTACT_QUERY });

  const location = [contactInfo?.city, contactInfo?.state].filter(Boolean).join(", ");

  return (
    <div className="container py-12 md:py-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
        <div className="space-y-6">
          <p className="text-muted-foreground">
            Get in touch with Mount Vernon Wrestling Club.
          </p>
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Email</h2>
              <p className="text-muted-foreground">
                {contactInfo?.email || "info@mvwc.com"}
              </p>
            </div>
            {contactInfo?.phone && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Phone</h2>
                <p className="text-muted-foreground">{contactInfo.phone}</p>
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold mb-2">Location</h2>
              <p className="text-muted-foreground">
                {contactInfo?.address && (
                  <>
                    {contactInfo.address}
                    <br />
                  </>
                )}
                {location || "Mount Vernon, IA"}
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Hours</h2>
              <p className="text-muted-foreground">
                {contactInfo?.hours ||
                  "Practice schedules available on the Schedule page."}
              </p>
            </div>
            {contactInfo?.socialLinks && contactInfo.socialLinks.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Follow Us</h2>
                <div className="flex gap-4">
                  {contactInfo.socialLinks.map(
                    (link: { platform: string; url: string }, index: number) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline capitalize"
                      >
                        {link.platform}
                      </a>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
