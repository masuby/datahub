"use client";

import { setMotionPaused, useMotionPaused, useReducedMotion } from "./motion-store";
import { cn } from "@/lib/utils";

/**
 * Pause control for the only continuous motion on the site (the hero silk).
 *
 *   variant "hero"   — a text button: "Pause motion" / "Resume motion" (the
 *                      label says the state, so no aria-pressed: "Resume
 *                      motion, pressed" would contradict itself)
 *   variant "footer" — "Motion: On · Off" as two pressed-state buttons
 *
 * Hidden entirely when the OS already asks for reduced motion: there is
 * nothing to pause.
 */
export function MotionToggle({
  variant,
  labels,
  className,
}: {
  variant: "hero" | "footer";
  labels: { pause: string; resume: string; label?: string; on?: string; off?: string };
  className?: string;
}) {
  const paused = useMotionPaused();
  const reduced = useReducedMotion();
  if (reduced) return null;

  if (variant === "hero") {
    return (
      <button
        type="button"
        onClick={() => setMotionPaused(!paused)}
        className={cn("t-eyebrow min-h-11 px-1 transition-colors duration-[160ms] hover:text-fg", className)}
      >
        {paused ? labels.resume : labels.pause}
      </button>
    );
  }

  return (
    <div role="group" aria-label={labels.label} className={cn("flex items-center gap-3", className)}>
      <span className="t-eyebrow">{labels.label}</span>
      {[
        { text: labels.on ?? "On", pressed: !paused, value: false },
        { text: labels.off ?? "Off", pressed: paused, value: true },
      ].map((o, i) => (
        <span key={o.text} className="flex items-center gap-3">
          {i > 0 && (
            <span aria-hidden="true" className="text-subtle">
              ·
            </span>
          )}
          <button
            type="button"
            aria-pressed={o.pressed}
            onClick={() => setMotionPaused(o.value)}
            className={cn(
              "t-small link-thread min-h-11 transition-colors duration-[160ms]",
              o.pressed ? "text-fg" : "text-muted hover:text-fg",
            )}
            data-active={o.pressed ? "true" : undefined}
          >
            {o.text}
          </button>
        </span>
      ))}
    </div>
  );
}
