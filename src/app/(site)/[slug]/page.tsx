import {
  colorVars,
  sizeVars,
  spacingVars,
  typo as typographyVars,
} from "@bolerish/tokens/semantic.stylex";
import { Avatar } from "@bolerish/ui/avatar";
import { Heading } from "@bolerish/ui/heading";
import { Separator } from "@bolerish/ui/separator";
import { compile, run } from "@mdx-js/mdx";
import * as stylex from "@stylexjs/stylex";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import * as runtime from "react/jsx-runtime";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { codeTheme, codeTransformers } from "~/content/lib/highlight-code";
import { getPost, getPostDescription, getPosts } from "~/content/lib/posts";
import { SITE_TITLE } from "~/shared/constants/meta";
import { mdxComponents } from "./_components/mdx-contents";
import { TableOfContents } from "./_components/table-of-contents";

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

const styles = stylex.create({
  readingColumn: {
    marginInline: "auto",
    width: "100%",
  },
  contentLayout: {
    position: "relative",
    width: "100%",
    marginBlock: spacingVars.space12,
  },
  tocRail: {
    display: { default: "none", "@media (min-width: 1200px)": "block" },
    insetBlock: 0,
    left: "calc(100% + (100vw - 100%) * 0.1875)",
    transform: "translateX(-50%)",
    position: "absolute",
    width: sizeVars.controlXs,
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: spacingVars.space4,
    marginBlock: spacingVars.space12,
  },
  meta: {
    color: colorVars.fgSecondary,
    display: "flex",
    flexDirection: "column",
    fontSize: typographyVars.fontSizeSm,
  },
  title: {
    color: colorVars.fgPrimary,
    fontSize: "3rem",
  },

  authorRow: {
    alignItems: "center",
    display: "flex",
    gap: spacingVars.space3,
  },
  avatarImage: {
    borderRadius: "inherit",
    height: "100%",
    objectFit: "cover",
    width: "100%",
  },
  author: {
    color: colorVars.fgPrimary,
    fontWeight: typographyVars.fontWeightSemibold,
    fontSize: "1rem",
  },
  metaDetails: {
    alignItems: "center",
    display: "flex",
    gap: spacingVars.space2,
  },
  date: { color: colorVars.fgTertiary, fontSize: "0.875rem", lineHeight: 1.5 },
  prose: {
    anchorName: "--post-content",
    color: colorVars.fgSecondary,
    fontFamily: typographyVars.fontFamilyBody,
  },
});

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getPosts()).map((post) => ({ slug: post.data.slug }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {};
  }

  const description = getPostDescription(post);

  return {
    title: post.data.title,
    description,
    alternates: { canonical: `/${slug}` },
    openGraph: {
      type: "article",
      title: post.data.title,
      description,
      publishedTime: post.data.pubDate.toISOString(),
      modifiedTime: (post.data.updatedDate ?? post.data.pubDate).toISOString(),
      authors: ["Minyeong Jeong"],
    },
    twitter: {
      title: post.data.title,
      description,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const description = getPostDescription(post);
  let mdxContent = null;

  if (post.format === "mdx") {
    const compiled = await compile(post.body, {
      outputFormat: "function-body",
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypePrettyCode,
          {
            theme: codeTheme,
            transformers: codeTransformers,
          },
        ],
      ],
    });
    const { default: Content } = await run(compiled, runtime);
    mdxContent = <Content components={mdxComponents} />;
  }
  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.data.title,
    description,
    datePublished: post.data.pubDate.toISOString(),
    dateModified: (post.data.updatedDate ?? post.data.pubDate).toISOString(),
    author: {
      "@type": "Person",
      name: "Minyeong Jeong",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://minyeong.xyz/${slug}`,
    },
    publisher: {
      "@type": "Person",
      name: SITE_TITLE,
    },
  }).replace(/</g, "\\u003c");
  const proseStyles = stylex.props(styles.readingColumn, styles.prose);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schema }}
      />

      <header {...stylex.props(styles.readingColumn, styles.header)}>
        <Heading level={1} size="page" {...stylex.props(styles.title)}>
          {post.data.title}
        </Heading>
        <div {...stylex.props(styles.authorRow)}>
          <Avatar size="lg" aria-hidden="true">
            <Image
              alt=""
              height={48}
              priority
              src="/images/profile.png"
              width={48}
              {...stylex.props(styles.avatarImage)}
            />
          </Avatar>

          <div {...stylex.props(styles.meta)}>
            <strong {...stylex.props(styles.author)}>정민영</strong>
            <div {...stylex.props(styles.metaDetails, styles.date)}>
              <time dateTime={post.data.pubDate.toISOString()}>
                {post.data.pubDate.toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </time>
              <span aria-hidden="true">·</span>
              <span>{post.readingMinutes}분 </span>
            </div>
          </div>
        </div>
      </header>

      <Separator />

      <div {...stylex.props(styles.contentLayout)}>
        {mdxContent ? (
          <article
            {...proseStyles}
            className={`prose ${proseStyles.className}`}
          >
            {mdxContent}
          </article>
        ) : (
          <article
            {...proseStyles}
            className={`prose ${proseStyles.className}`}
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        )}

        <aside {...stylex.props(styles.tocRail)}>
          <TableOfContents headings={post.headings} />
        </aside>
      </div>
    </>
  );
}
