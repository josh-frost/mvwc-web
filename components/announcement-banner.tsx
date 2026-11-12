import { defineQuery, stegaClean } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";
import { AnnouncementBar } from "@/components/announcement-bar";
import { ANNOUNCEMENT_DISMISSED_KEY, ANNOUNCEMENT_ELEMENT_ID } from "@/lib/announcement";

const ANNOUNCEMENT_QUERY = defineQuery(`*[_type == "announcement" && _id == "announcement" && enabled == true][0]{
  _rev,
  message,
  style,
  linkUrl,
  linkText,
  expiresAt
}`);

// Runs right after the banner's HTML, before first paint: hides it if it has expired
// (pages can be served from cache after the expiry time) or this visitor dismissed it.
const HIDE_SCRIPT = `(function(){try{var e=document.getElementById(${JSON.stringify(ANNOUNCEMENT_ELEMENT_ID)});if(!e)return;var x=e.getAttribute("data-expires");if((x&&Date.parse(x)<=Date.now())||localStorage.getItem(${JSON.stringify(ANNOUNCEMENT_DISMISSED_KEY)})===e.getAttribute("data-rev"))e.hidden=true}catch(_){}})()`;

/** Site-wide announcement from the Studio's "Announcement Banner", shown above the navigation. */
export async function AnnouncementBanner() {
  const { data } = await sanityFetch({ query: ANNOUNCEMENT_QUERY });
  const message = data?.message?.trim();
  if (!data || !message) return null;

  const expiresAt = data.expiresAt ? stegaClean(data.expiresAt) : null;
  // Skip rendering once expired; the script and AnnouncementBar cover cached pages.
  // eslint-disable-next-line react-hooks/purity -- reading the clock at render time is intended
  if (expiresAt && Date.parse(expiresAt) <= Date.now()) return null;

  const href = data.linkUrl ? stegaClean(data.linkUrl) : null;

  return (
    <>
      <AnnouncementBar
        key={data._rev}
        rev={data._rev}
        message={message}
        urgent={stegaClean(data.style) === "urgent"}
        href={href}
        linkText={data.linkText?.trim() || "Details"}
        expiresAt={expiresAt}
      />
      <script dangerouslySetInnerHTML={{ __html: HIDE_SCRIPT }} />
    </>
  );
}
