"use client";

import { useSyncExternalStore } from "react";

/**
 * One tiny store for "may continuous motion run?" (WCAG 2.2.2 pause control).
 *
 * Off when the visitor asked for reduced motion, when they pressed "Pause
 * motion" (persisted as localStorage["dh-motion"] = "off"), or on the server.
 * The hero's pause button and the footer toggle share it, so they never
 * disagree. Storage access is wrapped: the site works with storage blocked.
 */
const KEY = "dh-motion";
const EVENT = "dh-motion-change";
const REDUCED = "(prefers-reduced-motion: reduce)";

function readPaused(): boolean {
  try {
    return localStorage.getItem(KEY) === "off";
  } catch {
    return false;
  }
}

export function setMotionPaused(paused: boolean) {
  try {
    if (paused) localStorage.setItem(KEY, "off");
    else localStorage.removeItem(KEY);
  } catch {
    /* storage blocked: the choice lasts for this page view only */
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(REDUCED);
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  mq.addEventListener("change", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
    mq.removeEventListener("change", onChange);
  };
}

/** True when the visitor pressed pause (independent of reduced motion). */
export function useMotionPaused(): boolean {
  return useSyncExternalStore(subscribe, readPaused, () => false);
}

/** True when the OS asks for reduced motion. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(REDUCED).matches,
    () => true,
  );
}

/** Continuous motion may run: not reduced, not paused, and not on the server. */
export function useMotionAllowed(): boolean {
  const paused = useMotionPaused();
  const reduced = useReducedMotion();
  return !paused && !reduced;
}
