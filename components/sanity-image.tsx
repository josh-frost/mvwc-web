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

type Crop = { top?: number; bottom?: number; left?: number; right?: number };

// Width / height of the image as delivered: the original proportions, narrowed by any
// crop the editor applied in the Studio (crop values are fractions of each side).
function naturalRatio(ref: string, crop: unknown) {
  const natural = dimensionsFromRef(ref);
  if (!natural) return 1;
  const { top = 0, bottom = 0, left = 0, right = 0 } = (crop ?? {}) as Crop;
  const width = natural.width * (1 - left - right);
  const height = natural.height * (1 - top - bottom);
  return width > 0 && height > 0 ? width / height : natural.width / natural.height;
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

  const ratio = aspect ?? naturalRatio(ref, image.crop);

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
