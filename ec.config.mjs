import { pluginFileIcons } from "@xt0rted/expressive-code-file-icons";
import { defineEcConfig } from "astro-expressive-code";

const codeBlockSlugCountsByDoc = new Map();

const slugifyCodeId = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const getClassNames = (node) => {
  const value = node?.properties?.className ?? node?.properties?.class;
  if (Array.isArray(value)) return value;
  if (typeof value === "string") return value.split(/\s+/);
  return [];
};

const hasClass = (node, className) => getClassNames(node).includes(className);

const getTagName = (node) => node?.tagName ?? node?.name ?? "";

const findChild = (node, tagName, className) => {
  for (const child of node?.children ?? []) {
    if (child?.type !== "element" || getTagName(child) !== tagName) continue;
    if (!className || hasClass(child, className)) return child;
  }

  return null;
};

const addCodeBlockIds = {
  name: "add-code-block-ids",
  hooks: {
    postprocessRenderedBlock({ codeBlock, renderData }) {
      const explicitId = codeBlock.metaOptions.getString("id");
      const title = codeBlock.metaOptions.getString("title");
      const normalizedExplicitId = explicitId?.trim();
      const source =
        normalizedExplicitId || title?.trim() || codeBlock.props.title?.trim();

      if (!source) return;

      const figure =
        renderData.blockAst?.type === "element" &&
        getTagName(renderData.blockAst) === "figure" &&
        hasClass(renderData.blockAst, "frame")
          ? renderData.blockAst
          : findChild(renderData.blockAst, "figure", "frame");

      if (!figure) return;

      figure.properties ??= {};

      if (normalizedExplicitId) {
        figure.properties.id = normalizedExplicitId;
        return;
      }

      const docKey =
        codeBlock.parentDocument?.sourceFilePath ?? "__unknown_document__";

      if (!codeBlockSlugCountsByDoc.has(docKey)) {
        codeBlockSlugCountsByDoc.set(docKey, new Map());
      }

      const slugCounts = codeBlockSlugCountsByDoc.get(docKey);
      const baseSlug = slugifyCodeId(source) || "code";
      const count = (slugCounts.get(baseSlug) ?? 0) + 1;

      slugCounts.set(baseSlug, count);
      figure.properties.id = count === 1 ? baseSlug : `${baseSlug}-${count}`;
    },
  },
};

export default defineEcConfig({
  themes: ["houston"],
  plugins: [
    pluginFileIcons({
      iconClass: "size-6 shrink-0;",
    }),
    addCodeBlockIds,
  ],
  frames: {
    extractFileNameFromCode: true,
    showCopyToClipboardButton: true,
  },
  styleOverrides: {
    borderRadius: "1rem",
    codeFontFamily:
      'var(--font-geist-mono), ui-monospace, "SFMono-Regular", Menlo, Monaco, Consolas, monospace',
    frames: {
      frameBoxShadowCssValue: "none",
      editorTabBarBackground: "#ffffff",
      editorTabBarBorderColor: "#e4e4e7",
      editorTabBarBorderBottomColor: "#e4e4e7",
      editorTabsMarginInlineStart: "0",
      editorTabsMarginBlockStart: "0",
      editorActiveTabBackground: "#ffffff",
      editorActiveTabForeground: "#27272a",
      editorActiveTabBorderColor: "#e4e4e7",
      editorActiveTabIndicatorTopColor: "transparent",
      editorActiveTabIndicatorBottomColor: "transparent",
      editorBackground: "#18181b",
      terminalTitlebarBackground: "#ffffff",
      terminalTitlebarForeground: "#52525b",
      terminalTitlebarBorderBottomColor: "#e4e4e7",
      terminalBackground: "#18181b",
      inlineButtonForeground: "#52525b",
      inlineButtonBackground: "#71717a",
      inlineButtonBorder: "#d4d4d8",
    },
  },
});
