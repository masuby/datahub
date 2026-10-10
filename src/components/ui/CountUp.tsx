"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts up to a value once, when it first becomes visible (or whenever
 * `playKey` changes — the dashboards replay on tab change). Used only inside
 * labelled sample figures, never for a claim about the business.
 *
 * Screen readers get the final value immediately (sr-only); the moving digits
 * are aria-hidden. Reduced motion shows the final value with no count.
 */
export function CountUp({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  format,
  duration = 800,
  playKey,
  className,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Client parents only: full formatter (e.g. TZS with Kiswahili word order). */
  format?: (v: number) => string;
  duration?: number;
  playKey?: string | number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);
  const render = (v: number) => (format ? format(v) : `${prefix}${v.toFixed(decimals)}${suffix}`);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const t = setTimeout(() => setShown(value), 0);
      return () => clearTimeout(t);
    }
    let raf = 0;
    let started = false;
    const run = () => {
      if (started) return;
      started = true;
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        setShown(value * eased);
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };
    // Start from zero only once the number is actually on screen; a hidden
    // tab never delivers rAF, so the final value is what stays rendered.
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        setShown(0);
        run();
        io.disconnect();
      }
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration, playKey]);

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{render(value)}</span>
      <span aria-hidden="true" className="tnum">
        {render(shown)}
      </span>
    </span>
  );
}
