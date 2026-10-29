import type { NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { NEWSLETTER_POST_QUERY, postEmail } from "@/lib/newsletter/post-email";
import { scheduleBroadcast } from "@/lib/newsletter/resend";
import { sanityWriteClient } from "@/sanity/lib/write-client";

// Called by a Sanity webhook when a post with "Email this post to subscribers" is
// published (setup in README). Schedules a Resend broadcast for SEND_DELAY_MS later,
// so a mistake can still be cancelled in Resend.
//
// Each post is emailed at most once. The guard is a separate send record document,
// created before anything is sent: creating a document with an existing ID fails, so
// webhook retries and overlapping deliveries can't send twice, and editing or
// republishing the post can't undo it. The post's `newsletterEmailedAt` is only for
// display in the Studio.

const SEND_DELAY_MS = 10 * 60 * 1000;

// Dotted IDs (like drafts.*) aren't readable through the public API.
const sendRecordId = (postId: string) => `newsletter-send.${postId}`;

const respond = (status: number, outcome: string) => Response.json({ outcome }, { status });

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[newsletter] SANITY_WEBHOOK_SECRET is not set");
    return respond(500, "not configured");
  }

  let body: { _id?: unknown } | null;
  try {
    // Also waits briefly so the fetch below sees the just-published content.
    const parsed = await parseBody<{ _id?: unknown }>(request, secret, true);
    if (!parsed.isValidSignature) return respond(401, "invalid signature");
    body = parsed.body;
  } catch {
    return respond(400, "invalid body");
  }

  const postId = body?._id;
  if (typeof postId !== "string" || !postId) return respond(400, "missing _id");
  // Only published documents send (drafts and release versions have dotted IDs).
  if (postId.includes(".")) return respond(200, "skipped: not published");

  const client = sanityWriteClient();
  // Read the post ourselves rather than trusting the webhook payload's content.
  const post = await client.fetch(NEWSLETTER_POST_QUERY, { id: postId });
  if (!post) return respond(200, "skipped: post not found");
  if (post.emailSubscribers !== true) return respond(200, "skipped: not requested");
  if (post.newsletterEmailedAt) return respond(200, "skipped: already emailed");

  // Claim the send. Fails with 409 if this post was already claimed.
  const recordId = sendRecordId(postId);
  try {
    await client.create({
      _id: recordId,
      _type: "newsletterSend",
      post: postId,
      status: "sending",
      claimedAt: new Date().toISOString(),
    });
  } catch (error) {
    if ((error as { statusCode?: number }).statusCode === 409) {
      return respond(200, "skipped: already emailed");
    }
    throw error;
  }

  const scheduledAt = new Date(Date.now() + SEND_DELAY_MS).toISOString();
  let broadcastId: string;
  try {
    broadcastId = await scheduleBroadcast({
      name: `News: ${post.title}`,
      scheduledAt,
      ...postEmail(post),
    });
  } catch (error) {
    console.error(`[newsletter] Scheduling the email for post ${postId} failed`, error);
    // Release the claim so Sanity's webhook retry (or republishing) can try again.
    await client.delete(recordId).catch((deleteError) => {
      console.error(
        `[newsletter] Could not release send record ${recordId}; delete it to allow a retry`,
        deleteError,
      );
    });
    return respond(500, "send failed");
  }

  console.info(`[newsletter] Scheduled broadcast ${broadcastId} for post ${postId} at ${scheduledAt}`);

  // The email is scheduled; failures from here on are logged but don't fail the request,
  // so Sanity doesn't retry (the send record would block a resend anyway).
  try {
    const emailedAt = new Date().toISOString();
    const transaction = client
      .transaction()
      .patch(recordId, (patch) => patch.set({ status: "scheduled", broadcastId, scheduledAt }))
      .patch(postId, (patch) => patch.set({ newsletterEmailedAt: emailedAt }));
    // Mark an open draft too, so publishing it doesn't drop the marker from the post.
    const draftId = `drafts.${postId}`;
    if (await client.getDocument(draftId)) {
      transaction.patch(draftId, (patch) => patch.set({ newsletterEmailedAt: emailedAt }));
    }
    await transaction.commit();
  } catch (error) {
    console.error(`[newsletter] Scheduled ${broadcastId} but could not record it on post ${postId}`, error);
  }

  return respond(200, "scheduled");
}
