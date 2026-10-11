"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type LiquidGlassComponent from "liquid-glass-react";
import { frugalDevice } from "@/components/hero/device";
import { useLiveRunning } from "@/components/hero/HeroLive";
import { useMotionAllowed } from "@/components/system/motion-store";
import styles from "./Glass.module.css";

/**
 * The refracting layer of a glass button (Glass.module.css explains the
 * tiers). Rendered inside the element that is the button — an <a>, a
 * next/link or a <button> with the `glass` classes — so the link stays a
 * real link, with its own label, focus ring and keyboard behaviour; this is
 * only its surface (aria-hidden, pointer-events: none, z-index -1).
 *
 * At rest every button is the CSS glass (server HTML, all browsers). The
 * liquid layer (liquid-glass-react: the backdrop bent through an SVG
 * displacement filter) wakes on intent — a fine pointer near or over the
 * button, or keyboard focus — and goes back to rest ~1 s after. It holds
 * still while awake: no lean toward the pointer, no rim light following it.
 * It never wakes beside motion: not while a live part of the page (the
 * hero, the footer's wordmark: HeroLive's store, which follows every page
 * change) is running, nor while the page scrolls; and while it is awake the
 * other buttons' metal holds still.
 *
 * Why (measured at 4x CPU, home page, Chromium, see the report): the layer
 * re-filters its backdrop in every frame in which it or anything behind it
 * changes. Always on (five surfaces), the page fell from ~58 to ~16 fps.
 * One awake surface, still: -13..-19% fps with nothing moving behind it,
 * -23..-36% beside the animating hero. Leaning toward the pointer (the
 * library's own, or the same as a CSS transform): 28-36 fps even with
 * nothing moving behind it. Iteration 5, 1440x900, real GPU, no throttling:
 * the WhatsApp button awake on /services fell from 60 to ~28 fps with the
 * header button's metal turning and to ~29 over the running footer (both
 * held: 57-60); a wheel scroll under the awake header button, 46-55 fps
 * with 4-38 frames over 25 ms (asleep: 48-55 fps, 2-3).
 *
 * Only in Chromium (the one engine whose `filter: url(#svg)` sees the
 * backdrop pixels), on a device whose main pointer is fine (a mouse or a
 * trackpad; keyboard focus wakes it there too), that is not low-end or
 * saving data, without reduced transparency or forced colours. Touch
 * screens keep the CSS glass and never fetch the library. Where it can
 * wake, the library is imported once the browser is idle (its own chunk,
 * none of it on the first load), so the first hover is instant; it renders
 * once per wake and is given fixed pointer props, so it never listens for
 * the mouse itself. The swap is two DOM writes in one frame and the host's
 * size never changes (no layout shift). Nothing loops: off screen or in a
 * hidden tab there are no events, so nothing runs.
 *
 * With `metal` (the primary button) it also renders the liquid-metal ring
 * and the sweeping sheen (Glass.module.css), in the server HTML, still. They
 * move — CSS animations of a transform, nothing repainted — only while the
 * host carries [data-metal="run"], set here: motion allowed (the OS and the
 * site's pause), not Save-Data or a low-end device, the tab showing, the
 * button on screen, and no other button's liquid layer awake.
 */

type LiquidGlass = typeof LiquidGlassComponent;
type Tier = "pending" | "live" | "flat" | "css";

/**
 * Fixed pointer props for the library: {x: 0, y: 0} reads as "no pointer"
 * (scale 1, no lean), and passing both stops it listening for the mouse.
 */
const NO_POINTER = { x: 0, y: 0 };

const REDUCED_TRANSPARENCY = "(prefers-reduced-transparency: reduce)";
const FORCED = "(forced-colors: active)";
const FINE = "(hover: hover) and (pointer: fine)";
/** In a zone, the layer wakes when the pointer comes this close to the button's edge. */
const ACTIVATION = 220;
/** How long the layer stays alive after the pointer or focus has left. */
const LINGER_MS = 1000;
/** How long after the last scroll event the layer may wake again. */
const SCROLL_REST_MS = 1000;

/**
 * The hosts whose liquid layer is showing. Every other primary button's
 * metal holds still meanwhile: a ring turning anywhere on the page made the
 * awake layer re-filter in every frame (see above). Its own ring keeps
 * turning: that cost nothing measurable (header button awake: 59.9 fps
 * turning, 60.1 held).
 */
const awakeHosts = new Set<HTMLElement>();
const awakeListeners = new Set<() => void>();
function setAwake(host: HTMLElement, on: boolean) {
  if (on === awakeHosts.has(host)) return;
  if (on) awakeHosts.add(host);
  else awakeHosts.delete(host);
  awakeListeners.forEach((l) => l());
}
function otherAwake(host: HTMLElement): boolean {
  for (const h of awakeHosts) if (h !== host) return true;
  return false;
}

/** One import for every glass on the page; a failed import leaves the CSS glass. */
let loader: Promise<LiquidGlass | null> | null = null;
function loadLiquidGlass(): Promise<LiquidGlass | null> {
  loader ??= import("liquid-glass-react")
    .then((m) => m.default)
    .catch(() => {
      loader = null;
      return null;
    });
  return loader;
}

/**
 * Chromium (Chrome, Edge, Opera, Samsung Internet, Android WebView) is the
 * only engine whose `filter: url(#svg)` sees the backdrop-filtered pixels,
 * which is what bends the light; Safari and Firefox keep the CSS glass. The
 * test is User-Agent Client Hints, which only Chromium ships — iOS browsers
 * (all WebKit) fall back too, as they should.
 */
function isChromium(): boolean {
  const uad = (navigator as Navigator & { userAgentData?: { brands?: { brand: string }[] } }).userAgentData;
  return Boolean(uad?.brands?.some((b) => b.brand === "Chromium"));
}

/**
 * "live" only where the layer can wake. The fine-pointer test belongs here,
 * before the import: phones and tablets (a coarse main pointer) otherwise
 * fetched the 34 KB library chunk on every first visit for a layer a touch
 * can never wake.
 */
function decideTier(): Tier {
  try {
    if (frugalDevice()) return "flat";
    if (!isChromium()) return "css";
    if (!CSS.supports("backdrop-filter", "blur(1px)")) return "css";
    if (window.matchMedia(REDUCED_TRANSPARENCY).matches || window.matchMedia(FORCED).matches) return "css";
    if (!window.matchMedia(FINE).matches) return "css";
    return "live";
  } catch {
    return "css";
  }
}

/** Per shape: a pill carries a label; a circle carries a glyph. */
const TUNE = {
  pill: { displacementScale: 70, blurAmount: 0.04, saturation: 170, aberrationIntensity: 2 },
  circle: { displacementScale: 44, blurAmount: 0.04, saturation: 170, aberrationIntensity: 1.2 },
} as const;

export function GlassSurface({
  shape = "pill",
  wake = "self",
  metal = false,
}: {
  shape?: keyof typeof TUNE;
  /** The liquid-metal ring and sheen of the primary button (glassClasses.royal). */
  metal?: boolean;
  /**
   * What wakes the layer: "zone" — the pointer within 220px of the button
   * inside the nearest [data-glass-zone] ancestor (the hero, the closing
   * band); "self" — the pointer over the button, or over the link it is a
   * part of (the WhatsApp circle and label). Keyboard focus always does.
   */
  wake?: "zone" | "self";
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [tier, setTier] = useState<Tier>("pending");
  const [Glass, setGlass] = useState<LiquidGlass | null>(null);
  const [size, setSize] = useState<{ w: number; h: number; ramp: number } | null>(null);
  const [wanted, setWanted] = useState(false);
  const [swapped, setSwapped] = useState(false);
  const motion = useMotionAllowed();
  // Live parts of the page in motion (each false unless on screen, motion
  // allowed and the tab showing). A store, not a DOM query: the WhatsApp
  // button lives in the layout and outlasts every page, and a query made
  // once kept watching the first page's hero (or none) after a client-side
  // navigation, so it woke over the running hero on the way back home.
  const heroRunning = useLiveRunning("hero");
  const footerRunning = useLiveRunning("footer");
  const quiet = heroRunning || footerRunning;
  const quietRef = useRef(quiet);
  const recheck = useRef<(() => void) | null>(null);

  // 1. Which tier, kept current if the visitor changes a system setting (or
  // docks a tablet: the main pointer turns fine).
  useEffect(() => {
    const mqs = [REDUCED_TRANSPARENCY, FORCED, FINE].map((q) => window.matchMedia(q));
    const decide = () => setTier(decideTier());
    const id = requestAnimationFrame(decide);
    mqs.forEach((m) => m.addEventListener("change", decide));
    return () => {
      cancelAnimationFrame(id);
      mqs.forEach((m) => m.removeEventListener("change", decide));
    };
  }, []);

  // Save-Data / low-end: the host's CSS glass drops its backdrop blur.
  useEffect(() => {
    const host = ref.current?.parentElement;
    if (!host || tier !== "flat") return;
    host.dataset.glass = "flat";
    return () => {
      delete host.dataset.glass;
    };
  }, [tier]);

  // The press follows the site's pause too, not only the OS setting (CSS).
  useEffect(() => {
    const host = ref.current?.parentElement;
    if (!host || motion) return;
    host.setAttribute("data-motion", "off");
    return () => {
      host.removeAttribute("data-motion");
    };
  }, [motion]);

  // The metal turns while motion is allowed on a capable device, in a
  // showing tab, with the button on screen (the header's: always; the
  // hero's: until it scrolls away) and no other button's liquid layer awake
  // (awakeHosts). Frugal devices keep a still ring.
  useEffect(() => {
    const host = ref.current?.parentElement;
    if (!host || !metal || !motion || tier === "pending" || tier === "flat") return;
    let onScreen = typeof IntersectionObserver === "undefined";
    const apply = () => {
      if (onScreen && !document.hidden && !otherAwake(host)) host.setAttribute("data-metal", "run");
      else host.removeAttribute("data-metal");
    };
    const io = onScreen
      ? null
      : new IntersectionObserver((entries) => {
          onScreen = entries[entries.length - 1].isIntersecting;
          apply();
        });
    io?.observe(host);
    apply();
    document.addEventListener("visibilitychange", apply);
    awakeListeners.add(apply);
    return () => {
      io?.disconnect();
      document.removeEventListener("visibilitychange", apply);
      awakeListeners.delete(apply);
      host.removeAttribute("data-metal");
    };
  }, [metal, motion, tier]);

  // 2. Live tier (desktop Chromium, see decideTier): import the library when
  // the browser is idle, so the first hover or focus finds it ready. No
  // other tier ever requests the chunk.
  useEffect(() => {
    if (tier !== "live" || Glass) return;
    let cancelled = false;
    const load = () => {
      loadLiquidGlass().then((c) => {
        if (!cancelled && c) setGlass(() => c);
      });
    };
    let idle = 0;
    let timer = 0;
    if (typeof window.requestIdleCallback === "function") idle = window.requestIdleCallback(load, { timeout: 4000 });
    else timer = window.setTimeout(load, 2000);
    return () => {
      cancelled = true;
      if (idle) window.cancelIdleCallback(idle);
      window.clearTimeout(timer);
    };
  }, [tier, Glass]);

  // 3. Intent: a fine pointer near or over the button, or keyboard focus,
  // wakes the layer; it lingers a moment after both have gone. Quiet (a live
  // part running: quietRef, kept by the effect below) or a scroll puts it to
  // sleep at once.
  useEffect(() => {
    const host = ref.current?.parentElement;
    if (!host || tier !== "live") return;
    const link = host.closest<HTMLElement>("a, button") ?? host;
    const zone = wake === "zone" ? (host.closest<HTMLElement>("[data-glass-zone]") ?? link) : link;
    let near = false;
    let focused = false;
    let scrolling = false;
    let lastScroll = 0;
    let timer = 0;
    let scrollTimer = 0;
    const update = () => {
      window.clearTimeout(timer);
      const hush = quietRef.current || scrolling;
      if ((near || focused) && !hush) setWanted(true);
      else timer = window.setTimeout(() => setWanted(false), hush ? 0 : LINGER_MS);
    };
    recheck.current = update;
    // Scrolling moves the backdrop in every frame, so the layer sleeps until
    // ~1 s after the last scroll event (any scroller: captured). Where the
    // pointer was is stale by then — the button moved, or the page under a
    // resting pointer did — so only the next pointermove wakes it; keyboard
    // focus is still there and wakes it at once.
    const settle = () => {
      const idle = performance.now() - lastScroll;
      if (idle < SCROLL_REST_MS) {
        scrollTimer = window.setTimeout(settle, SCROLL_REST_MS - idle);
        return;
      }
      scrolling = false;
      update();
    };
    const onScroll = () => {
      near = false;
      lastScroll = performance.now();
      if (scrolling) return;
      scrolling = true;
      update();
      scrollTimer = window.setTimeout(settle, SCROLL_REST_MS);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = host.getBoundingClientRect();
      const dx = Math.max(0, r.left - e.clientX, e.clientX - r.right);
      const dy = Math.max(0, r.top - e.clientY, e.clientY - r.bottom);
      const isNear = zone === link || dx * dx + dy * dy <= ACTIVATION * ACTIVATION;
      if (isNear !== near) {
        near = isNear;
        update();
      }
    };
    const onLeave = () => {
      if (!near) return;
      near = false;
      update();
    };
    const onFocusIn = () => {
      focused = link.matches(":focus-visible");
      update();
    };
    const onFocusOut = () => {
      focused = false;
      update();
    };
    zone.addEventListener("pointermove", onMove, { passive: true });
    zone.addEventListener("pointerleave", onLeave);
    link.addEventListener("focusin", onFocusIn);
    link.addEventListener("focusout", onFocusOut);
    window.addEventListener("scroll", onScroll, { capture: true, passive: true });
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(scrollTimer);
      recheck.current = null;
      zone.removeEventListener("pointermove", onMove);
      zone.removeEventListener("pointerleave", onLeave);
      link.removeEventListener("focusin", onFocusIn);
      link.removeEventListener("focusout", onFocusOut);
      window.removeEventListener("scroll", onScroll, { capture: true });
    };
  }, [tier, wake]);

  // Quiet follows the live parts as they start and stop — on whichever page
  // is showing — without tearing down step 3 (a focused button stays known).
  useEffect(() => {
    quietRef.current = quiet;
    recheck.current?.();
  }, [quiet]);

  // 4. The host's size, while wanted (layout size: a pressed button's scale is not counted).
  // The tint thins out toward the ends so the refraction shows there, but
  // never under the label: the ramp stops 6px inside the inline padding.
  const armed = tier === "live" && wanted;
  useEffect(() => {
    const host = ref.current?.parentElement;
    if (!host || !armed) return;
    const measure = () =>
      setSize((s) => {
        const w = host.offsetWidth;
        const h = host.offsetHeight;
        const ramp = Math.max(6, Math.min(24, parseFloat(getComputedStyle(host).paddingLeft) - 6 || 6));
        return s && s.w === w && s.h === h && s.ramp === ramp ? s : { w, h, ramp };
      });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(host);
    return () => ro.disconnect();
  }, [armed]);

  const live = armed && Glass !== null && size !== null && size.w > 0 && size.h > 0;

  // 5. Two frames after the layer renders, the host drops its CSS glass and
  // the layer shows — both DOM writes in the same frame, so no frame is
  // painted with neither (React's own data-on follows on its next render).
  // Going back to rest, the host takes its CSS glass back in the same commit
  // that removes the layer (a layout effect's cleanup runs before paint).
  // From the first render of the layer to its removal, the other buttons'
  // metal holds still (awakeHosts).
  useLayoutEffect(() => {
    const layer = ref.current;
    const host = layer?.parentElement;
    if (!layer || !host || !live) return;
    setAwake(host, true);
    let r2 = 0;
    const r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => {
        layer.setAttribute("data-on", "");
        host.dataset.glass = "live";
        setSwapped(true);
      });
    });
    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
      layer.removeAttribute("data-on");
      if (host.dataset.glass === "live") delete host.dataset.glass;
      setSwapped(false);
      setAwake(host, false);
    };
  }, [live]);

  const tune = TUNE[shape];

  return (
    <>
      <span ref={ref} aria-hidden="true" className={styles.live} data-on={live && swapped ? "" : undefined}>
        {live ? (
          <Glass
            // The library sizes its rim and filter once per window resize; a
            // new host size (font swap, wrapping) gets a fresh instance.
            key={`${size.w}x${size.h}`}
            displacementScale={tune.displacementScale}
            blurAmount={tune.blurAmount}
            saturation={tune.saturation}
            aberrationIntensity={tune.aberrationIntensity}
            elasticity={0}
            cornerRadius={999}
            padding="0"
            mode="standard"
            globalMousePos={NO_POINTER}
            mouseOffset={NO_POINTER}
            style={{ position: "absolute", top: "50%", left: "50%" }}
          >
            <span
              className={styles.tint}
              style={{ width: size.w, height: size.h, ["--g-ramp" as string]: `${size.ramp}px` }}
            />
          </Glass>
        ) : null}
      </span>
      {/* After the live layer: the sheen (z-index -1, like the layer) paints
          over it, the ring (z-index 1) over the label's edge zone. */}
      {metal ? (
        <>
          <span aria-hidden="true" className={styles.sheen} />
          <span aria-hidden="true" className={styles.metal} />
        </>
      ) : null}
    </>
  );
}
