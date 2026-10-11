"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useMotionAllowed } from "@/components/system/motion-store";
import { frugalDevice } from "./device";

/**
 * "May this part of the page move right now?" — one answer for everything
 * alive in it. Two parts of the site are alive: the hero, and the footer's
 * wordmark (iteration-3 §A), which reuses the hero's mark and writer.
 *
 * Yes only while continuous motion is allowed (no reduced motion, no "Pause
 * motion"), the part is on screen and the tab is visible. LiveGate works it
 * out for one part and publishes it twice:
 *
 *   - as a data attribute on the part's element — `data-hero-motion="run"`
 *     on the hero section, `data-footer-motion="run"` on the footer's stage —
 *     which the mark's CSS loops (the waving hand, the D's breathing glow)
 *     and the footer's twinkling dots need to play; without it they hold
 *     still, and before the first run (and without JavaScript) that is their
 *     first frame. Never on a frugal device (Save-Data, low-end: where the
 *     silk canvas never mounts either);
 *   - through `useLiveRunning(scope)`, for the word that writes itself and
 *     the light along the D (which keeps the same device gate itself).
 *
 * The silk canvas keeps its own gates (spec §4.5); it already stops on the
 * same conditions.
 */

export type LiveScope = "hero" | "footer";

/** The data attribute each part carries while it runs (as a dataset key). */
const ATTRIBUTE: Record<LiveScope, "heroMotion" | "footerMotion"> = {
  hero: "heroMotion",
  footer: "footerMotion",
};

const running: Record<LiveScope, boolean> = { hero: false, footer: false };
const listeners: Record<LiveScope, Set<() => void>> = { hero: new Set(), footer: new Set() };

function setRunning(scope: LiveScope, value: boolean) {
  if (running[scope] === value) return;
  running[scope] = value;
  listeners[scope].forEach((l) => l());
}

/** One stable subscribe function per part, so React never resubscribes. */
const subscribers = Object.fromEntries(
  (Object.keys(running) as LiveScope[]).map((scope) => [
    scope,
    (l: () => void) => {
      listeners[scope].add(l);
      return () => {
        listeners[scope].delete(l);
      };
    },
  ]),
) as Record<LiveScope, (l: () => void) => () => void>;

export const useLiveRunning = (scope: LiveScope) =>
  useSyncExternalStore(subscribers[scope], () => running[scope], () => false);

export const useHeroRunning = () => useLiveRunning("hero");

/** Watches the element `targetId` and publishes whether its part may move. */
export function LiveGate({ scope, targetId }: { scope: LiveScope; targetId: string }) {
  const allowed = useMotionAllowed();

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;
    const key = ATTRIBUTE[scope];
    const frugal = frugalDevice();
    let onscreen = false;
    let visible = !document.hidden;
    const sync = () => {
      const run = allowed && onscreen && visible;
      if (run && !frugal) target.dataset[key] = "run";
      else delete target.dataset[key];
      setRunning(scope, run);
    };
    const io = new IntersectionObserver((entries) => {
      onscreen = entries.some((e) => e.isIntersecting);
      sync();
    });
    io.observe(target);
    const onVisibility = () => {
      visible = !document.hidden;
      sync();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      delete target.dataset[key];
      setRunning(scope, false);
    };
  }, [scope, targetId, allowed]);

  return null;
}

/** The hero's gate: its whole section. */
export function HeroLive({ sectionId }: { sectionId: string }) {
  return <LiveGate scope="hero" targetId={sectionId} />;
}
