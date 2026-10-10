import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Page width: 1320px of content plus the side gutter (20 / 32 / 48px at
 * <640 / 640–1023 / >=1024, from --gutter-x).
 */
export function Container({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "nav" | "header" | "footer";
}) {
  return (
    <Tag
      className={cn("mx-auto w-full", className)}
      style={{ maxWidth: "calc(1320px + 2 * var(--gutter-x))", paddingInline: "var(--gutter-x)" }}
    >
      {children}
    </Tag>
  );
}
