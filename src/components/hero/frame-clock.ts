/**
 * One frame clock for the hero's canvases: the silk (SilkCanvas) and the
 * word that writes itself (word-writer.ts).
 *
 * Each loop gives the shortest interval between its frames (1000 / 30 for
 * 30 fps). The clock runs every loop on one grid of slots, counted from the
 * page's time origin, so loops at the same rate draw in the same frame —
 * the silk and the writer share one main-thread frame instead of taking
 * alternate ones — and a 30 fps grid falls on every other slot of a 60 fps
 * one. Between frames it leaves the main thread alone: when no loop is due
 * at the next vsync it asks for no frame, and sleeps on a timer until just
 * before the one that is due. (A requestAnimationFrame per vsync that only
 * decides to skip still costs a whole rendering update.)
 *
 * A loop that throws leaves the clock; the others keep their frames.
 */

/**
 * A loop's frame: `now` is the frame's timestamp (its vsync: animation time),
 * `began` when the frame's callbacks started to run (performance.now()), for
 * timing the frame's own work without the wait before it.
 */
export type FrameTick = (now: number, began: number) => void;

type Loop = { every: number; slot: number; tick: FrameTick };

const loops = new Set<Loop>();
/** A frame this close (ms) before a slot boundary counts as the next slot: vsync jitter. */
const SLACK = 4;
let raf = 0;
let timer = 0;
let lastFrame = 0;
/** The display's frame interval (ms), learnt from consecutive frames. */
let vsync = 1000 / 60;
/** Counts every change to the set of loops: see frameGeneration(). */
let generation = 0;

/**
 * Changes whenever a loop joins or leaves the clock. The kill switches time
 * whole frames, which hold every loop's drawing, not just their own (the
 * silk's frames cost more beside the word writer than without it): a window
 * of timings is a fair verdict only while this stays the same.
 */
export function frameGeneration(): number {
  return generation;
}

function frame(now: number) {
  const began = performance.now();
  raf = 0;
  const gap = now - lastFrame;
  if (lastFrame && gap > 4 && gap < vsync * 1.5) vsync += (gap - vsync) * 0.25;
  lastFrame = now;
  for (const loop of loops) {
    const slot = Math.floor((now + SLACK) / loop.every);
    if (slot === loop.slot) continue;
    loop.slot = slot;
    try {
      loop.tick(now, began);
    } catch {
      // One loop's bug must not stop the clock for the others.
      loops.delete(loop);
      generation++;
    }
  }
  plan(now);
}

/** Ask for the next frame that has a loop due, and none before it. */
function plan(now: number) {
  if (raf || timer || !loops.size) return;
  let due = Infinity;
  for (const loop of loops) due = Math.min(due, (loop.slot + 1) * loop.every - SLACK);
  const ahead = Math.ceil((due - now) / vsync);
  if (ahead <= 1) {
    raf = requestAnimationFrame(frame);
    return;
  }
  // Sleep through the frames in between; ask half a frame before the due one.
  const wake = now + (ahead - 0.5) * vsync;
  timer = window.setTimeout(() => {
    timer = 0;
    raf = requestAnimationFrame(frame);
  }, Math.max(0, wake - performance.now()));
}

/**
 * Calls `tick` at most once per `every` ms, in step with the clock's other
 * loops. Returns the function that stops it.
 */
export function onFrames(every: number, tick: FrameTick): () => void {
  // Its first frame is the next slot after the last frame drawn (not that
  // frame again, when a loop restarts itself from inside its own tick).
  const loop: Loop = { every, slot: lastFrame ? Math.floor((lastFrame + SLACK) / every) : -1, tick };
  loops.add(loop);
  generation++;
  // A new loop draws at the next frame, not after a sleep planned without it.
  if (timer) {
    window.clearTimeout(timer);
    timer = 0;
  }
  if (!raf) raf = requestAnimationFrame(frame);
  return () => {
    if (!loops.delete(loop)) return;
    generation++;
    if (loops.size) return;
    if (raf) cancelAnimationFrame(raf);
    if (timer) window.clearTimeout(timer);
    raf = 0;
    timer = 0;
  };
}
