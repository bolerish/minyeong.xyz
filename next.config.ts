import path from "node:path";
import withStylex from "@stylexswc/nextjs-plugin/turbopack";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  transpilePackages: ["@bolerish/tokens"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "notionpresso.com",
        pathname: "/icon.jpeg",
      },
    ],
  },
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
