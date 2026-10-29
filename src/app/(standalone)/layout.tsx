import {
  colorVars,
  spacingVars,
  typo as typographyVars,
} from "@bolerish/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";

const styles = stylex.create({
  page: {
    backgroundColor: colorVars.bgSurface,
    color: colorVars.fgPrimary,
    fontFamily: typographyVars.fontFamilyBody,
    minHeight: "100vh",
    paddingBlock: spacingVars.space5,
    paddingInline: spacingVars.space5,
    "@media (min-width: 48rem)": { paddingInline: spacingVars.space8 },
  },
  content: { marginInline: "auto", maxWidth: "65vw", width: "100%" },
});

export default function Layout({ children }: { children: ReactNode }) {
  return <main {...stylex.props(styles.page, styles.content)}>{children}</main>;
}
