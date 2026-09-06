"use client";

import { useCallback, type ReactNode, type PointerEvent } from "react";
import { cn } from "@/lib/utils";

/**
 * Card with a radial highlight that follows the pointer. The position is
 * written to CSS custom properties, so the effect itself is pure CSS
 * (see .spotlight-card in globals.css) and costs nothing when idle.
 */
export function SpotlightCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const onMove = useCallback((e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    e.currentTarget.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  }, []);

  return (
    <div onPointerMove={onMove} className={cn("spotlight-card rounded-2xl", className)}>
      {children}
    </div>
  );
}
