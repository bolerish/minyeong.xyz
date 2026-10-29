"use client";

import {
  colorVars,
  sizeVars,
  spacingVars,
} from "@bolerish/tokens/semantic.stylex";
import { Button } from "@bolerish/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@bolerish/ui/tooltip";
import * as stylex from "@stylexjs/stylex";
import { useEffect, useState } from "react";
import type { PostHeading } from "~/content/lib/posts";
import { isPageBottom } from "./table-of-contents-state";

const styles = stylex.create({
  root: {
    alignSelf: "start",
    display: "grid",
    maxHeight: "calc(100dvh - 3rem)",
    overflowY: "auto",
    position: "sticky",
    scrollbarWidth: "none",
    top: spacingVars.space6,
  },
  items: { display: "grid", justifyItems: "start" },
  item: {
    height: spacingVars.space5,
    width: sizeVars.controlXs,
  },
  line: {
    backgroundColor: "currentColor",
    color: colorVars.fgTertiary,
    height: sizeVars.focusRing,
    transitionDuration: "160ms",
    transitionProperty: "color, width",
    width: spacingVars.space4,
    "@media (prefers-reduced-motion: reduce)": { transitionDuration: "0.01ms" },
  },
  currentLine: {
    color: colorVars.fgPrimary,
    width: spacingVars.space6,
  },
});

export function TableOfContents({
  headings,
}: {
  headings: readonly PostHeading[];
}) {
  const [activeId, setActiveId] = useState(headings[0]?.id);

  useEffect(() => {
    function updateActiveHeading() {
      if (
        isPageBottom(
          window.innerHeight,
          window.scrollY,
          document.documentElement.scrollHeight,
        )
      ) {
        setActiveId(headings.at(-1)?.id ?? headings[0]?.id);
        return;
      }

      let nextId = headings[0]?.id;

      for (const heading of headings) {
        const element = document.getElementById(heading.id);
        if (
          element &&
          element.getBoundingClientRect().top <= window.innerHeight * 0.3
        ) {
          nextId = heading.id;
        }
      }

      setActiveId(nextId);
    }

    updateActiveHeading();
    window.addEventListener("scroll", updateActiveHeading, { passive: true });
    window.addEventListener("resize", updateActiveHeading);

    return () => {
      window.removeEventListener("scroll", updateActiveHeading);
      window.removeEventListener("resize", updateActiveHeading);
    };
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <TooltipProvider delay={0}>
      <nav aria-label="목차" {...stylex.props(styles.root)}>
        <div {...stylex.props(styles.items)}>
          {headings.map((heading) => (
            <Tooltip key={heading.id}>
              <TooltipTrigger
                render={
                  <Button
                    nativeButton={false}
                    render={
                      <a href={`#${heading.id}`} aria-label={heading.text} />
                    }
                    variant="ghost"
                    size="icon"
                    {...stylex.props(styles.item)}
                    aria-label={heading.text}
                    aria-current={
                      activeId === heading.id ? "location" : undefined
                    }
                  >
                    <span
                      aria-hidden="true"
                      {...stylex.props(
                        styles.line,
                        activeId === heading.id && styles.currentLine,
                      )}
                    />
                  </Button>
                }
              />
              <TooltipContent side="right">{heading.text}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </nav>
    </TooltipProvider>
  );
}
