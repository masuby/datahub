"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  /** Seconds. Staggers siblings that enter the viewport together. */
  delay?: number;
  className?: string;
};

/**
 * Scroll-triggered entrance.
 *
 * The server renders children fully visible, so crawlers and no-JS visitors see
 * everything. After hydration, anything below the fold is hidden and revealed
 * when it scrolls into view. Anything already in view at mount is revealed
 * immediately, so above-the-fold content never flashes.
 *
 * Reduced-motion users get no hiding at all (see globals.css).
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"ssr" | "init" | "in">("ssr");

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    // Deferred with a macrotask rather than requestAnimationFrame: rAF is paused
    // in background tabs, and a page opened in one must still set up correctly.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) {
      const r = setTimeout(() => setState("in"), 0);
      return () => clearTimeout(r);
    }

    const r = setTimeout(() => setState("init"), 0);

    const show = () => {
      setState("in");
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) show();
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    // Fallback: IntersectionObserver is not delivered while a document is
    // hidden, and can lag in some browsers. A passive scroll check guarantees
    // nothing can stay hidden once it has actually been scrolled to.
    const onScroll = () => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) show();
    };
    io.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(r);
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        state === "init" && "reveal-init",
        state === "in" && "reveal-in",
        className,
      )}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
