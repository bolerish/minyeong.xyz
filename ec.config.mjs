import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import { createInlineSvgUrl, defineEcConfig } from "astro-expressive-code";

const DEFAULT_CODE_BLOCK_ID = "code";
const UNKNOWN_DOCUMENT_KEY = "__unknown_document__";

const COPY_ICON =
  createInlineSvgUrl(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
</svg>
`);

export default defineEcConfig({
  themes: ["github-dark-default"],
  plugins: [createCodeBlockIdsPlugin(), pluginLineNumbers()],
  frames: {
    extractFileNameFromCode: true,
  },
  defaultProps: {
    wrap: true,
  },
  styleOverrides: {
    frames: {
      copyIcon: COPY_ICON,
    },
  },
  shiki: { bundledLangs: ["astro"] },
});

function createCodeBlockIdsPlugin() {
  const slugCountsByDocument = new Map();

  return {
    name: "add-code-block-ids",
    hooks: {
      postprocessRenderedBlock({ codeBlock, renderData }) {
        const explicitId = codeBlock.metaOptions.getString("id")?.trim();
        const idSource = resolveCodeBlockIdSource(codeBlock, explicitId);

        if (!idSource) return;

        const frameFigure = findCodeFrameFigure(renderData.blockAst);

        if (!frameFigure) return;

        frameFigure.properties ??= {};
        frameFigure.properties.id =
          explicitId ||
          createUniqueCodeBlockSlug(codeBlock, idSource, slugCountsByDocument);
      },
    },
  };
}

function resolveCodeBlockIdSource(codeBlock, explicitId) {
  return (
    explicitId ||
    codeBlock.metaOptions.getString("title")?.trim() ||
    codeBlock.props.title?.trim()
  );
}

function createUniqueCodeBlockSlug(codeBlock, source, slugCountsByDocument) {
  const documentKey =
    codeBlock.parentDocument?.sourceFilePath ?? UNKNOWN_DOCUMENT_KEY;
  const slugCounts = getDocumentSlugCounts(slugCountsByDocument, documentKey);
  const baseSlug = slugifyCodeId(source) || DEFAULT_CODE_BLOCK_ID;
  const count = (slugCounts.get(baseSlug) ?? 0) + 1;

  slugCounts.set(baseSlug, count);

  return count === 1 ? baseSlug : `${baseSlug}-${count}`;
}

function getDocumentSlugCounts(slugCountsByDocument, documentKey) {
  if (!slugCountsByDocument.has(documentKey)) {
    slugCountsByDocument.set(documentKey, new Map());
  }

  return slugCountsByDocument.get(documentKey);
}

function findCodeFrameFigure(node) {
  if (
    node?.type === "element" &&
    getTagName(node) === "figure" &&
    hasClass(node, "frame")
  ) {
    return node;
  }

  return findChild(node, "figure", "frame");
}

function findChild(node, tagName, className) {
  for (const child of node?.children ?? []) {
    if (child?.type !== "element" || getTagName(child) !== tagName) continue;
    if (!className || hasClass(child, className)) return child;
  }

  return null;
}

function getTagName(node) {
  return node?.tagName ?? node?.name ?? "";
}

function hasClass(node, className) {
  return getClassNames(node).includes(className);
}

function getClassNames(node) {
  const value = node?.properties?.className ?? node?.properties?.class;
  if (Array.isArray(value)) return value;
  if (typeof value === "string") return value.split(/\s+/);
  return [];
}

function slugifyCodeId(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
