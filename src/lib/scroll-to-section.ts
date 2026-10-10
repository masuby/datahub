/**
 * Scrolls to a section and lands on it exactly.
 *
 * Smooth or instant follows html's scroll-behavior (instant under reduced
 * motion). The long pages defer painting their lower sections
 * (content-visibility: auto, sized by a 900px placeholder), so a smooth
 * scroll aims at placeholder heights and stops short as the sections it
 * passes render at their real size — the hero's "Start a conversation" landed
 * a thousand pixels above the form. Once the scroll settles, one instant
 * correction lands exactly. Browsers without `scrollend` get the correction
 * after a timeout instead.
 */
export function scrollToSection(target: HTMLElement): void {
  target.scrollIntoView({ block: "start" });
  let done = false;
  const settle = () => {
    if (done) return;
    done = true;
    window.removeEventListener("scrollend", settle);
    clearTimeout(fallback);
    target.scrollIntoView({ block: "start", behavior: "instant" });
  };
  const fallback = setTimeout(settle, 1200);
  window.addEventListener("scrollend", settle, { once: true });
}
