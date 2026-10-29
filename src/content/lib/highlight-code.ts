import type { ShikiTransformer } from "shiki";

export const codeTheme = "github-light-default";

export const codeTransformers: ShikiTransformer[] = [
  {
    pre(node) {
      const meta = this.options.meta?.__raw;
      const id = meta
        ?.match(/\bid=(?:"([^"]+)"|'([^']+)'|(\S+))/)
        ?.slice(1)
        .find(Boolean);

      if (id) node.properties.id = id;
    },
    code(node) {
      node.properties["data-line-numbers"] = "";
    },
    line(node, line) {
      node.properties["data-line"] = "";

      if (this.options.lang === "diff") {
        const marker = this.source.split("\n")[line - 1]?.[0];

        if (marker === "+") node.properties["data-diff"] = "add";
        if (marker === "-") node.properties["data-diff"] = "remove";
      }
    },
  },
];
