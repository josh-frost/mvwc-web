import "server-only";
import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

let client: ReturnType<typeof createClient> | undefined;

// Authenticated client for server-side writes (newsletter send records). Created
// lazily so builds don't need the token. SANITY_API_WRITE_TOKEN is an Editor token:
// never import this from client components.
export function sanityWriteClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token) throw new Error("SANITY_API_WRITE_TOKEN is not set");
  client ??= createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
    perspective: "published",
  });
  return client;
}
