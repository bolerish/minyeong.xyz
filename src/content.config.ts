import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const posts = defineCollection({
  loader: glob({ base: "./src/content/posts", pattern: "**/*.{md,mdx}" }),
  schema: getPostSchema,
});

export const collections = { posts };

const postDateSchema = z.preprocess(normalizePostDate, z.coerce.date());

function getPostSchema() {
  return z.object({
    title: z.string(),
    description: z
      .string()
      .nullish()
      .transform((value) => value ?? ""),
    category: z.string(),
    pubDate: postDateSchema,
    updatedDate: postDateSchema.optional(),
  });
}

const COMPACT_DATE_REGEX = /^(\d{4})(\d{2})(\d{2})$/;

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
