// @ts-check
import { fileURLToPath } from "node:url";
import { rehypeHeadingIds } from "@astrojs/markdown-remark";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import astroExpressiveCode from "astro-expressive-code";
import { defineConfig, fontProviders } from "astro/config";
// import remarkGfm from "remark-gfm";
import remarkToc from "remark-toc";

export default defineConfig({
  site: "https://minyeong.xyz",
  integrations: [sitemap(), astroExpressiveCode()],
  trailingSlash: "never",
  fonts: [
    {
      provider: fontProviders.local(),
      name: "SUIT",
      cssVariable: "--font-suit",
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/SUIT/SUIT-Regular.woff2"],
            weight: "400",
            style: "normal",
          },
          {
            src: ["./src/assets/fonts/SUIT/SUIT-Bold.woff2"],
            weight: "700",
            style: "normal",
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "GeistMono",
      cssVariable: "--font-geist-mono",
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/GeistMono/GeistMono[wght].woff2"],
            weight: "100 900",
            style: "normal",
          },
          {
            src: ["./src/assets/fonts/GeistMono/GeistMono-Italic[wght].woff2"],
            weight: "100 900",
            style: "italic",
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "ZenSerif",
      cssVariable: "--font-zen-serif-family",
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/ZEN-SERIF/ZEN-SERIF-Regular.otf"],
            weight: "100 900",
            style: "normal",
          },
        ],
      },
    },
  ],

  markdown: {
    remarkPlugins: [[remarkToc, { heading: "TOC", maxDepth: 3 }]],
    rehypePlugins: [rehypeHeadingIds],
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ["astro/toolbar"],
    },
    resolve: {
      alias: {
        "~": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  },
});
