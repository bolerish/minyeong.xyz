import path from "node:path";
import withStylex from "@stylexswc/nextjs-plugin/turbopack";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  output: "export",
  transpilePackages: ["@bolerish/tokens"],
  images: { unoptimized: true },
};

export default withStylex({
  rsOptions: {
    aliases: {
      "~/*": [path.join(process.cwd(), "src", "*")],
    },
    dev: process.env.NODE_ENV === "development",
    unstable_moduleResolution: {
      type: "commonJS",
    },
  },
})(nextConfig);
