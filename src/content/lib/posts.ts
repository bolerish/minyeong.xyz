import { getCollection, type CollectionEntry } from "astro:content";

const POST_DESCRIPTION_MAX_LENGTH = 120;

type PostEntry = CollectionEntry<"posts">;

export async function getPosts(): Promise<CollectionEntry<"posts">[]> {
  const posts = await getCollection("posts");

  return posts;
}

export function getPostDescription(post: PostEntry): string {
  const description = post.data.description.trim();

  if (description.length > 0) {
    return description;
  }

  return (
    getMarkdownExcerpt(post.body ?? "", POST_DESCRIPTION_MAX_LENGTH) ||
    post.data.title
  );
}

function getMarkdownExcerpt(markdown: string, maxLength: number): string {
  const text = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/~~~[\s\S]*?~~~/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_`~|-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return truncateText(text, maxLength);
}

function truncateText(text: string, maxLength: number): string {
  const characters = Array.from(text);

  if (characters.length <= maxLength) {
    return text;
  }

  return `${characters.slice(0, maxLength).join("").trimEnd()}...`;
}
