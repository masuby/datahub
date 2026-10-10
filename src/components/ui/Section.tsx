import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A page section: landmark with its heading as accessible name, the shared
 * vertical rhythm (--section-y), and optionally the full-bleed ink surface
 * (dark tokens in either theme — the dashboards band and the footer).
 *
 * No content-visibility: every section is a link target (#contact, #team…),
 * and sections standing in at a placeholder height until painted made every
 * jump to them — smooth, instant, from another page, on reload — land off.
 */
export function Section({
  id,
  labelledBy,
  ink = false,
  className,
  children,
}: {
  id: string;
  labelledBy: string;
  ink?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn("relative", ink && "surface-ink", className)}
      style={{ paddingBlock: "var(--section-y)" }}
    >
      {children}
    </section>
  );
}
