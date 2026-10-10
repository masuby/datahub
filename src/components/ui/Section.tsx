import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A page section: landmark with its heading as accessible name, the shared
 * vertical rhythm (--section-y), and optionally the full-bleed ink surface
 * (dark tokens in either theme — the dashboards band and the footer).
 *
 * `deferPaint` adds content-visibility so off-screen sections cost nothing
 * until scrolled near; not for the hero, header or the dashboards band.
 */
export function Section({
  id,
  labelledBy,
  ink = false,
  deferPaint = false,
  className,
  children,
}: {
  id: string;
  labelledBy: string;
  ink?: boolean;
  deferPaint?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn("relative", ink && "surface-ink", className)}
      style={{
        paddingBlock: "var(--section-y)",
        ...(deferPaint ? { contentVisibility: "auto", containIntrinsicSize: "auto 900px" } : null),
      }}
    >
      {children}
    </section>
  );
}
