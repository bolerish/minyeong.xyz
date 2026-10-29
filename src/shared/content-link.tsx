import { Link } from "@bolerish/ui/link";
import type { ComponentProps } from "react";

export function ContentLink({ style, ...props }: ComponentProps<"a">) {
  return (
    <Link
      {...props}
      style={{ display: "inline", fontFamily: "inherit", ...style }}
    />
  );
}
