"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/components/system/motion-store";
import { useLiveRunning, type LiveScope } from "./HeroLive";
import { frugalDevice } from "./device";
import { useMetalLive } from "./metal-store";
import { COMET_DELAY, COMET_GLOWS, COMET_PASS, COMET_REST, cometKeyframes } from "./comet";
import styles from "./HeroComet.module.css";

/**
 * The light along the D, laid over the mark's D and under the hand.
 *
 * Server HTML: the comet's glows, invisible. The first time its part of the
 * page may move (the hero, or the footer's wordmark: `scope`, through
 * useLiveRunning), each glow gets its keyframes (comet.ts) through the
 * Web Animations API — transform and opacity only, so the compositor runs
 * them. Between passes nothing is animated at all: an element with a
 * running animation, composited or not, is restyled in every frame the
 * page draws for its canvases. The comet pauses whenever its part may not
 * move (holding still, like the mark's CSS loops), resets under reduced
 * motion, and never starts on a frugal device (Save-Data, low-end: the
 * silk's tier) or without JavaScript.
 *
 * Only a mark on screen plays: the hero has one per breakpoint and the
 * other is display:none (so is this one in forced colors and in print), and
 * on a small phone the mark's band can sit below the fold while the hero is
 * in view. An animation on an element with no box cannot be composited, and
 * one off screen would still be restyled in every canvas frame, so the comet
 * plays only while its own layer is on screen.
 */
export function HeroComet({ scope = "hero", yieldToMetal = false }: { scope?: LiveScope; yieldToMetal?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const player = useRef<CometPlayer | null>(null);
  const running = useLiveRunning(scope);
  const reduced = useReducedMotion();
  // The liquid-metal D carries its own moving light: the hero's comet rests
  // while it shows (a mark without metal boxes keeps its comet).
  const metal = useMetalLive() && yieldToMetal;
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => setShown(entries.some((e) => e.isIntersecting)));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const play = running && shown && !reduced && !metal;
    if (play && !player.current) {
      if (frugalDevice() || typeof el.animate !== "function") return;
      player.current = cometPlayer(Array.from(el.children));
    }
    if (play) player.current?.play();
    else if (reduced || metal) player.current?.reset();
    else player.current?.pause();
  }, [running, shown, reduced, metal]);

  useEffect(() => {
    const current = player;
    return () => {
      current.current?.reset();
      current.current = null;
    };
  }, []);

  return (
    <span ref={ref} aria-hidden="true" className={styles.comet}>
      {COMET_GLOWS.map(({ long, wide, core }, i) => (
        <span
          key={i}
          className={core ? styles.core : styles.glow}
          style={{ width: `${long}%`, height: `${wide}%`, left: `${-long / 2}%`, top: `${-wide / 2}%` }}
        />
      ))}
    </span>
  );
}

type CometPlayer = { play(): void; pause(): void; reset(): void };

/**
 * The comet's rhythm: wait (the D's entrance, then each rest) with nothing
 * running, then one pass of every glow together, and again. Pausing holds a
 * pass where it is, or keeps what is left of a wait.
 */
function cometPlayer(glows: Element[]): CometPlayer {
  const passes = glows.map((glow, i) => {
    const a = glow.animate(cometKeyframes(COMET_GLOWS[i]), { duration: COMET_PASS });
    a.cancel();
    return a;
  });
  let playing = false;
  let passing = false;
  let wait = COMET_DELAY;
  let wakeAt = 0;
  let timer = 0;

  const arm = () => {
    wakeAt = performance.now() + wait;
    timer = window.setTimeout(pass, wait);
  };
  const disarm = () => {
    window.clearTimeout(timer);
    timer = 0;
  };
  function pass() {
    timer = 0;
    passing = true;
    for (const a of passes) a.play();
    passes[passes.length - 1].finished.then(
      () => {
        // Finished with no fill: nothing of it is left to update.
        passing = false;
        wait = COMET_REST;
        if (playing) arm();
      },
      () => {
        /* reset: cancelled */
      },
    );
  }

  return {
    play() {
      if (playing) return;
      playing = true;
      if (passing) for (const a of passes) a.play();
      else arm();
    },
    pause() {
      if (!playing) return;
      playing = false;
      if (passing) for (const a of passes) a.pause();
      else {
        disarm();
        wait = Math.max(0, wakeAt - performance.now());
      }
    },
    reset() {
      disarm();
      for (const a of passes) a.cancel();
      playing = false;
      passing = false;
      wait = COMET_DELAY;
    },
  };
}
