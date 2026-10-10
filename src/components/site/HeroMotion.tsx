"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { MotionToggle } from "@/components/system/MotionToggle";
import { useMotionPaused, useReducedMotion } from "@/components/system/motion-store";
import { lowEndDevice, saveDataOn } from "@/components/hero/device";
import type { SilkPresetName } from "@/lib/silk";

/**
 * The hero's client islands, kept tiny:
 *
 *   HeroSilk  — decides whether the Canvas2D silk may run on this device and,
 *               only then, loads it (next/dynamic, ssr:false) when the browser
 *               is idle. The static SVG stays underneath until the first frame
 *               is drawn, then the canvas crossfades in over it.
 *   HeroPause — the WCAG 2.2.2 pause control. The hero always has continuous
 *               motion now (the word that writes itself, the waving hand, the
 *               light along the D), so it shows whenever motion is not
 *               already reduced by the system.
 *
 * The rest of the hero's life is in src/components/hero/ (HeroLive,
 * HeroWords) and in the mark's own CSS.
 */

const SilkCanvas = dynamic(() => import("@/components/silk/SilkCanvas"), { ssr: false });

const REDUCED = "(prefers-reduced-motion: reduce)";
/** High Contrast hides every .silk-layer (globals.css): nothing to draw. */
const FORCED = "(forced-colors: active)";

/**
 * Capability gates (spec §4.4): the canvas never mounts under reduced motion,
 * Save-Data, deviceMemory < 4 or hardwareConcurrency < 4 (where reported),
 * nor in forced-colors mode, where the silk layer is hidden.
 */
function deviceCanAffordSilk(): boolean {
  try {
    if (window.matchMedia(REDUCED).matches) return false;
    if (window.matchMedia(FORCED).matches) return false;
    if (saveDataOn() || lowEndDevice()) return false;
    return typeof HTMLCanvasElement !== "undefined";
  } catch {
    return false;
  }
}

function useMedia(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export function HeroSilk({
  preset,
  fit,
  media,
  lights = false,
  className,
}: {
  preset: SilkPresetName;
  fit: "fill" | "slice";
  /** Only one canvas exists at a time: each instance owns one breakpoint. */
  media: string;
  /** Points of light along the filaments into the hand (desktop). */
  lights?: boolean;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const paused = useMotionPaused();
  const matches = useMedia(media);
  const forced = useMedia(FORCED);
  const [armed, setArmed] = useState(false);
  const [failed, setFailed] = useState(false);
  const [drawn, setDrawn] = useState(false);

  // Wait for an idle moment (2 s at most) after hydration: the LCP is the
  // hero's server text and nothing here may compete with it.
  useEffect(() => {
    if (!deviceCanAffordSilk()) return;
    let cancelled = false;
    const go = () => {
      if (!cancelled) setArmed(true);
    };
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(go, { timeout: 2000 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(id);
      };
    }
    const id = window.setTimeout(go, 1200);
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, []);

  const mount = armed && matches && !reduced && !forced && !failed;
  const live = mount && drawn;

  return (
    <div aria-hidden="true" className={className} data-silk-live={live ? "true" : "false"}>
      {mount && (
        <SilkCanvas
          preset={preset}
          fit={fit}
          paused={paused}
          lights={lights}
          onFirstFrame={() => setDrawn(true)}
          onError={() => setFailed(true)}
          onDetach={() => setDrawn(false)}
        />
      )}
    </div>
  );
}

export function HeroPause({
  labels,
  className,
}: {
  labels: { pause: string; resume: string };
  className?: string;
}) {
  return <MotionToggle variant="hero" labels={labels} className={className} />;
}
