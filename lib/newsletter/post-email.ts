import "server-only";
import { defineQuery } from "next-sanity";
import { newsletterBaseUrl } from "@/lib/newsletter/config";
import { escapeHtml } from "@/lib/newsletter/html";
import { SITE_NAME } from "@/lib/site";
import { truncateText } from "@/lib/text";
import { urlFor } from "@/sanity/lib/image";
import type { NEWSLETTER_POST_QUERY_RESULT } from "@/sanity.types";

export const NEWSLETTER_POST_QUERY = defineQuery(`*[_type == "post" && _id == $id][0]{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  "bodyText": pt::text(body),
  coverImage,
  emailSubscribers,
  newsletterEmailedAt
}`);

type Post = NonNullable<NEWSLETTER_POST_QUERY_RESULT>;

// Resend replaces this with each recipient's unsubscribe link. Broadcasts must include it.
const UNSUBSCRIBE_URL = "{{{RESEND_UNSUBSCRIBE_URL}}}";

/** Builds the newsletter email announcing a post: cover image, title, summary and a link to the post. */
export function postEmail(post: Post) {
  const postUrl = `${newsletterBaseUrl()}/news/${encodeURIComponent(post.slug)}`;
  const summary = post.excerpt || truncateText(post.bodyText ?? "", 300);
  const image = post.coverImage?.asset
    ? urlFor(post.coverImage).width(1200).fit("max").format("jpg").quality(85).url()
    : null;

  const text = [
    post.title,
    "",
    summary,
    "",
    `Read the full post: ${postUrl}`,
    "",
    "--",
    `You're receiving this because you signed up for email updates from ${SITE_NAME}.`,
    `Unsubscribe: ${UNSUBSCRIBE_URL}`,
  ].join("\n");

  const html = `<!doctype html>
<html><body style="font-family:Arial,sans-serif;color:#222;line-height:1.5;max-width:560px;margin:0 auto;padding:24px">
  ${image ? `<p><a href="${escapeHtml(postUrl)}"><img src="${escapeHtml(image)}" alt="${escapeHtml(post.coverImage?.alt ?? "")}" width="560" style="display:block;width:100%;max-width:560px;height:auto;border-radius:8px;border:0"></a></p>` : ""}
  <h1 style="font-size:24px;line-height:1.3;margin:16px 0 8px">${escapeHtml(post.title)}</h1>
  ${summary ? `<p>${escapeHtml(summary)}</p>` : ""}
  <p><a href="${escapeHtml(postUrl)}" style="display:inline-block;background:#702E3E;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none">Read the full post</a></p>
  <hr style="border:0;border-top:1px solid #ddd;margin:32px 0 16px">
  <p style="font-size:13px;color:#555">You're receiving this because you signed up for email updates from ${escapeHtml(SITE_NAME)}. <a href="${UNSUBSCRIBE_URL}" style="color:#555">Unsubscribe</a></p>
</body></html>`;

  return { subject: post.title, previewText: summary, html, text };
}
