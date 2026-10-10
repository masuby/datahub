/**
 * Landing on a section of a long page, exactly.
 *
 * The long pages defer painting their lower sections (content-visibility:
 * auto, sized by a 900px placeholder). A section takes its real size only
 * once it is laid out near the viewport — a few frames after a scroll brings
 * it there. Any scroll aimed by placeholder geometry therefore lands off:
 * a smooth scroll stops short as the sections it passes grow, and even an
 * instant jump (reduced motion, or a page arriving with #contact in its URL)
 * is pushed off when the sections around the target resize right after it.
 *
 * So the landing is repeated, one frame at a time, until the target stays
 * put — and abandoned the moment the visitor scrolls themselves.
 */

const STILL_FRAMES = 3;
const MAX_FRAMES = 45;

/** Instant jumps to `target`, repeated each frame until it stops moving. */
export function landOnSection(target: HTMLElement): void {
  let frames = 0;
  let still = 0;
  let last = Number.NaN;
  let raf = 0;
  const stop = () => {
    cancelAnimationFrame(raf);
    for (const type of ["wheel", "touchstart", "keydown", "pointerdown"] as const) {
      window.removeEventListener(type, stop);
    }
  };
  for (const type of ["wheel", "touchstart", "keydown", "pointerdown"] as const) {
    window.addEventListener(type, stop, { passive: true, once: true });
  }
  const land = () => {
    target.scrollIntoView({ block: "start", behavior: "instant" });
    const top = target.getBoundingClientRect().top;
    still = Math.abs(top - last) < 1 ? still + 1 : 0;
    last = top;
    if (still < STILL_FRAMES && ++frames < MAX_FRAMES) raf = requestAnimationFrame(land);
    else stop();
  };
  raf = requestAnimationFrame(land);
}

/**
 * Scrolls to a section — smoothly or instantly, as html's scroll-behavior
 * says (instant under reduced motion) — then lands on it exactly once the
 * scroll settles. Browsers without `scrollend` land after a timeout.
 */
export function scrollToSection(target: HTMLElement): void {
  target.scrollIntoView({ block: "start" });
  let done = false;
  const settle = () => {
    if (done) return;
    done = true;
    window.removeEventListener("scrollend", settle);
    clearTimeout(fallback);
    landOnSection(target);
  };
  const fallback = setTimeout(settle, 1200);
  window.addEventListener("scrollend", settle, { once: true });
}
