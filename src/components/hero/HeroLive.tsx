"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useMotionAllowed } from "@/components/system/motion-store";
import { frugalDevice } from "./device";

/**
 * "May the hero move right now?" — one answer for everything alive in it.
 *
 * Yes only while continuous motion is allowed (no reduced motion, no "Pause
 * motion"), the hero is on screen and the tab is visible. HeroLive works it
 * out and publishes it twice:
 *
 *   - as `data-hero-motion="run"` on the hero section, which the mark's CSS
 *     loops (the waving hand, the D's breathing glow) need to play —
 *     without it they hold still; before the first run (and without
 *     JavaScript) that is their first frame. Never on a frugal device
 *     (Save-Data, low-end: where the silk canvas never mounts either);
 *   - through `useHeroRunning()`, for the word that writes itself and the
 *     light along the D (which keeps the same device gate itself).
 *
 * The silk canvas keeps its own gates (spec §4.5); it already stops on the
 * same conditions.
 */

let running = false;
const listeners = new Set<() => void>();

function setRunning(value: boolean) {
  if (running === value) return;
  running = value;
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export const useHeroRunning = () => useSyncExternalStore(subscribe, () => running, () => false);

export function HeroLive({ sectionId }: { sectionId: string }) {
  const allowed = useMotionAllowed();

  useEffect(() => {
    const section = document.getElementById(sectionId);
    if (!section) return;
    const frugal = frugalDevice();
    let onscreen = false;
    let visible = !document.hidden;
    const sync = () => {
      const run = allowed && onscreen && visible;
      if (run && !frugal) section.dataset.heroMotion = "run";
      else delete section.dataset.heroMotion;
      setRunning(run);
    };
    const io = new IntersectionObserver((entries) => {
      onscreen = entries.some((e) => e.isIntersecting);
      sync();
    });
    io.observe(section);
    const onVisibility = () => {
      visible = !document.hidden;
      sync();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      delete section.dataset.heroMotion;
      setRunning(false);
    };
  }, [sectionId, allowed]);

  return null;
}
