"use client";

import Image, { type ImageLoader } from "next/image";
import type { SanityImageSource } from "@sanity/image-url";
import { urlFor } from "@/sanity/lib/image";
import { cn } from "@/lib/utils";

export type SanityImageValue = {
  asset?: { _ref?: string; _id?: string };
  alt?: string;
  hotspot?: unknown;
  crop?: unknown;
};

// Asset refs look like "image-<hash>-<width>x<height>-<ext>"
function dimensionsFromRef(ref: string) {
  const match = ref.match(/-(\d+)x(\d+)-[a-z0-9]+$/);
  return match ? { width: Number(match[1]), height: Number(match[2]) } : null;
}

/**
 * Renders a Sanity image. The Sanity CDN produces each responsive size
 * (via a custom loader), so Next's image optimizer isn't involved, and the
 * editor's hotspot/crop is respected. Pass `aspect` (width / height) to crop
 * to a fixed shape; otherwise the image keeps its natural proportions.
 */
export function SanityImage({
  image,
  width,
  aspect,
  sizes = "100vw",
  priority,
  className,
}: {
  image?: SanityImageValue | null;
  width: number;
  aspect?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const ref = image?.asset?._ref ?? image?.asset?._id;
  if (!image || !ref) return null;

  const natural = dimensionsFromRef(ref);
  const ratio = aspect ?? (natural ? natural.width / natural.height : 1);

  const loader: ImageLoader = ({ width: w, quality }) => {
    let builder = urlFor(image as SanityImageSource)
      .width(w)
      .auto("format")
      .quality(quality ?? 80);
    if (aspect) builder = builder.height(Math.round(w / aspect)).fit("crop");
    return builder.url();
  };

  return (
    <Image
      loader={loader}
      src={ref}
      alt={image.alt ?? ""}
      width={width}
      height={Math.round(width / ratio)}
      sizes={sizes}
      priority={priority}
      className={cn("h-auto w-full", className)}
    />
  );
}
