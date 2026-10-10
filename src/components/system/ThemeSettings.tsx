"use client";

import { useId } from "react";
import { centreOf, setTheme, useThemePref, useThemeSync, type ThemePref } from "./ThemeToggle";
import { useMotionAllowed } from "./motion-store";
import { cn } from "@/lib/utils";

/**
 * Footer and mobile-menu theme choice: System · Light · Dark as native radios
 * (arrow keys work, no custom listbox). "System" removes the stored key and
 * follows prefers-color-scheme live. Shares the store with ThemeToggle.
 *
 * The ring and dot are the only rounded shapes here, as the spec allows for
 * radio controls; the input itself sits invisibly over the ring so touch,
 * pointer and assistive technology all hit the real control.
 */
export function ThemeSettings({
  labels,
  className,
}: {
  labels: { legend: string; system: string; light: string; dark: string };
  className?: string;
}) {
  useThemeSync();
  const pref = useThemePref();
  const motionAllowed = useMotionAllowed();
  const id = useId();
  const options: { value: ThemePref; label: string }[] = [
    { value: "system", label: labels.system },
    { value: "light", label: labels.light },
    { value: "dark", label: labels.dark },
  ];

  return (
    <div
      role="radiogroup"
      aria-labelledby={`${id}-legend`}
      className={cn("flex flex-wrap items-center gap-x-5 gap-y-1", className)}
    >
      <span id={`${id}-legend`} className="t-eyebrow mr-1">
        {labels.legend}
      </span>
      {options.map((o) => (
        <label
          key={o.value}
          className="t-small relative inline-flex min-h-11 cursor-pointer items-center gap-2 text-muted transition-colors duration-[160ms] hover:text-fg has-checked:text-fg"
        >
          <input
            type="radio"
            name={`${id}-theme`}
            value={o.value}
            checked={pref === o.value}
            onChange={(e) =>
              setTheme(o.value, { animate: motionAllowed, origin: centreOf(e.currentTarget) })
            }
            className="peer absolute left-0 top-1/2 m-0 size-4 -translate-y-1/2 cursor-pointer opacity-0"
          />
          <span
            aria-hidden="true"
            className="grid size-4 shrink-0 place-items-center rounded-full border border-rule-input transition-colors duration-[160ms] peer-checked:border-accent peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-focus peer-checked:[&>span]:scale-100"
          >
            <span className="size-2 scale-0 rounded-full bg-accent transition-transform duration-[160ms]" />
          </span>
          {o.label}
        </label>
      ))}
    </div>
  );
}
