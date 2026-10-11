"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY } from "./ThemeScript";
import { useMotionAllowed } from "./motion-store";
import { glassClasses } from "@/components/ui/glass/glass-classes";
import { cn } from "@/lib/utils";

/*
 * Theme store, shared by the header ThemeToggle and the footer/menu
 * ThemeSettings so the two can never disagree.
 *
 * localStorage["theme"] is "light" | "dark"; absent means "follow the system"
 * (the same contract ThemeScript reads before first paint). The resolved theme
 * lives on <html> as BOTH `.dark` and `.light` so the no-JS media-query
 * fallback in globals.css can never fight an explicit choice.
 */

export type ThemePref = "system" | "light" | "dark";
type Resolved = "light" | "dark";

const CHANGE_EVENT = "dh-theme-change";
/** Fired with `detail: true | false` around the View Transition, so the hero silk canvas can pause. */
export const THEME_TRANSITION_EVENT = "dh-theme-transition";
const VT_CLASS = "dh-theme-vt";
const VT_STYLE_ID = "dh-theme-vt-style";
const DARK_MQ = "(prefers-color-scheme: dark)";
const REVEAL_MS = 450;

function readPref(): ThemePref {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    return v === "light" || v === "dark" ? v : "system";
  } catch {
    return "system";
  }
}

function readResolved(): Resolved {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function resolve(pref: ThemePref): Resolved {
  if (pref !== "system") return pref;
  return window.matchMedia(DARK_MQ).matches ? "dark" : "light";
}

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(DARK_MQ);
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  mq.addEventListener("change", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
    mq.removeEventListener("change", onChange);
  };
}

/** The stored preference ("system" on the server and when storage is blocked). */
export function useThemePref(): ThemePref {
  return useSyncExternalStore(subscribe, readPref, () => "system" as ThemePref);
}

/** The theme actually on <html> right now. */
export function useResolvedTheme(): Resolved {
  return useSyncExternalStore(subscribe, readResolved, () => "light" as Resolved);
}

/**
 * Keeps the browser chrome colour in step. The layout ships two
 * `<meta name="theme-color" media=…>` tags for first paint; an explicit
 * choice points both at the current --bg token, "system" restores them.
 */
function syncThemeColor(pref: ThemePref) {
  const bg = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim();
  document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((meta) => {
    if (meta.dataset.dhDefault === undefined) meta.dataset.dhDefault = meta.content;
    meta.content = pref === "system" || !bg ? meta.dataset.dhDefault : bg;
  });
}

function paint(theme: Resolved, pref: ThemePref) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.classList.toggle("light", theme === "light");
  root.style.colorScheme = theme;
  syncThemeColor(pref);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/**
 * The circular reveal replaces the browser's default cross-fade for this one
 * transition only (scoped by a class on <html>, removed when it finishes), so
 * the language-switch cross-fade in globals.css is untouched.
 */
function ensureRevealStyle() {
  if (document.getElementById(VT_STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = VT_STYLE_ID;
  style.textContent =
    `html.${VT_CLASS}::view-transition-old(root),html.${VT_CLASS}::view-transition-new(root)` +
    `{animation:none;mix-blend-mode:normal}`;
  document.head.appendChild(style);
}

type ViewTransitionLike = { ready: Promise<void>; finished: Promise<void> };

/**
 * Applies a theme preference. With `animate` (motion allowed) and View
 * Transitions available, the new theme is revealed as a circle growing from
 * `origin` (the control's centre) over 450ms; otherwise it switches instantly.
 */
export function setTheme(pref: ThemePref, opts: { animate?: boolean; origin?: { x: number; y: number } } = {}) {
  try {
    if (pref === "system") localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, pref);
  } catch {
    /* storage blocked: the choice lasts for this page view only */
  }

  const next = resolve(pref);
  const root = document.documentElement;
  const doc = document as Document & {
    startViewTransition?: (update: () => void) => ViewTransitionLike;
  };
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (next === readResolved() || !opts.animate || reduced || typeof doc.startViewTransition !== "function") {
    paint(next, pref);
    return;
  }

  ensureRevealStyle();
  root.classList.add(VT_CLASS);
  window.dispatchEvent(new CustomEvent(THEME_TRANSITION_EVENT, { detail: true }));

  const done = () => {
    root.classList.remove(VT_CLASS);
    window.dispatchEvent(new CustomEvent(THEME_TRANSITION_EVENT, { detail: false }));
  };

  let vt: ViewTransitionLike;
  try {
    vt = doc.startViewTransition(() => paint(next, pref));
  } catch {
    done();
    paint(next, pref);
    return;
  }

  const w = window.innerWidth;
  const h = window.innerHeight;
  const x = opts.origin?.x ?? w / 2;
  const y = opts.origin?.y ?? 0;
  const radius = Math.hypot(Math.max(x, w - x), Math.max(y, h - y));
  const easing = getComputedStyle(root).getPropertyValue("--ease-silk").trim() || "ease-out";

  vt.ready
    .then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: REVEAL_MS, easing, pseudoElement: "::view-transition-new(root)" },
      );
    })
    .catch(() => {});
  vt.finished.then(done, done);
}

/**
 * Brings meta theme-color in line with the stored choice on mount, follows the
 * OS theme live while the preference is "system", and applies a choice made
 * in another tab. Idempotent: every theme control may call it.
 */
export function useThemeSync() {
  useEffect(() => {
    // A stored choice that differs from the OS (applied by ThemeScript before
    // first paint) must also reach the browser chrome on load, not only on
    // the next toggle. Idempotent, so several mounted controls are harmless.
    syncThemeColor(readPref());
    const mq = window.matchMedia(DARK_MQ);
    const follow = () => {
      const pref = readPref();
      const want = resolve(pref);
      if (want !== readResolved()) paint(want, pref);
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === null || e.key === THEME_STORAGE_KEY) follow();
    };
    mq.addEventListener("change", follow);
    window.addEventListener("storage", onStorage);
    return () => {
      mq.removeEventListener("change", follow);
      window.removeEventListener("storage", onStorage);
    };
  }, []);
}

/** Centre of an element in viewport coordinates: where the reveal starts. */
export function centreOf(el: Element | null): { x: number; y: number } | undefined {
  if (!el) return undefined;
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

/**
 * Header theme button: a 20px half-filled circle in currentColor inside a
 * 44×44 hit area, muted at rest; hover or keyboard focus raises a 36px
 * clear-glass circle behind it, like the nav's pills (iteration 5b §K). It
 * flips light ↔ dark (an explicit choice) and turns 180°; its accessible
 * name says what pressing it will do.
 */
export function ThemeToggle({
  labels,
  className,
}: {
  labels: { toDark: string; toLight: string };
  className?: string;
}) {
  useThemeSync();
  const theme = useResolvedTheme();
  const motionAllowed = useMotionAllowed();
  const ref = useRef<HTMLButtonElement>(null);
  const dark = theme === "dark";

  return (
    <button
      ref={ref}
      type="button"
      aria-label={dark ? labels.toLight : labels.toDark}
      onClick={() => {
        // Choosing the theme the device itself uses means "follow the device"
        // again: with the footer's preferences gone, this toggle is the only
        // way back to System, so it never pins a choice the OS already makes.
        const next = dark ? "light" : "dark";
        const os = window.matchMedia(DARK_MQ).matches ? "dark" : "light";
        setTheme(next === os ? "system" : next, { animate: motionAllowed, origin: centreOf(ref.current) });
      }}
      className={cn(glassClasses.navRound, "inline-grid size-11 shrink-0 place-items-center", className)}
    >
      <svg
        viewBox="0 0 20 20"
        aria-hidden="true"
        focusable="false"
        className="size-5 transition-transform duration-[280ms] ease-[var(--ease-silk)]"
        style={{ transform: dark ? "rotate(180deg)" : "rotate(0deg)" }}
      >
        <circle cx="10" cy="10" r="8.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 1.75a8.25 8.25 0 0 0 0 16.5Z" fill="currentColor" />
      </svg>
    </button>
  );
}
