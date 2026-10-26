import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

// Home theme: --background 345 42% 31% (#702E3E), --primary 210 9% 83%
const BACKGROUND = "#702E3E";
const LOGO_COLOR = "hsl(210, 9%, 83%)";
const LOGO_ASPECT = 782.9 / 545; // public/main-logo.svg viewBox

/**
 * Renders the MVWC logo centered on the Home theme background as a PNG.
 * Used for the default share image (/og-image.png) and the structured-data logo (/logo.png).
 */
export async function brandImage({
  width,
  height,
  logoWidth,
}: {
  width: number;
  height: number;
  logoWidth: number;
}) {
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
        <img src={logo} width={logoWidth} height={Math.round(logoWidth / LOGO_ASPECT)} alt="" />
      </div>
    ),
    { width, height },
  );
}
