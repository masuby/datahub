import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The page grid: 4 columns under 640px, 8 to 1023px, 12 from 1024px, with the
 * --col-gap gutter (16 / 24px). Children place themselves with Tailwind
 * col-start / col-span classes, e.g. `col-span-4 sm:col-span-8 lg:col-start-4 lg:col-span-9`.
 */
export function Grid({
  children,
  className,
  style,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  as?: "div" | "ul" | "ol" | "dl";
}) {
  return (
    <Tag
      className={cn("grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12", className)}
      style={{ columnGap: "var(--col-gap)", ...style }}
    >
      {children}
    </Tag>
  );
}
