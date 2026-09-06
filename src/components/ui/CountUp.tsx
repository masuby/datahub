"use client";

import { useEffect, useState } from "react";

/**
 * Counts from 0 to `to` with an ease-out curve. Used only for the decorative
 * KPI mock in the hero card — never for a real claim about the business.
 */
export function CountUp({
  to,
  duration = 1400,
  prefix = "",
  suffix = "",
  delay = 0,
}: {
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  delay?: number;
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const r = setTimeout(() => setValue(to), 0);
      return () => clearTimeout(r);
    }
    let raf = 0;
    let start = 0;
    const timer = setTimeout(() => {
      const step = (now: number) => {
        if (!start) start = now;
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        setValue(Math.round(to * eased));
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [to, duration, delay]);

  return (
    <span className="tnum">
      {prefix}
      {value}
      {suffix}
    </span>
  );
}
