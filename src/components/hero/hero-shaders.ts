import {
  ShaderFitOptions,
  ShaderMount,
  liquidMetalFragmentShader,
  meshGradientFragmentShader,
  type ShaderMountUniforms,
} from "@paper-design/shaders";
import dMap from "@/assets/metal/metal-d.webp";
import handMap from "@/assets/metal/metal-hand.webp";
import { THEME_TRANSITION_EVENT } from "@/components/system/ThemeToggle";
import { frameGeneration, onFrames } from "./frame-clock";

/**
 * The hero's two WebGL shaders, from Paper Shaders (@paper-design/shaders,
 * Apache-2.0, pinned 0.0.81): the mark in liquid metal (LiquidMetal: the D
 * and the hand on two canvases, so the hand keeps its CSS wave) and a slow
 * mesh gradient behind the stage (MeshGradient). Loaded only by HeroShaders,
 * after the page is idle and only on devices that pass shader-gate.ts.
 *
 * The library's own loop (one requestAnimationFrame per vsync per canvas)
 * is never started: every mount is created at speed 0 and drawn from the
 * hero's frame clock (frame-clock.ts) with setFrame(), at 30 fps, in the
 * same frames as the silk and the word writer. Nothing is drawn while
 * motion is paused, while a canvas is off screen, in a hidden tab or during
 * the theme View Transition; then each canvas keeps its last frame. Under
 * reduced motion one frame is drawn, kept as an <img> (data: URL, allowed by
 * img-src) and every WebGL context is released.
 *
 * The library adds one <style data-paper-shader> to <head> (its canvas
 * layout; allowed by style-src 'unsafe-inline') and no script. Everything it
 * loads here is first-party: the two maps, from /_next/static/media.
 *
 * Budget:
 * - Metal: backing store at min(devicePixelRatio, 1.5) on fine pointers,
 *   min(dpr, 2) on touch (the phone mark is 168 px). The two maps are the
 *   shapes' distance fields, made at build time (scripts/make-metal-maps.mjs),
 *   ~38 KB of WebP, fetched only here.
 * - Mesh: smooth by nature, so drawn at a quarter of its CSS pixels (half
 *   each way, at most 160 000 pixels) and stretched by the compositor.
 * - Kill switch: the silk's method (median frame time of the first 60 drawn frames
 *   over 12 ms here, 22 ms for the silk; the whole frame timed): they stop on their current
 *   frame for good and the section gets data-shaders="stopped".
 * - A lost WebGL context, a failed compile or any exception tears everything
 *   down and `onDead` restores the static mark (the SVG never left the DOM).
 */

const FRAME_MS = 1000 / 30;
const METAL_SPEED = 0.6;
const MESH_SPEED = 0.25;
/** First frame of the still (reduced motion) and the start of the loop: picked
 * by eye, both themes (no lens of light across the palm). */
const METAL_FRAME0 = 4000;
const MESH_FRAME0 = 0;
const MESH_MAX_PIXELS = 160_000;
/**
 * The silk's kill switch (spec §4.5) — the median of 60 whole frames — with
 * a tighter budget: 12 ms, not 22. Measured at 4× CPU throttling (≈ a
 * mid-range phone), the silk and the writer stop themselves, the frames
 * left to the shaders alone took 12–17 ms and passed 22 ms, and the hero
 * kept the main thread 50–70% busy where the page without shaders rests at
 * ~10%. Unthrottled, the same frames take 3–4 ms.
 */
const KILL_FRAMES = 60;
const KILL_MS = 12;
const THEME_HOLD_MAX_MS = 2000;

type Rgba = [number, number, number, number];

/** "#rgb", "#rrggbb" or "#rrggbbaa" → 0..1 floats; null if not a hex token. */
function hex(value: string): Rgba | null {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(value.trim());
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) h = h.replace(/./g, (c) => c + c);
  if (h.length === 6) h += "ff";
  const n = (i: number) => parseInt(h.slice(i, i + 2), 16) / 255;
  return [n(0), n(2), n(4), n(6)];
}

/**
 * LiquidMetal paints a fixed chrome (near-white and near-black stripes) and
 * can only colour-burn a tint over it, which turns the dark stripes black
 * and the brand blues into rainbow fringes. Two lines of its source name
 * those stripe colours; they become uniforms here, so each theme sets its
 * own pair. Exact matches on the pinned version: if either line is missing
 * (the library changed), this throws and the static mark stays.
 */
const METAL_FRAGMENT = (() => {
  const steps: [string, string][] = [
    ["uniform vec4 u_colorTint;", "uniform vec4 u_colorTint;\nuniform vec4 u_colorHi;\nuniform vec4 u_colorLo;"],
    ["vec3 color1 = vec3(.98, 0.98, 1.);", "vec3 color1 = u_colorHi.rgb;"],
    [
      "vec3 color2 = vec3(.1, .1, .1 + .1 * smoothstep(.7, 1.3, diagTLtoBR));",
      "vec3 color2 = u_colorLo.rgb + vec3(0., 0., .1 * smoothstep(.7, 1.3, diagTLtoBR));",
    ],
  ];
  return () => {
    let src = liquidMetalFragmentShader;
    for (const [from, to] of steps) {
      if (!src.includes(from)) throw new Error("liquid-metal shader changed");
      src = src.replace(from, to);
    }
    return src;
  };
})();

const SIZING: ShaderMountUniforms = {
  u_scale: 1,
  u_rotation: 0,
  u_offsetX: 0,
  u_offsetY: 0,
  u_originX: 0.5,
  u_originY: 0.5,
  u_worldWidth: 0,
  u_worldHeight: 0,
};

type Palette = { dHi: Rgba; dLo: Rgba; handHi: Rgba; handLo: Rgba; mesh: Rgba[] };

function readPalette(el: Element): Palette {
  const s = getComputedStyle(el);
  const get = (name: string, fallback: string) => hex(s.getPropertyValue(name)) ?? (hex(fallback) as Rgba);
  return {
    dHi: get("--metal-d-hi", "#4fb4f8"),
    dLo: get("--metal-d-lo", "#022970"),
    handHi: get("--metal-hand-hi", "#5f86d6"),
    handLo: get("--metal-hand-lo", "#010f2e"),
    mesh: [1, 2, 3, 4].map((i) => get(`--mesh-${i}`, "#00000000")),
  };
}

function metalUniforms(image: HTMLImageElement, hi: Rgba, lo: Rgba): ShaderMountUniforms {
  return {
    u_image: image,
    u_colorBack: [0, 0, 0, 0],
    u_colorTint: [1, 1, 1, 0],
    u_colorHi: hi,
    u_colorLo: lo,
    u_contour: 0.4,
    u_distortion: 0.07,
    u_softness: 0.1,
    u_repetition: 2,
    u_shiftRed: 0.05,
    u_shiftBlue: 0.05,
    u_angle: 70,
    u_isImage: true,
    u_shape: 0,
    u_fit: ShaderFitOptions.contain,
    ...SIZING,
  };
}

function meshUniforms(colors: Rgba[]): ShaderMountUniforms {
  return {
    u_colors: colors,
    u_colorsCount: colors.length,
    u_distortion: 0.8,
    u_swirl: 0.1,
    u_grainMixer: 0,
    u_grainOverlay: 0,
    u_fit: ShaderFitOptions.cover,
    ...SIZING,
  };
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  const img = new Image();
  img.decoding = "async";
  img.src = src;
  await img.decode();
  return img;
}

const GL_ATTRIBUTES: WebGLContextAttributes = {
  alpha: true,
  premultipliedAlpha: true,
  antialias: false,
  depth: false,
  stencil: false,
  powerPreference: "low-power",
};

export type HeroShaderOptions = {
  /** The hero section: the theme tokens are read from it. */
  section: HTMLElement;
  /** The visible HeroMark's root (has [data-metal-host="d"|"hand"]), or null for no metal. */
  mark: HTMLElement | null;
  /** The visible mesh host, or null for no mesh. */
  mesh: HTMLElement | null;
  /** Fine pointer (desktop) vs touch: the metal's pixel-ratio cap. */
  fine: boolean;
  /**
   * Reduced motion: draw one frame, keep it as an image and release every
   * WebGL context (nothing will move, so nothing need stay on the GPU).
   * The caller re-creates the shaders if the theme changes.
   */
  still: boolean;
  /** Both groups have drawn their first frame (crossfade in). */
  onReady: (groups: { metal: boolean; mesh: boolean }) => void;
  /** Something failed: everything is gone, show the static art again. */
  onDead: () => void;
};

export type HeroShaders = {
  /** Loop (true) or hold the current frame (false). */
  run(on: boolean): void;
  destroy(): void;
};

type Group = {
  mounts: ShaderMount[];
  host: Element;
  speed: number;
  frame: number;
  onscreen: boolean;
  /** Recomputes the pixel caps from the hosts' current CSS size. */
  fit(): void;
};

export async function createHeroShaders(o: HeroShaderOptions): Promise<HeroShaders> {
  let dead = false;
  let wantRun = false;
  let killed = false;
  let inThemeTransition = false;
  let themeTimer = 0;
  let stopLoop: (() => void) | null = null;
  let last = 0;
  const frameTimes: number[] = [];
  const groups: Group[] = [];
  const cleanups: (() => void)[] = [];
  const baked: HTMLImageElement[] = [];

  const die = () => {
    if (dead) return;
    destroy();
    o.onDead();
  };

  /**
   * dispose() frees the program and textures but leaves the context to the
   * garbage collector, and browsers cap live contexts per page (~16): a few
   * rebuilds (breakpoint changes, re-baked stills) would start evicting the
   * oldest. Lose it explicitly. Listeners are gone first, so this is not
   * mistaken for a crash.
   */
  const release = (m: ShaderMount) => {
    const gl = m.canvasElement.getContext("webgl2");
    m.dispose();
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  };

  function destroy() {
    dead = true;
    stopLoop?.();
    stopLoop = null;
    window.clearTimeout(themeTimer);
    cleanups.forEach((c) => c());
    cleanups.length = 0;
    for (const g of groups) for (const m of g.mounts) release(m);
    groups.length = 0;
    for (const img of baked) img.remove();
    baked.length = 0;
    delete o.section.dataset.shaders;
  }

  /**
   * The still frame as images: each canvas is read back in the same task
   * that drew it (its drawing buffer is not presented yet), the images
   * replace the canvases once decoded, and the contexts are released.
   */
  async function bake() {
    const made: { img: HTMLImageElement; host: HTMLElement }[] = [];
    for (const g of groups) {
      for (const m of g.mounts) {
        m.setFrame(g.frame);
        const img = document.createElement("img");
        img.alt = "";
        img.src = m.canvasElement.toDataURL("image/png");
        img.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
        made.push({ img, host: m.parentElement });
      }
    }
    await Promise.all(made.map(({ img }) => img.decode()));
    if (dead) return;
    for (const { img, host } of made) {
      host.append(img);
      baked.push(img);
    }
    cleanups.forEach((c) => c());
    cleanups.length = 0;
    for (const g of groups) for (const m of g.mounts) release(m);
    groups.length = 0;
  }

  const draw = () => {
    for (const g of groups) {
      if (!g.onscreen) continue;
      for (const m of g.mounts) m.setFrame(g.frame);
    }
  };

  // Kill switch, the silk's own (SilkCanvas): a frame is timed from the start
  // of its callbacks until the browser has rendered it (a message posted
  // from the frame is handled after it), so it holds everything drawn in it
  // — silk, writer, shaders — and the page's restyle and commit. Timed only
  // while the same loops share the clock (frameGeneration): when the silk or
  // the writer stops itself, the count starts again on the frames that are
  // left, so the shaders are judged on frames like the ones they will go on
  // drawing.
  const rendered = new MessageChannel();
  let frameStart = 0;
  let frameGen = -1;
  rendered.port1.onmessage = () => {
    if (dead || killed || !frameStart) return;
    const took = performance.now() - frameStart;
    frameStart = 0;
    if (frameGeneration() !== frameGen) {
      frameTimes.length = 0;
      return;
    }
    frameTimes.push(took);
    if (frameTimes.length < KILL_FRAMES) return;
    const median = [...frameTimes].sort((a, b) => a - b)[KILL_FRAMES >> 1];
    if (median > KILL_MS) {
      killed = true;
      // Visible to QA and the page's tests, like the silk's data-silk-live.
      o.section.dataset.shaders = "stopped";
      update();
    }
  };
  cleanups.push(() => {
    rendered.port1.onmessage = null;
  });

  const tick = (now: number, began: number) => {
    if (dead) return;
    const dt = last ? Math.min(now - last, 100) : FRAME_MS;
    last = now;
    for (const g of groups) if (g.onscreen) g.frame += dt * g.speed;
    try {
      draw();
    } catch {
      die();
      return;
    }
    if (!frameStart && frameTimes.length < KILL_FRAMES) {
      if (!frameTimes.length) frameGen = frameGeneration();
      frameStart = began;
      rendered.port2.postMessage(0);
    }
  };

  function update() {
    const run = !dead && !killed && wantRun && !inThemeTransition && groups.some((g) => g.onscreen);
    if (run && !stopLoop) {
      last = 0;
      stopLoop = onFrames(FRAME_MS, tick);
    } else if (!run && stopLoop) {
      stopLoop();
      stopLoop = null;
      frameStart = 0;
      // A pause is not a slow frame: start the count again next time.
      if (frameTimes.length < KILL_FRAMES) frameTimes.length = 0;
    }
  }

  // Everything that can fail does so before anything is shown.
  const palette = readPalette(o.section);
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const metalDpr = Math.min(dpr, o.fine ? 1.5 : 2);
  const hosts: HTMLElement[] = [];
  /** Speed 0: the library's own loop never starts; the frame clock draws. */
  const mount = (host: HTMLElement, fragment: string, uniforms: ShaderMountUniforms, frame: number, maxPixels: number, mipmaps?: string[]) => {
    hosts.push(host);
    return new ShaderMount(host, fragment, uniforms, GL_ATTRIBUTES, 0, frame, 1, maxPixels, mipmaps);
  };

  try {
    if (o.mark) {
      const dHost = o.mark.querySelector<HTMLElement>('[data-metal-host="d"]');
      const handHost = o.mark.querySelector<HTMLElement>('[data-metal-host="hand"]');
      if (dHost && handHost) {
        const [dImg, handImg] = await Promise.all([loadImage(dMap.src), loadImage(handMap.src)]);
        if (dead) return { run() {}, destroy };
        const fragment = METAL_FRAGMENT();
        const capFor = (el: HTMLElement) => Math.max(1, Math.round(el.clientWidth * el.clientHeight * metalDpr * metalDpr));
        const d = mount(dHost, fragment, metalUniforms(dImg, palette.dHi, palette.dLo), METAL_FRAME0, capFor(dHost), ["u_image"]);
        groups.push({ mounts: [d], host: o.mark, speed: METAL_SPEED, frame: METAL_FRAME0, onscreen: true, fit() {} });
        const hand = mount(handHost, fragment, metalUniforms(handImg, palette.handHi, palette.handLo), METAL_FRAME0, capFor(handHost), ["u_image"]);
        groups[groups.length - 1].mounts.push(hand);
        groups[groups.length - 1].fit = () => {
          d.setMaxPixelCount(capFor(dHost));
          hand.setMaxPixelCount(capFor(handHost));
        };
      }
    }
    if (o.mesh) {
      const host = o.mesh as HTMLElement;
      const capFor = () => Math.min(MESH_MAX_PIXELS, Math.max(1, Math.round((host.clientWidth * host.clientHeight) / 4)));
      const mesh = mount(host, meshGradientFragmentShader, meshUniforms(palette.mesh), MESH_FRAME0, capFor());
      groups.push({
        mounts: [mesh],
        host,
        speed: MESH_SPEED,
        frame: MESH_FRAME0,
        onscreen: true,
        fit() {
          mesh.setMaxPixelCount(capFor());
        },
      });
    }
  } catch (error) {
    // No WebGL 2 after all, a shader that would not compile, a map that
    // would not decode: dispose what was made and drop any canvas a failed
    // constructor left behind (it adds its canvas before asking for a context).
    destroy();
    for (const h of hosts) h.querySelectorAll(":scope > canvas").forEach((c) => c.remove());
    throw error;
  }

  // A lost context leaves a blank canvas: give the page its static art back.
  for (const g of groups) {
    for (const m of g.mounts) {
      const onLost = (e: Event) => {
        e.preventDefault();
        die();
      };
      m.canvasElement.addEventListener("webglcontextlost", onLost);
      cleanups.push(() => m.canvasElement.removeEventListener("webglcontextlost", onLost));
    }
  }

  // Each group draws only while its own host is on screen (on phones the
  // mark's band can sit below the fold while the hero is in view).
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const g = groups.find((x) => x.host === e.target);
      if (g) g.onscreen = e.isIntersecting;
    }
    update();
  });
  for (const g of groups) io.observe(g.host);
  cleanups.push(() => io.disconnect());

  const ro = new ResizeObserver(() => {
    for (const g of groups) g.fit();
  });
  for (const g of groups) ro.observe(g.host);
  cleanups.push(() => ro.disconnect());

  // Theme switch: new colours at once (setUniforms draws a frame), so the
  // View Transition captures them; hold still while the transition runs.
  let key = JSON.stringify(palette);
  const mo = new MutationObserver(() => {
    const next = readPalette(o.section);
    const k = JSON.stringify(next);
    if (k === key || dead) return;
    key = k;
    try {
      for (const g of groups) {
        if (g.mounts.length === 2) {
          g.mounts[0].setUniforms({ u_colorHi: next.dHi, u_colorLo: next.dLo });
          g.mounts[1].setUniforms({ u_colorHi: next.handHi, u_colorLo: next.handLo });
        } else {
          g.mounts[0].setUniforms({ u_colors: next.mesh });
        }
      }
    } catch {
      die();
    }
  });
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  cleanups.push(() => mo.disconnect());

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
  cleanups.push(() => window.removeEventListener(THEME_TRANSITION_EVENT, onThemeTransition));

  // First frames: ShaderMount sizes its canvas (and draws) from a
  // ResizeObserver callback; until then the canvas has the HTML default
  // 300×150 backing store. Wait until every canvas has its host's shape
  // (a still frame read back too early is squeezed), then one more frame
  // for it to reach the screen.
  const sized = (m: ShaderMount) => {
    const cv = m.canvasElement;
    const host = m.parentElement;
    if (!cv.width || !cv.height || !host.clientWidth || !host.clientHeight) return false;
    if (cv.width === 300 && cv.height === 150) return false;
    return Math.abs(cv.width / cv.height - host.clientWidth / host.clientHeight) < 0.03;
  };
  const ready = () => groups.every((g) => g.mounts.every(sized));
  for (let i = 0; i < 30 && !ready() && !dead; i++) await new Promise((r) => requestAnimationFrame(r));
  if (dead) return { run() {}, destroy };
  if (!ready()) {
    die();
    return { run() {}, destroy };
  }
  const live = { metal: groups.some((g) => g.mounts.length === 2), mesh: groups.some((g) => g.mounts.length === 1) };
  try {
    if (o.still) {
      await bake();
      if (!dead) o.onReady(live);
      return { run() {}, destroy };
    }
    draw();
  } catch {
    die();
    return { run() {}, destroy };
  }
  await new Promise((r) => requestAnimationFrame(r));
  if (!dead) o.onReady(live);

  return {
    run(on: boolean) {
      wantRun = on;
      update();
    },
    destroy,
  };
}
