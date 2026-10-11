"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useReducedMotion } from "@/components/system/motion-store";
import { useHeroRunning } from "./HeroLive";
import { setMetalLive } from "./metal-store";
import { reducedTransparency, shadersAllowed } from "./shader-gate";
import type { HeroShaders as ShadersApi } from "./hero-shaders";

/**
 * The hero's WebGL layer, as an island that renders nothing: the liquid-metal
 * mark over the static one (HeroMark's [data-metal-host] boxes) and the mesh
 * gradient behind the stage (Hero's [data-mesh-host] boxes). The server HTML
 * — and every visitor without JavaScript, WebGL 2 or a capable device —
 * keeps the static SVG mark and the CSS wash.
 *
 * Waits until the mark's entrance is over and the browser is idle, then
 * imports the shader chunk (hero-shaders.ts: Paper Shaders + the two metal
 * maps), so none of it competes with the LCP text. Only the breakpoint on
 * screen gets shaders (desktop stage or phone band); crossing it rebuilds
 * them for the other one.
 *
 * Motion: the shaders loop only while useHeroRunning() says so (motion
 * allowed, hero on screen, tab visible); "Pause motion" holds the current
 * frame. Under reduced motion they draw one frame, keep it as an image and
 * release their GPU contexts (re-baked if the theme changes).
 * Readers who ask for reduced transparency get no mesh (it is a translucent
 * wash behind the text); the metal is opaque and stays.
 *
 * If anything fails — the chunk, a map, a shader, a lost GPU context — the
 * island gives up for this page view and the static art returns.
 */

const WIDE = "(min-width: 1024px)";
/** The D's sweep (100 + 1100 ms) and the hand's rise (500 + 700 ms) are over. */
const ENTRANCE_MS = 1800;

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

function subscribeTheme(onChange: () => void) {
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => mo.disconnect();
}
const themeNow = () => (document.documentElement.classList.contains("dark") ? "dark" : "light");

export function HeroShaders({ sectionId }: { sectionId: string }) {
  const running = useHeroRunning();
  const reduced = useReducedMotion();
  const theme = useSyncExternalStore(subscribeTheme, themeNow, () => "light");
  // Under reduced motion the shaders leave one baked frame and no GPU
  // context, so a theme switch has to bake a new one; otherwise they
  // recolour in place and the theme is not a reason to rebuild.
  const stillKey = reduced ? `still-${theme}` : "live";
  const wide = useMedia(WIDE);
  const [armed, setArmed] = useState(false);
  const [failed, setFailed] = useState(false);
  const api = useRef<ShadersApi | null>(null);
  const runningRef = useRef(running);

  useEffect(() => {
    if (!shadersAllowed()) return;
    let cancelled = false;
    let idle = 0;
    const go = () => {
      if (!cancelled) setArmed(true);
    };
    const timer = window.setTimeout(
      () => {
        if (typeof window.requestIdleCallback === "function") idle = window.requestIdleCallback(go, { timeout: 2000 });
        else go();
      },
      Math.max(0, ENTRANCE_MS - performance.now()),
    );
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      if (idle) window.cancelIdleCallback(idle);
    };
  }, []);

  useEffect(() => {
    if (!armed || failed) return;
    const section = document.getElementById(sectionId);
    if (!section) return;
    const mark = section.querySelector<HTMLElement>(wide ? "#hero-mark-lg" : "#hero-mark-sm");
    const mesh = reducedTransparency() ? null : section.querySelector<HTMLElement>(`[data-mesh-host="${wide ? "lg" : "sm"}"]`);
    let cancelled = false;
    let made: ShadersApi | null = null;
    const clear = () => {
      if (mark) delete mark.dataset.metal;
      delete section.dataset.mesh;
      setMetalLive(false);
    };
    const fail = () => {
      // A superseded build (breakpoint change, re-bake) must not clear the
      // attributes its successor has set; its own cleanup already ran.
      if (cancelled) return;
      clear();
      setFailed(true);
    };

    import("./hero-shaders")
      .then(({ createHeroShaders }) =>
        createHeroShaders({
          section,
          mark,
          mesh,
          fine: window.matchMedia("(pointer: fine)").matches,
          still: stillKey !== "live",
          onReady: (live) => {
            if (cancelled) return;
            if (live.metal && mark) {
              mark.dataset.metal = "live";
              setMetalLive(true);
            }
            if (live.mesh) section.dataset.mesh = "live";
          },
          onDead: fail,
        }),
      )
      .then((made_) => {
        if (cancelled) {
          made_.destroy();
          return;
        }
        made = made_;
        api.current = made_;
        made_.run(runningRef.current);
      })
      .catch(fail);

    return () => {
      cancelled = true;
      made?.destroy();
      api.current = null;
      clear();
    };
  }, [armed, failed, wide, stillKey, sectionId]);

  useEffect(() => {
    runningRef.current = running;
    api.current?.run(running);
  }, [running]);

  return null;
}
