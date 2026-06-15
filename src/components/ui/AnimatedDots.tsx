"use client";

import { useEffect, useRef } from "react";

/**
 * Animated dot field for the hero backdrop.
 *
 * Renders a grid of dots on a canvas; each dot pulses in size and opacity driven
 * by overlapping sine waves that ripple out from a slowly drifting origin. The
 * accent colour shifts between cyan and emerald with the pulse, giving a soft,
 * flowing "breathing" effect.
 *
 * Respects prefers-reduced-motion (renders a single static frame instead).
 */
export function AnimatedDots({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const SPACING = 26;
    const cyan = [34, 211, 238] as const;
    const emerald = [52, 211, 153] as const;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;

    // Sync the drawing buffer to the canvas's rendered (CSS) size. Called every
    // frame; only touches the canvas when the size actually changes. Using the
    // canvas's own client box (set by the `w-full h-full` classes) avoids any
    // dependency on layout being ready at mount time.
    const syncSize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w === 0 || h === 0) return false;
      const nextDpr = Math.min(window.devicePixelRatio || 1, 2);
      if (w === width && h === height && nextDpr === dpr) return true;
      width = w;
      height = h;
      dpr = nextDpr;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return true;
    };

    const draw = (time: number) => {
      if (!syncSize()) return;
      ctx.clearRect(0, 0, width, height);
      const t = time * 0.001;

      // Two drifting ripple origins for a richer, less mechanical motion.
      const o1x = width * (0.5 + 0.35 * Math.sin(t * 0.18));
      const o1y = height * (0.45 + 0.3 * Math.cos(t * 0.14));
      const o2x = width * (0.5 + 0.4 * Math.cos(t * 0.11));
      const o2y = height * (0.55 + 0.35 * Math.sin(t * 0.2));

      const cols = Math.ceil(width / SPACING) + 1;
      const rows = Math.ceil(height / SPACING) + 1;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * SPACING;
          const y = j * SPACING;

          const d1 = Math.hypot(x - o1x, y - o1y);
          const d2 = Math.hypot(x - o2x, y - o2y);

          const wave =
            Math.sin(d1 * 0.018 - t * 1.6) * 0.6 +
            Math.sin(d2 * 0.022 - t * 1.1) * 0.4;
          const pulse = (wave + 1) / 2; // 0..1

          const radius = 0.5 + pulse * pulse * 2.1;
          const alpha = 0.04 + pulse * pulse * 0.32;

          const r = Math.round(cyan[0] + (emerald[0] - cyan[0]) * pulse);
          const g = Math.round(cyan[1] + (emerald[1] - cyan[1]) * pulse);
          const b = Math.round(cyan[2] + (emerald[2] - cyan[2]) * pulse);

          ctx.beginPath();
          ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    let running = false;
    let inView = false;

    const loop = (time: number) => {
      draw(time);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    // Animate only while the canvas is on-screen AND the tab is visible — so
    // several instances (hero, contact, footer) don't all run off-screen.
    const sync = () => (inView && !document.hidden ? start() : stop());

    if (reduced) {
      // Draw a static frame once layout settles.
      draw(0);
      requestAnimationFrame(() => draw(0));
    }

    const io = new IntersectionObserver(
      (entries) => {
        inView = entries[0]?.isIntersecting ?? false;
        sync();
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVisibility = () => sync();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
