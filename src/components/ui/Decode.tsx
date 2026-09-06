"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Rotates through words with a character-scramble "decode" — the way a terminal
 * or a data feed resolves into a value. Glyphs come from a numeric/operator set
 * so the noise itself reads as data rather than random letters.
 *
 * Accessibility: the animated span is aria-hidden; screen readers get a static
 * sentence listing every word. Under prefers-reduced-motion the words still
 * rotate, but without the scramble.
 */

const GLYPHS = "0123456789<>/=+-_#%$&{}[]";

type Props = {
  words: string[];
  /** Static text for screen readers and crawlers — the H1 as it should index. */
  srText: string;
  /** ms each word stays resolved. */
  hold?: number;
  className?: string;
};

export function Decode({ words, srText, hold = 2600, className }: Props) {
  const [text, setText] = useState(words[0]);
  const [index, setIndex] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const target = words[index];

    if (reduced) {
      // Deferred to a frame: React flags synchronous setState inside an effect.
      const show = setTimeout(() => setText(target), 0);
      const t = setTimeout(() => setIndex((i) => (i + 1) % words.length), hold);
      return () => {
        clearTimeout(show);
        clearTimeout(t);
      };
    }

    // Resolve from left to right: each character locks in after ~4 frames of
    // noise, so a 12-character word settles in roughly 50 frames.
    const start = performance.now();
    const perChar = 55; // ms
    const tick = (now: number) => {
      const elapsed = now - start;
      const settled = Math.floor(elapsed / perChar);
      let out = "";
      for (let i = 0; i < target.length; i++) {
        const ch = target[i];
        if (ch === " " || i < settled) out += ch;
        else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setText(out);
      if (settled < target.length) {
        raf.current = requestAnimationFrame(tick);
      }
    };
    raf.current = requestAnimationFrame(tick);

    const t = setTimeout(
      () => setIndex((i) => (i + 1) % words.length),
      hold + target.length * perChar,
    );
    return () => {
      cancelAnimationFrame(raf.current);
      clearTimeout(t);
    };
  }, [index, words, hold]);

  return (
    <>
      <span className="sr-only">{srText}</span>
      <span aria-hidden="true" className={className}>
        {text}
      </span>
    </>
  );
}
