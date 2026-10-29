import type { MetadataRoute } from "next";
import { getPosts } from "~/content/lib/posts";
import { getProductSlugs } from "~/content/lib/products";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, productSlugs] = await Promise.all([
    getPosts(),
    getProductSlugs(),
  ]);

  return [
    { url: "https://minyeong.xyz" },
    { url: "https://minyeong.xyz/projects" },
    { url: "https://minyeong.xyz/career/resume" },
    ...productSlugs.map((slug) => ({
      url: `https://minyeong.xyz/products/${slug}/privacy`,
    })),
    ...posts.map((post) => ({
      url: `https://minyeong.xyz/${post.data.slug}`,
      lastModified: post.data.updatedDate ?? post.data.pubDate,
    })),
  ];
}
