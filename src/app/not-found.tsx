import {
  colorVars,
  spacingVars,
  typo as typographyVars,
} from "@bolerish/tokens/semantic.stylex";
import { Heading } from "@bolerish/ui/heading";
import { Link } from "@bolerish/ui/link";
import * as stylex from "@stylexjs/stylex";

const styles = stylex.create({
  page: {
    backgroundColor: colorVars.bgSurface,
    color: colorVars.fgPrimary,
    fontFamily: typographyVars.fontFamilyBody,
    minHeight: "100vh",
    paddingBlock: spacingVars.space5,
  },
  root: {
    display: "flex",
    flexDirection: "column",
    gap: spacingVars.space8,
    marginInline: "auto",
    maxWidth: "57.5rem",
    paddingBlock: spacingVars.space12,
    width: "100%",
  },
  message: { display: "grid", gap: spacingVars.space3 },
  code: {
    color: colorVars.fgTertiary,
    fontSize: typographyVars.fontSizeLg,
    fontWeight: typographyVars.fontWeightMedium,
  },
  description: {
    color: colorVars.fgSecondary,
    fontSize: typographyVars.fontSizeSm,
    lineHeight: typographyVars.lineHeightNormal,
  },
  link: { width: "fit-content" },
});

export default function NotFoundPage() {
  return (
    <main {...stylex.props(styles.page)}>
      <div {...stylex.props(styles.root)}>
        <div {...stylex.props(styles.message)}>
          <p {...stylex.props(styles.code)}>404</p>
          <Heading level={1} size="page" style={{ fontSize: "2rem" }}>
            페이지를 찾을 수 없습니다.
          </Heading>
          <p {...stylex.props(styles.description)}>
            요청한 페이지가 없거나, 주소가 변경되었을 수 있습니다.
          </p>
        </div>

        <Link href="/" {...stylex.props(styles.link)}>
          홈으로 돌아가기
        </Link>
      </div>
    </main>
  );
}
