import * as stylex from "@stylexjs/stylex";
import type { Metadata } from "next";
import "@bolerish/ui/global.css";
import "~/shared/styles/global.css";
import "~/shared/styles/content.css";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { SITE_DESCRIPTION, SITE_TITLE } from "~/shared/constants/meta";
import { contentTokens } from "~/shared/styles/content-tokens";

const lineSeed = localFont({
  src: [
    {
      path: "../assets/fonts/LINESeedKR/LINESeedKR-Th.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../assets/fonts/LINESeedKR/LINESeedKR-Rg.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/LINESeedKR/LINESeedKR-Bd.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-line-seed-kr",
});

const geistMono = localFont({
  src: [
    {
      path: "../assets/fonts/GeistMono/GeistMono[wght].woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../assets/fonts/GeistMono/GeistMono-Italic[wght].woff2",
      weight: "100 900",
      style: "italic",
    },
  ],
  variable: "--font-geist-mono",
});

const zenSerif = localFont({
  src: "../assets/fonts/ZEN-SERIF/ZEN-SERIF-Regular.otf",
  variable: "--font-zen-serif",
  weight: "400",
});

// Keep every page statically generated; fail builds if request-time APIs are introduced.
export const dynamic = "error";

export const metadata: Metadata = {
  metadataBase: new URL("https://minyeong.xyz"),
  title: {
    default: SITE_TITLE,
    template: `%s — ${SITE_TITLE}`,
  },
  description: SITE_DESCRIPTION,
  alternates: {
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
  openGraph: {
    locale: "ko_KR",
    siteName: SITE_TITLE,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="ko"
      className={`${lineSeed.variable} ${geistMono.variable} ${zenSerif.variable}`}
    >
      <body {...stylex.props(contentTokens.root)}>{children}</body>
    </html>
  );
}
