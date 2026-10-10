"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { MotionToggle } from "@/components/system/MotionToggle";
import { useMotionPaused, useReducedMotion } from "@/components/system/motion-store";
import type { SilkPresetName } from "@/lib/silk";

/**
 * The hero's client islands, kept tiny:
 *
 *   HeroSilk  — decides whether the Canvas2D silk may run on this device and,
 *               only then, loads it (next/dynamic, ssr:false) when the browser
 *               is idle. The static SVG stays underneath until the first frame
 *               is drawn, then the canvas crossfades in over it.
 *   HeroPause — the WCAG 2.2.2 pause control, rendered only while a canvas is
 *               actually animating.
 *   HeroProbe — plays the probe dot along the D spine once after hydration.
 */

const SilkCanvas = dynamic(() => import("@/components/silk/SilkCanvas"), { ssr: false });

const REDUCED = "(prefers-reduced-motion: reduce)";
/** High Contrast hides every .silk-layer (globals.css): nothing to draw. */
const FORCED = "(forced-colors: active)";

/* ── "a silk canvas is running" — shared by HeroSilk and HeroPause ─────── */
let silkRunning = false;
const runningListeners = new Set<() => void>();
function setSilkRunning(value: boolean) {
  if (silkRunning === value) return;
  silkRunning = value;
  runningListeners.forEach((l) => l());
}
function subscribeRunning(l: () => void) {
  runningListeners.add(l);
  return () => {
    runningListeners.delete(l);
  };
}
const useSilkRunning = () => useSyncExternalStore(subscribeRunning, () => silkRunning, () => false);

/**
 * Capability gates (spec §4.4): the canvas never mounts under reduced motion,
 * Save-Data, deviceMemory < 4 or hardwareConcurrency < 4 (where reported),
 * nor in forced-colors mode, where the silk layer is hidden.
 */
function deviceCanAffordSilk(): boolean {
  try {
    if (window.matchMedia(REDUCED).matches) return false;
    if (window.matchMedia(FORCED).matches) return false;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
    if (nav.connection?.saveData === true) return false;
    if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 4) return false;
    if (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency > 0 && nav.hardwareConcurrency < 4)
      return false;
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
  className,
}: {
  preset: SilkPresetName;
  fit: "fill" | "slice";
  /** Only one canvas exists at a time: each instance owns one breakpoint. */
  media: string;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const paused = useMotionPaused();
  const matches = useMedia(media);
  const forced = useMedia(FORCED);
  const [armed, setArmed] = useState(false);
  const [failed, setFailed] = useState(false);
  const [drawn, setDrawn] = useState(false);
  const [stopped, setStopped] = useState(false);

  // Wait for an idle moment (2 s at most) after hydration: the H1 is the LCP
  // and nothing here may compete with it.
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

  useEffect(() => {
    if (!live || stopped) return;
    setSilkRunning(true);
    return () => setSilkRunning(false);
  }, [live, stopped]);

  return (
    <div aria-hidden="true" className={className} data-silk-live={live ? "true" : "false"}>
      {mount && (
        <SilkCanvas
          preset={preset}
          fit={fit}
          paused={paused}
          onFirstFrame={() => setDrawn(true)}
          onStop={() => setStopped(true)}
          onError={() => setFailed(true)}
          onDetach={() => {
            setDrawn(false);
            setStopped(false);
          }}
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
  const running = useSilkRunning();
  if (!running) return null;
  return <MotionToggle variant="hero" labels={labels} className={className} />;
}

/**
 * The probe dot: travels the D spine once (SMIL animateMotion, begun from
 * here 300 ms after mount), then a ring plays once at the spine's end and the
 * dot fades. Never with reduced motion or paused motion, never on the copy of
 * the mark hidden at this breakpoint; without JS the dot never shows.
 */
export function HeroProbe({ markId }: { markId: string }) {
  useEffect(() => {
    try {
      if (window.matchMedia(REDUCED).matches) return;
      if (localStorage.getItem("dh-motion") === "off") return;
    } catch {
      /* storage blocked: motion stays allowed */
    }
    const root = document.getElementById(markId);
    if (!root || root.getClientRects().length === 0) return;
    const dot = root.querySelector<SVGCircleElement>("[data-probe]");
    const ring = root.querySelector<SVGCircleElement>("[data-ring]");
    const motion = dot?.querySelector("animateMotion") as SVGAnimationElement | null | undefined;
    if (!dot || !motion || typeof motion.beginElement !== "function") return;

    let ended = false;
    let endTimer = 0;
    const finish = () => {
      if (ended) return;
      ended = true;
      if (ring) ring.style.animation = "dh-ring 700ms var(--ease-silk) both";
      dot.style.transition = "opacity 400ms var(--ease-silk)";
      dot.style.opacity = "0";
    };
    const start = window.setTimeout(() => {
      dot.style.opacity = "1";
      motion.beginElement();
      // endEvent is the signal; the timer covers engines that never fire it.
      endTimer = window.setTimeout(finish, 1400);
    }, 300);
    motion.addEventListener("endEvent", finish);
    return () => {
      window.clearTimeout(start);
      window.clearTimeout(endTimer);
      motion.removeEventListener("endEvent", finish);
    };
  }, [markId]);
  return null;
}
