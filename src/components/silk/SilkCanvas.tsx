"use client";

import { useEffect, useEffectEvent, useRef } from "react";
import { PRESETS, SHEEN_BUCKETS, sheenBucket, silkSheen, silkY, type SilkPresetName } from "@/lib/silk";
import { THEME_TRANSITION_EVENT } from "@/components/system/ThemeToggle";

/**
 * Tier-1 silk: the same `silkY` function as the static SVG, drawn on one
 * Canvas2D so it can drift, straighten as the visitor scrolls into the page,
 * and calm under the pointer. Never WebGL. Loaded lazily (see HeroSilk), and
 * only on devices that can afford it.
 *
 * Budget (spec §4.5):
 * - 30 fps cap; nothing is drawn while paused, while the canvas itself is
 *   off-screen, in a hidden tab or during a theme View Transition (ThemeToggle
 *   announces it with THEME_TRANSITION_EVENT).
 * - Strokes are batched by sheen bucket (6) × colour third (3): at most 18
 *   stroke() calls a frame, usually 8–12, plus the decision filament. §6.1
 *   asks for 6; a single tone per bucket would flatten the navy→royal blend
 *   the static SVG draws underneath, so each bucket keeps three tones.
 * - Backing store at min(devicePixelRatio, 1.5) on fine pointers, 1 on touch,
 *   capped at 1600×1000 device pixels.
 * - Kill switch: if the first 60 drawn frames average more than 22 ms of work,
 *   the loop stops and the last frame stays. Any exception removes the canvas
 *   (the parent unmounts it) and the SVG underneath remains.
 * - Colours come from the --silk-* tokens, re-read whenever <html class>
 *   changes, so a theme switch repaints without a reload.
 *
 * `fit` mirrors how the SVG underneath maps the preset box onto the element:
 * "fill" for a non-uniformly stretched box (desktop hero, so the sink and the
 * decision filament's landing sit exactly on the mark and the index rule),
 * "slice" for preserveAspectRatio="xMidYMid slice" (mobile band).
 */

const FRAME_MS = 1000 / 30;
const SAMPLES = 96;
const MAX_BUFFER_W = 1600;
const MAX_BUFFER_H = 1000;
const KILL_FRAMES = 60;
const KILL_AVG_MS = 22;
/** Colour thirds per sheen bucket; each third is drawn in its centre tone. */
const TONES = 3;
const POINTER_R = 180;
const POINTER_EASE_MS = 300;
/** Safety net if the "transition finished" event never arrives. */
const THEME_HOLD_MAX_MS = 2000;

type Rgb = readonly [number, number, number];
type Palette = { tones: string[]; decision: string; maxAlpha: number; blend: GlobalCompositeOperation };

function hexToRgb(value: string): Rgb | null {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(value.trim());
  if (!m) return null;
  const h = m[1].length === 3 ? m[1].replace(/./g, (c) => c + c) : m[1];
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const toLinear = (c: number) => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const fromLinear = (raw: number) => {
  const v = Math.min(1, Math.max(0, raw));
  const c = v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
  return Math.round(Math.min(1, Math.max(0, c)) * 255);
};

function toOklab([r8, g8, b8]: Rgb): Rgb {
  const r = toLinear(r8);
  const g = toLinear(g8);
  const b = toLinear(b8);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function fromOklab([L, A, B]: Rgb): string {
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  const r = fromLinear(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s);
  const g = fromLinear(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s);
  const b = fromLinear(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s);
  return `rgb(${r} ${g} ${b})`;
}

/** Same mix the SVG asks the browser for: color-mix(in oklab, a, b u%). */
function readPalette(el: Element): Palette {
  const cs = getComputedStyle(el);
  const get = (name: string) => cs.getPropertyValue(name).trim();
  const aRaw = get("--silk-a");
  const bRaw = get("--silk-b");
  const a = hexToRgb(aRaw);
  const b = hexToRgb(bRaw);
  const la = a && toOklab(a);
  const lb = b && toOklab(b);
  const tones = Array.from({ length: TONES }, (_, j) => {
    const u = (j + 0.5) / TONES;
    if (la && lb) return fromOklab([la[0] + (lb[0] - la[0]) * u, la[1] + (lb[1] - la[1]) * u, la[2] + (lb[2] - la[2]) * u]);
    return (u < 0.5 ? aRaw : bRaw) || "currentColor";
  });
  const alpha = parseFloat(get("--silk-max-alpha"));
  return {
    tones,
    decision: get("--silk-decision") || bRaw || tones[TONES - 1],
    maxAlpha: Number.isFinite(alpha) ? Math.min(1, Math.max(0, alpha)) : 0.32,
    blend: get("--silk-blend") === "lighter" ? "lighter" : "source-over",
  };
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export type SilkCanvasProps = {
  preset: SilkPresetName;
  fit: "fill" | "slice";
  /** Visitor pressed "Pause motion": keep the current frame, stop the loop. */
  paused: boolean;
  className?: string;
  /** The first frame is on the canvas: safe to crossfade over the SVG. */
  onFirstFrame?: () => void;
  /** The kill switch fired: the last frame stays, nothing moves any more. */
  onStop?: () => void;
  /** Something threw: unmount the canvas, the SVG underneath remains. */
  onError?: () => void;
  /** The canvas is going away (unmount). */
  onDetach?: () => void;
};

export function SilkCanvas({ preset, fit, paused, className, onFirstFrame, onStop, onError, onDetach }: SilkCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(paused);
  const updateRef = useRef<(() => void) | null>(null);

  const firstFrame = useEffectEvent(() => onFirstFrame?.());
  const stopped = useEffectEvent(() => onStop?.());
  const failed = useEffectEvent(() => onError?.());
  const detached = useEffectEvent(() => onDetach?.());

  useEffect(() => {
    pausedRef.current = paused;
    updateRef.current?.();
  }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const p = PRESETS[preset];
    let ctx: CanvasRenderingContext2D | null = null;
    try {
      ctx = canvas.getContext("2d");
    } catch {
      ctx = null;
    }
    if (!ctx) {
      failed();
      return;
    }
    const g = ctx;
    const hero: HTMLElement = canvas.closest("section") ?? canvas.parentElement ?? canvas;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const calmAllowed = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    let palette = readPalette(canvas);
    let cssW = 1;
    let cssH = 1;
    let dpr = 1;
    let heroH = 1;

    let t = 0; // seconds of drift (advances only while running)
    let raf = 0;
    let last = 0;
    let dead = false;
    let killed = false;
    let firstDone = false;
    let measured = 0;
    let workMs = 0;

    let onscreen = true;
    let pageVisible = !document.hidden;
    let inThemeTransition = false;
    let themeTimer = 0;

    // Pointer calm: raw client position, eased local position and intensity.
    let rawX = 0;
    let rawY = 0;
    let inside = false;
    let lx = 0;
    let ly = 0;
    let calm = 0;
    let haveLocal = false;

    const groups = new Map<number, number[]>();

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      cssW = Math.max(1, r.width);
      cssH = Math.max(1, r.height);
      const base = finePointer ? Math.min(window.devicePixelRatio || 1, 1.5) : 1;
      dpr = Math.min(base, MAX_BUFFER_W / cssW, MAX_BUFFER_H / cssH);
      canvas.width = Math.max(1, Math.round(cssW * dpr));
      canvas.height = Math.max(1, Math.round(cssH * dpr));
      heroH = Math.max(1, hero.getBoundingClientRect().height);
    };

    const draw = () => {
      // Map the preset box onto the element exactly as the SVG underneath does.
      let sx: number;
      let sy: number;
      let ox = 0;
      let oy = 0;
      if (fit === "fill") {
        sx = cssW / p.W;
        sy = cssH / p.H;
      } else {
        const s = Math.max(cssW / p.W, cssH / p.H);
        sx = sy = s;
        ox = (cssW - p.W * s) / 2;
        oy = (cssH - p.H * s) / 2;
      }

      // Order k: the silk straightens into rules as the hero scrolls away.
      const kScroll = 0.85 * clamp01(-hero.getBoundingClientRect().top / heroH);

      // Pointer position in canvas CSS pixels.
      let px = 0;
      let py = 0;
      const calmOn = calmAllowed && calm > 0.002;
      if (calmOn) {
        px = lx;
        py = ly;
      }

      const trace = (i: number) => {
        for (let s = 0; s <= SAMPLES; s++) {
          const x = s / SAMPLES;
          const X = ox + x * p.W * sx;
          let y = silkY(p, i, x, t, kScroll);
          let Y = oy + y * sy;
          if (calmOn) {
            const d = Math.hypot(X - px, Y - py);
            if (d < POINTER_R) {
              const f = 1 - d / POINTER_R;
              y = silkY(p, i, x, t, Math.min(1, kScroll + 0.6 * f * f * calm));
              Y = oy + y * sy;
            }
          }
          if (s === 0) g.moveTo(X, Y);
          else g.lineTo(X, Y);
        }
      };

      g.setTransform(1, 0, 0, 1, 0, 0);
      g.clearRect(0, 0, canvas.width, canvas.height);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.globalCompositeOperation = palette.blend;
      g.lineJoin = "round";
      g.lineCap = "round";
      g.lineWidth = 1;

      // Batch filaments by (sheen bucket, colour third): one stroke() per batch.
      groups.forEach((list) => (list.length = 0));
      for (let i = 0; i < p.N; i++) {
        if (i === p.decision) continue;
        const u = p.N === 1 ? 0.5 : i / (p.N - 1);
        const bucket = Math.round(sheenBucket(silkSheen(u, t)) * (SHEEN_BUCKETS - 1));
        const tone = Math.min(TONES - 1, Math.floor(u * TONES));
        const key = bucket * TONES + tone;
        let list = groups.get(key);
        if (!list) {
          list = [];
          groups.set(key, list);
        }
        list.push(i);
      }
      groups.forEach((list, key) => {
        if (list.length === 0) return;
        const bucket = Math.floor(key / TONES) / (SHEEN_BUCKETS - 1);
        if (bucket <= 0) return;
        g.beginPath();
        for (const i of list) trace(i);
        g.globalAlpha = palette.maxAlpha * bucket;
        g.strokeStyle = palette.tones[key % TONES];
        g.stroke();
      });

      if (p.decision >= 0) {
        g.beginPath();
        trace(p.decision);
        g.globalAlpha = 0.95;
        g.strokeStyle = palette.decision;
        g.lineWidth = 1.5;
        g.stroke();
      }
      g.globalAlpha = 1;
    };

    const die = () => {
      dead = true;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      failed();
    };

    const paint = (measure: boolean) => {
      if (dead) return;
      try {
        const start = performance.now();
        draw();
        if (measure && measured < KILL_FRAMES) {
          workMs += performance.now() - start;
          measured++;
          if (measured === KILL_FRAMES && workMs / KILL_FRAMES > KILL_AVG_MS) {
            killed = true;
            update();
            stopped();
          }
        }
        if (!firstDone) {
          firstDone = true;
          firstFrame();
        }
      } catch {
        die();
      }
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (last && now - last < FRAME_MS - 2) return; // 30 fps cap
      const dt = last ? Math.min(now - last, 100) : FRAME_MS;
      last = now;
      t += dt / 1000;
      if (calmAllowed) {
        const a = 1 - Math.exp(-dt / POINTER_EASE_MS);
        calm += ((inside ? 1 : 0) - calm) * a;
        if (inside) {
          const r = canvas.getBoundingClientRect();
          const tx = rawX - r.left;
          const ty = rawY - r.top;
          if (!haveLocal) {
            lx = tx;
            ly = ty;
            haveLocal = true;
          } else {
            lx += (tx - lx) * a;
            ly += (ty - ly) * a;
          }
        }
      }
      paint(true);
    };

    const shouldRun = () =>
      !dead && !killed && !pausedRef.current && onscreen && pageVisible && !inThemeTransition;

    function update() {
      if (shouldRun()) {
        if (!raf) {
          last = 0;
          raf = requestAnimationFrame(frame);
        }
      } else if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    }
    updateRef.current = update;

    // Size, then the first frame (t = 0: identical to the SVG it fades over).
    try {
      resize();
    } catch {
      die();
      return;
    }
    paint(false);

    const ro = new ResizeObserver(() => {
      try {
        resize();
      } catch {
        die();
        return;
      }
      paint(false); // resizing clears the bitmap: repaint even when paused
    });
    ro.observe(canvas);
    ro.observe(hero);

    const io = new IntersectionObserver((entries) => {
      onscreen = entries.some((e) => e.isIntersecting);
      update();
    });
    // The canvas itself, not the section: on phones the band sits below the
    // text and can be off-screen while the hero is still in view.
    io.observe(canvas);

    const onVisibility = () => {
      pageVisible = !document.hidden;
      update();
    };
    document.addEventListener("visibilitychange", onVisibility);

    // Theme switch: repaint with the new tokens as soon as <html class>
    // changes, so the View Transition captures the new colours. Classes that
    // leave the tokens alone (the transition's own marker) cause no repaint.
    let paletteKey = JSON.stringify(palette);
    const mo = new MutationObserver(() => {
      const next = readPalette(canvas);
      const key = JSON.stringify(next);
      if (key === paletteKey) return;
      palette = next;
      paletteKey = key;
      paint(false);
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    // Hold still for exactly as long as the View Transition runs.
    const onThemeTransition = (e: Event) => {
      inThemeTransition = (e as CustomEvent<boolean>).detail === true;
      window.clearTimeout(themeTimer);
      if (inThemeTransition) {
        themeTimer = window.setTimeout(() => {
          inThemeTransition = false;
          update();
        }, THEME_HOLD_MAX_MS);
      }
      update();
    };
    window.addEventListener(THEME_TRANSITION_EVENT, onThemeTransition);

    const onMove = (e: PointerEvent) => {
      rawX = e.clientX;
      rawY = e.clientY;
      inside = true;
    };
    const onLeave = () => {
      inside = false;
      haveLocal = false;
    };
    if (calmAllowed) {
      hero.addEventListener("pointermove", onMove, { passive: true });
      hero.addEventListener("pointerleave", onLeave, { passive: true });
    }

    update();

    return () => {
      updateRef.current = null;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      dead = true;
      window.clearTimeout(themeTimer);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener(THEME_TRANSITION_EVENT, onThemeTransition);
      if (calmAllowed) {
        hero.removeEventListener("pointermove", onMove);
        hero.removeEventListener("pointerleave", onLeave);
      }
      detached();
    };
  }, [preset, fit]);

  return <canvas ref={canvasRef} className={className ?? "block size-full"} />;
}

export default SilkCanvas;
