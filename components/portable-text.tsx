import Link from "next/link";
import {
  PortableText as BasePortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from "next-sanity";
import { SanityImage, type SanityImageValue } from "@/components/sanity-image";
import { cn } from "@/lib/utils";

const components: PortableTextComponents = {
  types: {
    image: ({ value }: { value: SanityImageValue }) => (
      <figure>
        <SanityImage
          image={value}
          width={1200}
          sizes="(min-width: 768px) 768px, 100vw"
          className="rounded-lg"
        />
      </figure>
    ),
  },
  marks: {
    link: ({ value, children }) => {
      const href: string = value?.href ?? "";
      // Internal paths use client-side navigation; mailto/tel stay in the tab;
      // other external links open in a new tab.
      if (href.startsWith("/")) return <Link href={href}>{children}</Link>;
      if (/^(mailto|tel):/.test(href)) return <a href={href}>{children}</a>;
      return (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    },
  },
};

/** Sanity rich text, styled with the typography plugin in the site's theme colors. */
export function PortableText({
  value,
  className,
}: {
  value?: PortableTextBlock[] | null;
  className?: string;
}) {
  if (!value?.length) return null;
  return (
    <div className={cn("prose prose-lg max-w-none", className)}>
      <BasePortableText value={value} components={components} />
    </div>
  );
}
