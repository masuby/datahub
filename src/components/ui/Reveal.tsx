import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

/**
 * Entrance animation wrapper.
 *
 * Uses a pure-CSS fade-up animation with `animation-fill-mode: both`, so the
 * element always resolves to the visible state — it can never get stuck hidden,
 * and it respects prefers-reduced-motion (see globals.css). No JS required.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  return (
    <div
      className={cn("reveal", className)}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
