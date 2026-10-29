import { radiusVars, spacingVars } from "@bolerish/tokens/semantic.stylex";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@bolerish/ui/card";
import { Heading } from "@bolerish/ui/heading";
import { Link } from "@bolerish/ui/link";
import { Separator } from "@bolerish/ui/separator";
import * as stylex from "@stylexjs/stylex";
import type { Metadata } from "next";
import Image from "next/image";
import { PROJECTS } from "./data";

const DESCRIPTION = "그동안 만들었던 것들";

const styles = stylex.create({
  page: { display: "grid", gap: spacingVars.space10 },
  grid: {
    display: "grid",
    gap: spacingVars.space4,
    gridTemplateColumns: "1fr",
    "@media (min-width: 40rem)": {
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    },
  },
  card: { height: "100%" },
  header: { flex: 1 },
  logo: {
    borderRadius: radiusVars.sm,
    height: "2.5rem",
    marginBlockEnd: spacingVars.space3,
    objectFit: "cover",
    width: "2.5rem",
  },
});

export const metadata: Metadata = {
  title: "projects",
  description: DESCRIPTION,
};

export default function ProjectsPage() {
  return (
    <>
      <div {...stylex.props(styles.page)}>
        <Heading level={1} size="page" style={{ fontSize: "2rem" }}>
          {DESCRIPTION}
        </Heading>
        <Separator />

        <ul {...stylex.props(styles.grid)}>
          {PROJECTS.map((project) => (
            <li key={project.name}>
              <Card {...stylex.props(styles.card)}>
                <CardHeader {...stylex.props(styles.header)}>
                  <Image
                    src={project.logo}
                    width={50}
                    height={50}
                    alt=""
                    {...stylex.props(styles.logo)}
                  />
                  <Heading
                    level={2}
                    size="subsection"
                    style={{ fontSize: "1.125rem" }}
                  >
                    {project.name}
                  </Heading>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>

                <CardFooter>
                  <Link href={project.href} target="_blank" rel="noreferrer">
                    {project.label}
                  </Link>
                </CardFooter>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
