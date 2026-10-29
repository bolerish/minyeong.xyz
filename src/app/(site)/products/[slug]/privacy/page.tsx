import {
  colorVars,
  layoutVars,
  radiusVars,
  spacingVars,
  typo as typographyVars,
} from "@bolerish/tokens/semantic.stylex";
import { Heading } from "@bolerish/ui/heading";
import { Separator } from "@bolerish/ui/separator";
import { compile, run } from "@mdx-js/mdx";
import * as stylex from "@stylexjs/stylex";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import { getProductPrivacy, getProductSlugs } from "~/content/lib/products";
import { ContentLink } from "~/shared/content-link";

type PrivacyPageProps = {
  params: Promise<{ slug: string }>;
};

const styles = stylex.create({
  readingColumn: {
    marginInline: "auto",
    maxWidth: layoutVars.contentMaxWidth,
    width: "100%",
  },
  contentLayout: {
    marginBlock: spacingVars.space12,
    position: "relative",
    width: "100%",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: spacingVars.space4,
    marginBlock: spacingVars.space12,
  },
  icon: {
    borderRadius: radiusVars.sm,
    height: "3rem",
    width: "3rem",
  },
  title: {
    color: colorVars.fgSecondary,
    fontSize: "3rem",
  },
  date: {
    color: colorVars.fgTertiary,
    fontSize: typographyVars.fontSizeXs,
  },
  prose: {
    color: colorVars.fgSecondary,
    fontFamily: typographyVars.fontFamilyBody,
  },
});

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getProductSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PrivacyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const privacy = await getProductPrivacy(slug);

  if (!privacy) return {};

  return {
    title: privacy.data.title,
    description: privacy.data.description,
    alternates: { canonical: `/products/${slug}/privacy` },
  };
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { slug } = await params;
  const privacy = await getProductPrivacy(slug);

  if (!privacy) notFound();
  const compiled = await compile(privacy.body, {
    outputFormat: "function-body",
    remarkPlugins: [remarkGfm],
  });
  const { default: Content } = await run(compiled, runtime);
  const proseStyles = stylex.props(styles.readingColumn, styles.prose);

  return (
    <>
      <header {...stylex.props(styles.readingColumn, styles.header)}>
        <Image
          src={privacy.data.icon}
          width={48}
          height={48}
          alt=""
          {...stylex.props(styles.icon)}
        />
        <Heading level={1} size="page" {...stylex.props(styles.title)}>
          {privacy.data.title}
        </Heading>
        <p {...stylex.props(styles.date)}>
          Effective Date:{" "}
          <time dateTime={privacy.data.effectiveDate}>
            {privacy.data.effectiveDate}
          </time>
        </p>
      </header>

      <Separator />

      <div {...stylex.props(styles.contentLayout)}>
        <article {...proseStyles} className={`prose ${proseStyles.className}`}>
          <Content components={{ a: ContentLink }} />
        </article>
      </div>
    </>
  );
}
