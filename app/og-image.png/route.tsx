import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

// Default share image at a stable URL (/og-image.png): the MVWC logo in the Home
// theme colors. Used by lib/metadata.ts when a page has no SEO or page image.
// A plain route (not the opengraph-image file convention) because pages that set
// their own openGraph metadata replace the inherited file-based image entirely.
export const dynamic = "force-static";

const size = { width: 1200, height: 630 };

// Home theme: --background 345 42% 31% (#702E3E), --primary 210 9% 83%
const BACKGROUND = "#702E3E";
const LOGO_COLOR = "hsl(210, 9%, 83%)";

export async function GET() {
  // The logo SVG uses currentColor, which has no meaning inside an <img>; inline the color.
  const svg = (await readFile(path.join(process.cwd(), "public/main-logo.svg"), "utf8")).replaceAll(
    "currentColor",
    LOGO_COLOR,
  );
  const logo = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: BACKGROUND,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img> */}
        <img src={logo} width={640} height={446} alt="" />
      </div>
    ),
    size,
  );
}
