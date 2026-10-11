"use client";

import { useSyncExternalStore } from "react";

/**
 * "Is the liquid-metal mark showing?" The metal already carries moving light
 * across the D, so the comet (HeroComet) rests while it does; if the metal
 * goes away (lost GPU context, a breakpoint without it) the comet returns.
 */
let live = false;
const listeners = new Set<() => void>();

export function setMetalLive(value: boolean) {
  if (live === value) return;
  live = value;
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export const useMetalLive = () => useSyncExternalStore(subscribe, () => live, () => false);
