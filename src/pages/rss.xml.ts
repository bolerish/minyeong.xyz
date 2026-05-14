import rss from "@astrojs/rss";
import { SITE_DESCRIPTION, SITE_TITLE } from "~/consts";
import { getPostDescription, getPosts } from "~/content/lib/posts";
import type { APIRoute } from "astro";

export const GET: APIRoute = async (context) => {
  const posts = await getPosts();
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site!,
    items: posts.map((post) => ({
      ...post.data,
      description: getPostDescription(post),
      link: `/${post.data.slug}`,
    })),
  });
};
