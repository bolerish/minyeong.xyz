import { getPostDescription, getPosts } from "~/content/lib/posts";
import { SITE_DESCRIPTION, SITE_TITLE } from "~/shared/constants/meta";

export const dynamic = "force-static";

export async function GET() {
  const posts = await getPosts();
  const items = posts
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    .map(
      (post) => `
        <item>
          <title>${escapeXml(post.data.title)}</title>
          <link>https://minyeong.xyz/${encodeURIComponent(post.data.slug)}</link>
          <guid>https://minyeong.xyz/${encodeURIComponent(post.data.slug)}</guid>
          <description>${escapeXml(getPostDescription(post))}</description>
          <pubDate>${post.data.pubDate.toUTCString()}</pubDate>
        </item>`,
    )
    .join("");

  const feed = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>${escapeXml(SITE_TITLE)}</title>
        <link>https://minyeong.xyz</link>
        <description>${escapeXml(SITE_DESCRIPTION)}</description>
        <language>ko</language>
        ${items}
      </channel>
    </rss>`;

  return new Response(feed, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}

function escapeXml(value: string): string {
  return value.replace(
    /[<>&'"]/g,
    (character) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        "'": "&apos;",
        '"': "&quot;",
      })[character] ?? character,
  );
}
