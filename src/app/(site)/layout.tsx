import {
  colorVars,
  spacingVars,
  typo as typographyVars,
} from "@bolerish/tokens/semantic.stylex";
import { Link } from "@bolerish/ui/link";
import { GithubLogoIcon } from "@phosphor-icons/react/dist/ssr";
import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { SITE_TITLE } from "~/shared/constants/meta";

const styles = stylex.create({
  page: {
    backgroundColor: colorVars.bgSurface,
    color: colorVars.fgPrimary,
    display: "flex",
    flexDirection: "column",
    fontFamily: typographyVars.fontFamilyBody,
    gap: spacingVars.space10,
    minHeight: "100vh",
    paddingBlock: spacingVars.space5,
    paddingInline: spacingVars.space5,
    "@media (min-width: 48rem)": { paddingInline: spacingVars.space8 },
  },
  shell: { marginInline: "auto", maxWidth: "42rem", width: "100%" },
  header: {
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between",
  },
  brand: {
    color: colorVars.fgPrimary,
    fontFamily: "var(--font-zen-serif), serif",
    fontSize: typographyVars.fontSizeMd,
    letterSpacing: "0.04em",
  },
  main: { flex: 1 },
  footer: {
    display: "grid",
    fontSize: "0.875rem",
    gap: spacingVars.space4,
    paddingBlock: spacingVars.space12,
    color: colorVars.fgTertiary,
  },
  footerRow: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingInline: spacingVars.space2,
  },
  contact: {
    alignItems: "center",
    display: "flex",
    gap: spacingVars.space2,
  },
  link: {
    display: "inline-flex",
    alignItems: "center",
    gap: spacingVars.space1,
    fontSize: "0.875rem",
  },
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div {...stylex.props(styles.page)}>
      <header {...stylex.props(styles.shell, styles.header)}>
        <Link href="/" variant="plain" {...stylex.props(styles.brand)}>
          {SITE_TITLE}
        </Link>
      </header>

      <main {...stylex.props(styles.shell, styles.main)}>{children}</main>

      <footer {...stylex.props(styles.shell, styles.footer)}>
        <div {...stylex.props(styles.footerRow)}>
          <span>© 2026 Minyeong Jeong</span>

          <nav aria-label="소셜 링크" {...stylex.props(styles.contact)}>
            <Link
              {...stylex.props(styles.link)}
              href="https://github.com/myjeong19"
              target="_blank"
              rel="noreferrer"
              variant="current"
            >
              <GithubLogoIcon size={16} aria-hidden="true" />
              GitHub
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
