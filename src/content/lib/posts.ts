import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import GithubSlugger from "github-slugger";
import matter from "gray-matter";
import { Marked, type Renderer, type Tokens } from "marked";
import markedFootnote from "marked-footnote";
import readingTime from "reading-time";
import { bundledLanguages, codeToHtml } from "shiki";
import { z } from "zod";
import { codeTheme, codeTransformers } from "./highlight-code";

const POST_DESCRIPTION_MAX_LENGTH = 120;
const EXCLUDED_POST_FILES = new Set(["render-1.mdx", "render-2.mdx"]);
const POSTS_DIRECTORY = path.join(process.cwd(), "src/content/posts");
const COMPACT_DATE_REGEX = /^(\d{4})(\d{2})(\d{2})$/;
const META_ATTRIBUTE_PATTERN = (name: string) =>
  new RegExp(`\\b${name}=(?:"([^"]+)"|'([^']+)'|(\\S+))`);

const postDateSchema = z.preprocess(normalizePostDate, z.coerce.date());
const postSchema = z.object({
  title: z.string(),
  description: z
    .string()
    .nullish()
    .transform((value) => value ?? ""),
  slug: z.string(),
  tag: z.array(z.string()).min(1),
  pubDate: postDateSchema,
  updatedDate: postDateSchema.optional(),
});

export type Post = {
  body: string;
  data: z.infer<typeof postSchema>;
  format: "md" | "mdx";
  headings: PostHeading[];
  html: string;
  id: string;
  readingMinutes: number;
};

export type PostHeading = {
  id: string;
  level: 2 | 3;
  text: string;
};

export async function getPosts(): Promise<Post[]> {
  const fileNames = (await readdir(POSTS_DIRECTORY)).filter(
    (fileName) =>
      (fileName.endsWith(".md") || fileName.endsWith(".mdx")) &&
      !EXCLUDED_POST_FILES.has(fileName),
  );

  const posts = await Promise.all(
    fileNames.map(async (fileName) => {
      const source = await readFile(
        path.join(POSTS_DIRECTORY, fileName),
        "utf8",
      );
      const { content, data } = matter(source);
      const format: Post["format"] = fileName.endsWith(".mdx") ? "mdx" : "md";
      const rendered = await renderMarkdownDocument(content, format === "md");

      return {
        body: content,
        data: postSchema.parse(data),
        format,
        headings: rendered.headings,
        html: rendered.html,
        id: fileName.replace(/\.mdx?$/, ""),
        readingMinutes: Math.max(1, Math.ceil(readingTime(content).minutes)),
      };
    }),
  );

  return posts;
}

type RenderedCodeToken = Tokens.Code & { renderedHtml?: string };

export async function renderMarkdown(markdown: string): Promise<string> {
  return (await renderMarkdownDocument(markdown, true)).html;
}

async function renderMarkdownDocument(markdown: string, renderBody: boolean) {
  const slugger = new GithubSlugger();
  const headings: PostHeading[] = [];
  const codeBlockSlugCounts = new Map<string, number>();
  const renderer = {
    code(token: RenderedCodeToken) {
      return token.renderedHtml ?? "";
    },
    heading(this: Renderer, { depth, text, tokens }: Tokens.Heading) {
      const id = slugger.slug(text);

      if (depth === 2 || depth === 3) {
        headings.push({ id, level: depth, text });
      }

      return renderBody
        ? `<h${depth} id="${id}">${this.parser.parseInline(tokens)}</h${depth}>`
        : "";
    },
  };

  const html = await new Marked({
    async: true,
    gfm: true,
    renderer,
    walkTokens(token) {
      if (token.type !== "code" || !("text" in token)) return;

      return renderCodeBlock(token as Tokens.Code, codeBlockSlugCounts).then(
        (renderedHtml) => {
          (token as RenderedCodeToken).renderedHtml = renderedHtml;
        },
      );
    },
  })
    .use(
      markedFootnote({
        description: "각주",
        backRefLabel: "각주 참조 {0}로 돌아가기",
      }),
    )
    .parse(markdown, { async: true });

  if (!renderBody) return { headings, html: "" };
  return { headings, html };
}

async function renderCodeBlock(
  token: Tokens.Code,
  slugCounts: Map<string, number>,
): Promise<string> {
  const language = token.lang?.match(/^\S+/)?.[0] ?? "";
  const meta = token.lang?.slice(language.length).trim() ?? "";
  const explicitId = getMetaAttribute(meta, "id")?.trim();
  const title = getMetaAttribute(meta, "title")?.trim();
  const idSource = explicitId || title;
  const id =
    explicitId || (idSource ? createUniqueSlug(idSource, slugCounts) : "");
  const code = await codeToHtml(token.text, {
    lang: Object.hasOwn(bundledLanguages, language) ? language : "plaintext",
    meta: { __raw: "" },
    theme: codeTheme,
    transformers: codeTransformers,
  });
  const caption = title
    ? `<figcaption data-rehype-pretty-code-title>${escapeAttribute(title)}</figcaption>`
    : "";

  return `<figure data-rehype-pretty-code-figure${id ? ` id="${escapeAttribute(id)}"` : ""}>${caption}${code}</figure>`;
}

function getMetaAttribute(meta: string, name: string): string | undefined {
  return meta.match(META_ATTRIBUTE_PATTERN(name))?.slice(1).find(Boolean);
}

function createUniqueSlug(source: string, counts: Map<string, number>): string {
  const slug = source
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const baseSlug = slug || "code";
  const count = (counts.get(baseSlug) ?? 0) + 1;

  counts.set(baseSlug, count);
  return count === 1 ? baseSlug : `${baseSlug}-${count}`;
}

function escapeAttribute(value: string): string {
  return value.replace(/[&"<>]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      '"': "&quot;",
      "<": "&lt;",
      ">": "&gt;",
    };

    return entities[character];
  });
}

export async function getPost(slug: string): Promise<Post | undefined> {
  return (await getPosts()).find((post) => post.data.slug === slug);
}

export function getPostDescription(post: Post): string {
  const description = post.data.description.trim();

  if (description.length > 0) {
    return description;
  }

  return (
    getMarkdownExcerpt(post.body ?? "", POST_DESCRIPTION_MAX_LENGTH) ||
    post.data.title
  );
}

function normalizePostDate(value: unknown): unknown {
  if (typeof value !== "string") {
    return value;
  }

  const compactDateMatch = value.match(COMPACT_DATE_REGEX);

  if (!compactDateMatch) {
    return value;
  }

  const [, year, month, day] = compactDateMatch;

  return `${year}-${month}-${day}`;
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
