"use client";

import { memo, useEffect, useId, useLayoutEffect, useRef, useState, type RefObject } from "react";
import type { Widen } from "@/i18n/dict";
import type { showcaseExtra } from "@/i18n/extra/showcase";
import { frugalDevice } from "@/components/hero/device";
import { useMotionAllowed } from "@/components/system/motion-store";
import { cn } from "@/lib/utils";
import { FEED, LINE_POINTS, REGIONS, barsAt, clockAt, donutAt, kpisAt, lineAt, partsAt, type Kpi } from "./series";
import styles from "./showcase.module.css";

export type ShowcaseT = Widen<(typeof showcaseExtra)["en"]>;

/** One tick a second: the clock's rate; the parts take turns on it (series.ts: partsAt). */
const TICK = 1000;
/**
 * Every move a tick starts — the line's slide, the rolls, the bars, the
 * donut's turns — takes this long, so the moves of one tick also end in one
 * frame. --sc-slide and --sc-ease in showcase.module.css match.
 */
const SLIDE = 800;
const EASE = "cubic-bezier(0.45, 0, 0.2, 1)";

/**
 * Kill switch: this many long tasks (over 50 ms) within KILL_WINDOW ms while
 * the screen runs, and it holds still for the rest of the visit — the device
 * cannot keep up, and a decoration must not make the page slow (the hero's
 * canvases have kill switches of their own). A window, so one stray task
 * elsewhere on the page does not stop it. Browsers without the Long Tasks
 * API skip it.
 */
const KILL_TASKS = 3;
const KILL_WINDOW = 10_000;

/**
 * "May the screen move right now?": continuous motion allowed (no reduced
 * motion, no "Pause motion"), the screen on screen and the tab visible —
 * never on a frugal device (Save-Data, low-end), where it stays a still
 * picture like the hero's decoration, nor once the kill switch has fired.
 */
function useRunning(ref: RefObject<HTMLElement | null>): boolean {
  const allowed = useMotionAllowed();
  const [seen, setSeen] = useState(false);
  const [killed, setKilled] = useState(false);
  const running = allowed && seen && !killed;

  useEffect(() => {
    const el = ref.current;
    if (!el || frugalDevice()) return;
    let onscreen = false;
    const sync = () => setSeen(onscreen && !document.hidden);
    const io = new IntersectionObserver((entries) => {
      onscreen = entries.some((e) => e.isIntersecting);
      sync();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [ref]);

  useEffect(() => {
    if (!running || typeof PerformanceObserver === "undefined") return;
    if (!PerformanceObserver.supportedEntryTypes?.includes("longtask")) return;
    const seenAt: number[] = [];
    const po = new PerformanceObserver((list) => {
      for (const task of list.getEntries()) {
        seenAt.push(task.startTime);
        while (task.startTime - seenAt[0] > KILL_WINDOW) seenAt.shift();
        if (seenAt.length >= KILL_TASKS) {
          po.disconnect();
          setKilled(true);
          return;
        }
      }
    });
    po.observe({ type: "longtask" });
    return () => po.disconnect();
  }, [running]);

  return running;
}

/**
 * A number that rolls in when it changes: up from a little below, fading in
 * from faint, never from nothing, so a box is never seen empty (transform
 * and opacity, which the compositor runs). Values change only while the
 * screen runs, so a still screen never rolls.
 */
function Roll({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef(value);

  useLayoutEffect(() => {
    const el = ref.current;
    if (shown.current === value || !el || typeof el.animate !== "function") return;
    shown.current = value;
    el.animate([{ transform: "translateY(0.4em)", opacity: 0.25 }, { transform: "none", opacity: 1 }], {
      duration: SLIDE,
      easing: EASE,
    });
  }, [value]);

  return (
    <span ref={ref} className={styles.roll}>
      {value}
    </span>
  );
}

function KpiBox({ label, kpi, prefix, suffix }: { label: string; kpi: Kpi; prefix?: string; suffix?: string }) {
  return (
    <div className={styles.kpi}>
      <span className={styles.kpiLabel}>{label}</span>
      <span className={styles.kpiValue}>
        {prefix && <small>{prefix}</small>}
        <Roll value={kpi.value} />
        {suffix && <small>{suffix}</small>}
      </span>
      <span className={cn(styles.delta, !kpi.up && styles.down)}>
        <Roll value={kpi.delta} />
      </span>
    </div>
  );
}

/** Circumference of the donut's ring (r = 40 in a 100 × 100 box). */
const C = 2 * Math.PI * 40;
/** How far mobile money's cap reaches (turns); see Donut. */
const CAP = 0.45;

function Arc({ colour, length = 1, turn }: { colour: 1 | 2 | 3; length?: number; turn?: number }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={styles.arc}
      style={turn === undefined ? undefined : { transform: `rotate(${turn.toFixed(4)}turn)` }}
    >
      <circle
        cx="50"
        cy="50"
        r="40"
        transform="rotate(-90 50 50)"
        className={styles[`c${colour}`]}
        strokeDasharray={length < 1 ? `${(C * length).toFixed(2)} ${C.toFixed(2)}` : undefined}
      />
    </svg>
  );
}

/**
 * The donut, whose arcs shift by rotation alone (the compositor's work, no
 * repainted SVG): each arc is a fixed shape in an <svg> of its own, turned
 * into place. Mobile money is the whole ring underneath; bank (half a ring)
 * is turned to start where mobile money ends, cash (half a ring) to start
 * where bank ends — it runs past 12 o'clock — and a fixed cap of mobile
 * money's colour over the first 45% hides that overrun. Thin cuts in the
 * panel's colour turn with the boundaries. It holds while mobile money
 * stays within 55–62% and bank within 20–26% (series.ts: donutAt).
 */
function Donut({ e1, e2, centre, label }: { e1: number; e2: number; centre: number; label: string }) {
  return (
    <div className={styles.donut}>
      <Arc colour={1} />
      <Arc colour={2} length={0.5} turn={e1} />
      <Arc colour={3} length={0.5} turn={e2} />
      <Arc colour={1} length={CAP} />
      <span className={styles.cut} />
      <span className={styles.cut} style={{ transform: `rotate(${e1.toFixed(4)}turn)` }} />
      <span className={styles.cut} style={{ transform: `rotate(${e2.toFixed(4)}turn)` }} />
      <span className={styles.centre}>
        <span className={styles.centreValue}>
          <Roll value={`${centre}%`} />
        </span>
        <span className={styles.centreLabel}>{label}</span>
      </span>
    </div>
  );
}

type Money = ShowcaseT["money"];

/** The decoration around the screen: never changes, so never re-renders. */
const Sky = memo(function Sky() {
  return (
    <div aria-hidden="true" className={styles.sky}>
      <span className={styles.glow} />
      <span className={cn(styles.stars, styles.starsA)} />
      <span className={cn(styles.stars, styles.starsB)} />
      <span className={cn(styles.stars, styles.starsC)} />
    </div>
  );
});

/** The top bar: re-renders each tick, for the clock alone. */
const Topbar = memo(function Topbar({ t, clock }: { t: ShowcaseT; clock: string }) {
  return (
    <div className={styles.topbar}>
      <span className={styles.lights}>
        <i />
        <i />
        <i />
      </span>
      <span className={styles.app}>{t.app}</span>
      <span className={styles.entity}>{t.entity}</span>
      <span className={styles.stamp}>{t.stamp}</span>
      <span className={styles.live}>
        <span className={styles.pulse} />
        <span className={styles.liveText}>{t.live}</span>
      </span>
      <span className={styles.clock}>{clock}</span>
    </div>
  );
});

/** The four KPIs at their `version` (series.ts: partsAt). */
const Kpis = memo(function Kpis({ t, version }: { t: ShowcaseT; version: number }) {
  const kpis = kpisAt(version);
  const money = t.money;
  return (
    <div className={styles.kpis}>
      <KpiBox label={t.kpis.collected} kpi={kpis.collected} prefix={money.prefix} suffix={money.suffix} />
      <KpiBox label={t.kpis.borrowers} kpi={kpis.borrowers} />
      <KpiBox label={t.kpis.rate} kpi={kpis.rate} />
      <KpiBox label={t.kpis.loans} kpi={kpis.loans} />
    </div>
  );
});

/**
 * The line graph at its `version`. FLIP: the new path is one point further
 * on, i.e. drawn one step to the left of the old one; it starts where the
 * old one was and slides home.
 */
const LinePanel = memo(function LinePanel({ t, version }: { t: ShowcaseT; version: number }) {
  const gradient = `sc${useId().replace(/[^\w-]/g, "")}`;
  const lineRef = useRef<SVGSVGElement>(null);
  const drawn = useRef(version);
  useLayoutEffect(() => {
    const el = lineRef.current;
    const moved = version - drawn.current;
    drawn.current = version;
    if (moved !== 1 || !el || typeof el.animate !== "function") return;
    el.animate([{ transform: `translateX(${100 / (LINE_POINTS - 1)}%)` }, { transform: "none" }], {
      duration: SLIDE,
      easing: EASE,
    });
  }, [version]);

  const line = lineAt(version);
  const money = t.money;
  return (
    <div className={cn(styles.panel, styles.linePanel)}>
      <div className={styles.head}>
        <span>{t.line.title}</span>
        <span className={styles.headValue}>
          <small>{money.prefix}</small>
          <Roll value={line.value} />
          <small>{money.suffix}</small>
        </span>
      </div>
      <div className={styles.plot}>
        <div className={styles.clip}>
          <svg ref={lineRef} viewBox="0 0 100 100" preserveAspectRatio="none" className={styles.lineSvg}>
            <defs>
              <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" className={styles.areaTop} />
                <stop offset="1" className={styles.areaFoot} />
              </linearGradient>
            </defs>
            <path d={line.area} fill={`url(#${gradient})`} />
            <path d={line.line} className={styles.lineGlow} />
            <path d={line.line} className={styles.lineStroke} />
          </svg>
        </div>
        <span className={styles.tip} style={{ transform: `translateY(${line.head.toFixed(2)}%)` }}>
          <span className={styles.pulse} />
        </span>
      </div>
    </div>
  );
});

/** The bar chart at its `version`. */
const BarsPanel = memo(function BarsPanel({ t, version }: { t: ShowcaseT; version: number }) {
  const bars = barsAt(version);
  const money = t.money;
  return (
    <div className={cn(styles.panel, styles.barsPanel)}>
      <div className={styles.head}>
        <span>{t.bars.title}</span>
        <span className={styles.unit}>
          {money.prefix} {money.suffix}
        </span>
      </div>
      <div className={styles.bars}>
        {REGIONS.map((region, i) => (
          <div key={region} className={styles.bar}>
            <span className={styles.track}>
              <span
                className={cn(styles.fill, i === bars.top && styles.top)}
                style={{ transform: `translateY(${((1 - bars.heights[i]) * 100).toFixed(2)}%)` }}
              />
            </span>
            <span className={styles.barLabel}>{region}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

/** The donut and its legend at their `version`. */
const DonutPanel = memo(function DonutPanel({ t, version }: { t: ShowcaseT; version: number }) {
  const donut = donutAt(version);
  return (
    <div className={cn(styles.panel, styles.donutPanel)}>
      <div className={styles.head}>
        <span>{t.donut.title}</span>
      </div>
      <div className={styles.donutRow}>
        <Donut e1={donut.e1} e2={donut.e2} centre={donut.pct[0]} label={t.donut.centre} />
        <ul className={styles.legend}>
          {t.donut.channels.map((name, i) => (
            <li key={name}>
              <i className={styles[`c${(i + 1) as 1 | 2 | 3}`]} />
              <span className={styles.legendName}>{name}</span>
              <span className={styles.legendValue}>
                <Roll value={`${donut.pct[i]}%`} />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
});

/** The feed: its two copies of the entries never change; a CSS loop runs them. */
const Feed = memo(function Feed({ t, money }: { t: ShowcaseT; money: Money }) {
  return (
    <div className={cn(styles.panel, styles.feed)}>
      <div className={styles.head}>
        <span>{t.feed.title}</span>
        <span className={styles.pulse} />
      </div>
      <div className={styles.window}>
        {/* Two copies, so the loop (to -50%) is seamless. */}
        <div className={styles.reel}>
          {[0, 1].map((copy) =>
            FEED.map((entry, i) => (
              <div key={`${copy}-${i}`} className={styles.entry}>
                <i className={styles[`c${(entry.channel + 1) as 1 | 2 | 3}`]} />
                <span className={styles.amount}>
                  {money.prefix} {entry.amount}
                </span>
                <span className={styles.meta}>
                  {entry.town} · {entry.time}
                </span>
              </div>
            )),
          )}
        </div>
      </div>
    </div>
  );
});

/**
 * The home page's dashboards showcase (iteration-5 §H): a large rounded
 * screen with a fine light rim, a glow rising behind its top edge with a
 * few tiny stars, and inside it a dashboard DataHub could have built,
 * stamped as sample data. Left three quarters: four KPIs, a line graph, a
 * bar chart and a donut; right quarter: a feed of repayments scrolling up
 * by itself (a strip along the bottom on phones). Layout and themes in
 * showcase.module.css.
 *
 * Live: one tick a second (a timer) moves the clock and, in turn, one
 * part (series.ts: partsAt) — every other second the line slides one
 * point left (its new path, started one step to the right and eased
 * into place by the Web Animations API: FLIP); in the seconds between, a
 * KPI rolls to a new value, the bars ease to new heights or the donut's
 * arcs turn — transforms and opacity throughout; the SVG changes at most
 * once a tick. Each part is its own memoised component, so a tick renders
 * the clock and that one part, nothing else. The feed, the "Live" dots and
 * the stars are CSS loops that play only while the figure carries
 * data-live="run". All of it holds still off screen, in a hidden tab, with
 * reduced motion or "Pause motion", on a frugal device, and for good once
 * the kill switch sees the device struggle (useRunning).
 *
 * Server HTML: the complete dashboard at tick 0, the same picture the
 * browser hydrates, so nothing is empty and nothing shifts. A client
 * component, so only the words cross over (`t`), not the drawing. One
 * figure named "Sample dashboard, live demo", as a picture (role="img": a
 * figure whose content is all hidden can be passed over unannounced);
 * everything inside is aria-hidden, so screen readers do not hear the
 * ticking. Nothing inside takes focus.
 */
export function Showcase({ t }: { t: ShowcaseT }) {
  const root = useRef<HTMLElement>(null);
  const running = useRunning(root);
  const [tick, setTick] = useState(0);

  // A timer, not an animation frame (the hero's frame clock): a frame
  // whose only work is to start the render would be drawn for nothing, and
  // the render then asks for the frame it needs. Nor is the render pulled
  // into a frame (flushSync): one task holding the render and the frame's
  // drawing would be a long task on a slow phone.
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setTick((n) => n + 1), TICK);
    return () => clearInterval(id);
  }, [running]);

  const parts = partsAt(tick);

  return (
    <figure
      ref={root}
      role="img"
      aria-label={t.label}
      className={styles.stage}
      data-live={running ? "run" : undefined}
    >
      <Sky />
      <div aria-hidden="true" className={styles.device}>
        <div className={styles.screen}>
          <Topbar t={t} clock={clockAt(tick)} />
          <div className={styles.body}>
            <div className={styles.main}>
              <Kpis t={t} version={parts.kpis} />
              <LinePanel t={t} version={parts.line} />
              <BarsPanel t={t} version={parts.bars} />
              <DonutPanel t={t} version={parts.donut} />
            </div>
            <Feed t={t} money={t.money} />
          </div>
        </div>
      </div>
    </figure>
  );
}
