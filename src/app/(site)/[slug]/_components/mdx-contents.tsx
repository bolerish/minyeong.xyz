import {
  colorVars,
  sizeVars,
  spacingVars,
  typo as typographyVars,
} from "@bolerish/tokens/semantic.stylex";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@bolerish/ui/accordion";
import { Badge } from "@bolerish/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@bolerish/ui/card";
import { Checkbox } from "@bolerish/ui/checkbox";
import { Heading } from "@bolerish/ui/heading";
import { Kbd, KbdGroup } from "@bolerish/ui/kbd";
import { Marker, MarkerContent, MarkerIcon } from "@bolerish/ui/marker";
import { Separator } from "@bolerish/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@bolerish/ui/table";
import { ArrowBendDownLeftIcon } from "@phosphor-icons/react/ssr";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";
import { ContentLink } from "~/shared/content-link";

const styles = stylex.create({
  heading: {
    marginBlockEnd: spacingVars.space1,
    marginBlockStart: spacingVars.space12,
  },
  taskCheckbox: { marginInlineEnd: spacingVars.space2 },
  footnoteBackref: {
    alignItems: "center",
    color: colorVars.fgFeedbackInfo,
    display: "inline-flex",
    justifyContent: "center",
    minHeight: sizeVars.controlXs,
    minWidth: sizeVars.controlXs,
    verticalAlign: "middle",
  },

  kbd: {
    verticalAlign: "middle",
    paddingInline: spacingVars.space2,
    height: "fit-content",
    fontSize: typographyVars.fontSizeXs,
    marginInline: spacingVars.space1,
  },
});

function H2(props: ComponentProps<"h2">) {
  if (props.id === "footnote-label") {
    return null;
  }

  return (
    <Heading
      {...props}
      level={2}
      size="section"
      xstyle={styles.heading}
      style={{ fontSize: typographyVars.fontSizeXl }}
    />
  );
}

function H3(props: ComponentProps<"h3">) {
  return (
    <Heading
      {...props}
      level={3}
      size="subsection"
      xstyle={styles.heading}
      style={{ fontSize: typographyVars.fontSizeLg }}
    />
  );
}

function H4(props: ComponentProps<"h4">) {
  return (
    <Heading
      {...props}
      level={4}
      size="subsection"
      xstyle={styles.heading}
      style={{ fontSize: typographyVars.fontSizeLg }}
    />
  );
}

function H5(props: ComponentProps<"h5">) {
  return (
    <Heading
      {...props}
      level={5}
      size="subsection"
      xstyle={styles.heading}
      style={{ fontSize: typographyVars.fontSizeLg }}
    />
  );
}

function H6(props: ComponentProps<"h6">) {
  return (
    <Heading
      {...props}
      level={6}
      size="subsection"
      xstyle={styles.heading}
      style={{ fontSize: typographyVars.fontSizeLg }}
    />
  );
}

function MarkdownKbd(props: ComponentProps<"span">) {
  return <Kbd {...props} {...stylex.props(styles.kbd)} />;
}

function MarkdownInput({
  type,
  checked,
  disabled,
  ...props
}: ComponentProps<"input">) {
  if (type !== "checkbox") {
    return (
      <input {...props} type={type} checked={checked} disabled={disabled} />
    );
  }

  return (
    <Checkbox
      aria-label={checked ? "완료된 항목" : "완료되지 않은 항목"}
      checked={checked}
      disabled={disabled}
      xstyle={styles.taskCheckbox}
    />
  );
}

function MarkdownTable(props: ComponentProps<"table">) {
  return (
    <TableContainer>
      <Table {...props} />
    </TableContainer>
  );
}

type MarkdownLinkProps = ComponentProps<"a"> & {
  "data-footnote-backref"?: string;
  "data-footnote-ref"?: string;
};

function MarkdownLink({ children, ...props }: MarkdownLinkProps) {
  if ("data-footnote-ref" in props) {
    const { "aria-describedby": _descriptionId, ...footnoteProps } = props;
    return <a {...footnoteProps}>{children}</a>;
  }

  if (!("data-footnote-backref" in props)) {
    return <ContentLink {...props}>{children}</ContentLink>;
  }

  return (
    <a {...props} {...stylex.props(styles.footnoteBackref)}>
      <ArrowBendDownLeftIcon aria-hidden="true" size={sizeVars.iconSm} />
    </a>
  );
}

export const mdxComponents = {
  a: MarkdownLink,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  hr: Separator,
  input: MarkdownInput,
  table: MarkdownTable,
  thead: TableHeader,
  tbody: TableBody,
  tr: TableRow,
  th: TableHead,
  td: TableCell,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Heading,
  Kbd: MarkdownKbd,
  KbdGroup,
  Marker,
  MarkerContent,
  MarkerIcon,
  Separator,
};
