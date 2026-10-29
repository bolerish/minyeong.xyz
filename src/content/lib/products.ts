import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { cache } from "react";
import { z } from "zod";

const PRODUCTS_DIRECTORY = path.join(process.cwd(), "src/content/products");
const privacySchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  effectiveDate: z.coerce
    .date()
    .transform((date) => date.toISOString().slice(0, 10)),
});

export const getProductSlugs = cache(async () => {
  const entries = await readdir(PRODUCTS_DIRECTORY, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
});

export const getProductPrivacy = cache(async (slug: string) => {
  if (!(await getProductSlugs()).includes(slug)) return;

  const source = await readFile(
    path.join(PRODUCTS_DIRECTORY, slug, "privacy.mdx"),
    "utf8",
  );
  const { content, data } = matter(source);

  return { body: content, data: privacySchema.parse(data) };
});
