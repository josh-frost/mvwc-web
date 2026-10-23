import type { NextConfig } from "next";
import { withBotId } from "botid/next/config";

const nextConfig: NextConfig = {
  /* config options here */
};

// withBotId proxies BotID's challenge script through this site. Vercel routes it
// automatically in deployments; the wrapper is what makes it work in `next dev`.
export default withBotId(nextConfig);
