import type { ImageMetadata } from "astro";

export interface SeoProps {
  title: string;
  description: string;
  contentType?: "website" | "article";
  image?: ImageMetadata;
  pubDate?: Date;
  updatedDate?: Date;
}
