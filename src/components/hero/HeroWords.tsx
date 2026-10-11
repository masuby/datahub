"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useHeroRunning } from "./HeroLive";
import { lowEndDevice, saveDataOn } from "./device";
import type { Writer, WriterTier } from "./word-writer";
import styles from "./HeroWords.module.css";

/**
 * The headline's second line: one word that writes itself, then moves on.
 *
 * Server HTML: every word, stacked in one grid cell, only the first visible
 * — it is the text visitors see first (painted with the page), what they keep
 * without JavaScript or with motion off, and the hidden copies reserve the
 * longest word's width so nothing ever shifts. The H1 around it carries the
 * constant accessible name; all of this is aria-hidden.
 *
 * Client: the first time the word may move — the hero may (HeroLive) and
 * the word's own line is on screen — after an idle moment and once the
 * display font is in, the writer (word-writer.ts, its own lazy chunk with
 * the glyph outlines) takes over on a canvas laid over the slot. It pauses
 * whenever the word may not move, and the slot shows the current word as
 * text again: off screen (on a phone the line scrolls away long before the
 * rest of the hero), and in forced-colors mode, where the canvas is hidden —
 * also when High Contrast is turned on mid-visit. Never under Save-Data (the
 * chunk is not even fetched). Touch devices and low-end ones (spec §4.4:
 * deviceMemory or cores < 4) get the writer's lite tier: 30 fps and half the
 * sparks; a desktop that turns out too slow for the full tier steps down to
 * it (the writer's kill switch).
 */
export function HeroWords({ words }: { words: readonly string[] }) {
  const slotRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const writerRef = useRef<Writer | null>(null);
  const running = useHeroRunning();
  const forced = useSyncExternalStore(subscribeForced, forcedColors, () => false);
  const [onScreen, setOnScreen] = useState(false);
  const [armed, setArmed] = useState(false);
  const [ready, setReady] = useState(false);
  const live = running && onScreen && !forced;

  // The word's own line, not the whole hero: on a phone the line scrolls
  // away while the mark band below it is still in view.
  useEffect(() => {
    const slot = slotRef.current;
    if (!slot) return;
    const io = new IntersectionObserver((entries) => setOnScreen(entries.some((e) => e.isIntersecting)));
    io.observe(slot);
    return () => io.disconnect();
  }, []);

  // Arm once, the first time the word may move, when the browser is idle:
  // the first paint (the LCP is server text) must not compete with this.
  useEffect(() => {
    if (!live || armed) return;
    if (saveDataOn()) return;
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
  }, [live, armed]);

  // Build the writer once the canvas exists and the font has loaded.
  useEffect(() => {
    if (!armed) return;
    const slot = slotRef.current;
    const canvas = canvasRef.current;
    if (!slot || !canvas) return;
    let cancelled = false;
    let writer: Writer | null = null;
    (async () => {
      if (!(await displayFontLoaded(slot))) return;
      const { createWriter } = await import("./word-writer");
      if (cancelled) return;
      const tier: WriterTier =
        window.matchMedia("(pointer: fine)").matches && !lowEndDevice() ? "full" : "lite";
      writer = createWriter({ slot, canvas, words, tier });
      if (!writer) return;
      writerRef.current = writer;
      setReady(true);
    })().catch(() => {
      /* no writer: the text word simply stays */
    });
    // Theme switch: the writer re-reads its colour tokens.
    const mo = new MutationObserver(() => writerRef.current?.repaint());
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => {
      cancelled = true;
      mo.disconnect();
      writer?.destroy();
      writerRef.current = null;
    };
  }, [armed, words]);

  useEffect(() => {
    if (ready) writerRef.current?.setRunning(live);
  }, [ready, live]);

  return (
    <span ref={slotRef} className={styles.slot}>
      {words.map((word, i) => (
        <span key={word} data-i={i} className={styles.word}>
          {word}
        </span>
      ))}
      {armed && <canvas ref={canvasRef} aria-hidden="true" className={styles.canvas} />}
    </span>
  );
}

const FORCED = "(forced-colors: active)";

function forcedColors(): boolean {
  try {
    return window.matchMedia(FORCED).matches;
  } catch {
    return false;
  }
}

function subscribeForced(onChange: () => void) {
  try {
    const mq = window.matchMedia(FORCED);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  } catch {
    return () => {};
  }
}

/**
 * The canvas draws the real Outfit outlines where the browser laid out the
 * text; if the web font never arrived, the text is in a fallback face and
 * the two would not match, so the writer stays off.
 */
async function displayFontLoaded(el: HTMLElement): Promise<boolean> {
  try {
    const cs = getComputedStyle(el);
    const unquote = (s: string) => s.trim().replace(/^["']|["']$/g, "");
    const family = unquote(cs.fontFamily.split(",")[0] ?? "");
    if (!family) return false;
    await document.fonts.load(`${cs.fontWeight} ${cs.fontSize} "${family}"`);
    let loaded = false;
    document.fonts.forEach((face) => {
      if (unquote(face.family) === family && face.status === "loaded") loaded = true;
    });
    return loaded;
  } catch {
    return false;
  }
}
