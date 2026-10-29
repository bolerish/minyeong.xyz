import {
  colorVars,
  spacingVars,
  typo as typographyVars,
} from "@bolerish/tokens/semantic.stylex";
import { Heading } from "@bolerish/ui/heading";
import { Link } from "@bolerish/ui/link";
import * as stylex from "@stylexjs/stylex";
import { getPostDescription, getPosts, type Post } from "~/content/lib/posts";

const styles = stylex.create({
  groups: {
    marginBlock: spacingVars.space12,
  },
  group: {
    alignItems: "baseline",
    display: "grid",
    gap: spacingVars.space3,
    gridTemplateColumns: "3.5rem minmax(0, 1fr)",
  },
  year: {
    color: colorVars.fgTertiary,
    fontWeight: typographyVars.fontWeightRegular,
    fontSize: typographyVars.fontSizeXs,
    height: "fit-content",
  },
  list: { display: "grid", gap: spacingVars.space1 },
  postLink: {
    alignItems: "flex-start",
    borderRadius: "0.375rem",
    color: colorVars.fgPrimary,
    display: "flex",
    flexDirection: "column",
    gap: spacingVars.space1,
    padding: spacingVars.space2,
    width: "100%",
    ":hover": { backgroundColor: colorVars.interactionHover, opacity: 1 },
    ":active": { backgroundColor: colorVars.interactionPressed },
  },
  postTitle: {
    fontWeight: typographyVars.fontWeightRegular,
    fontSize: typographyVars.fontSizeMd,
  },
  description: {
    color: colorVars.fgTertiary,
    display: "-webkit-box",
    fontSize: typographyVars.fontSizeSm,
    lineHeight: typographyVars.lineHeightNormal,
    overflow: "hidden",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 2,
  },
});

export default async function HomePage() {
  const posts = (await getPosts()).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  const postsByYear: Record<string, Post[]> = {};

  for (const post of posts) {
    const year = String(post.data.pubDate.getFullYear());
    postsByYear[year] ??= [];
    postsByYear[year].push(post);
  }

  const groupedPosts = Object.entries(postsByYear).sort(
    ([a], [b]) => Number(b) - Number(a),
  );

  return (
    <div {...stylex.props(styles.groups)}>
      {groupedPosts.map(([year, yearPosts]) => (
        <section {...stylex.props(styles.group)} key={year}>
          <h2 {...stylex.props(styles.year)}>{year}</h2>

          <ul {...stylex.props(styles.list)}>
            {yearPosts.map((post) => (
              <li key={post.data.slug}>
                <Link
                  href={`/${post.data.slug}`}
                  variant="plain"
                  {...stylex.props(styles.postLink)}
                >
                  <Heading
                    level={3}
                    size="subsection"
                    {...stylex.props(styles.postTitle)}
                    style={{ fontSize: "1.125rem" }}
                  >
                    {post.data.title}
                  </Heading>
                  <p {...stylex.props(styles.description)}>
                    {getPostDescription(post)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
