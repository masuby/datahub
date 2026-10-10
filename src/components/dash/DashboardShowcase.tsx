"use client";

import {
  Suspense,
  lazy,
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ComponentType,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { ButtonText } from "@/components/ui/Button";
import { Rule } from "@/components/ui/Rule";
import type { DashCtx, ViewKey } from "./context";
import { Overview } from "./views/Overview";
import styles from "./dash.module.css";

/**
 * The dashboards island (spec §6.3, §8.1, §10.1).
 *
 * The views are client components fed by `ctx` — the dashboard dictionary
 * and a few flags, a few KB of plain data. That is deliberate: as server
 * components their SVG was sent twice, once as HTML and again inside the
 * React payload, and the four views were the heaviest thing on the page.
 *
 * Only the first view is in the server HTML (that is what every visitor sees
 * first, and what a visitor without JavaScript keeps). The other three are
 * separate chunks, mounted when the browser is idle after hydration — into
 * panels that stay hidden="until-found", so find-in-page reaches them from
 * then on — or at once if a tab is chosen before that.
 *
 * Beyond rendering, this component:
 *   - switches views (WAI-ARIA tabs: arrows move and activate, Home/End);
 *     a `beforematch` switches to the panel that holds a find-in-page match;
 *   - re-mounts a panel when it is shown again so its charts redraw;
 *   - toggles read mode (a data attribute; CSS shows markers and notes);
 *   - runs the crosshair / highlight contract in kit/ChartSvg.tsx.
 */

type Tab = { id: ViewKey; index: string; name: string; description: string };
type View = ComponentType<{ ctx: DashCtx }>;

const VIEWS: Record<ViewKey, View> = {
  overview: Overview,
  loans: lazy(() => import("./views/Loans").then((m) => ({ default: m.Loans }))),
  sales: lazy(() => import("./views/Sales").then((m) => ({ default: m.Sales }))),
  operations: lazy(() => import("./views/Operations").then((m) => ({ default: m.Operations }))),
};

/**
 * Rendered next to a lazy view inside its Suspense boundary: its effect runs
 * when the boundary commits, i.e. once the chunk has arrived and the view's
 * charts are in the DOM, so they can be wired then.
 */
function OnCommit({ onCommit }: { onCommit: () => void }) {
  useEffect(onCommit, [onCommit]);
  return null;
}

/** Runs `fn` when the main thread is idle (or soon, where there is no idle callback). */
function whenIdle(fn: () => void): () => void {
  if (typeof requestIdleCallback === "function") {
    const id = requestIdleCallback(fn, { timeout: 2500 });
    return () => cancelIdleCallback(id);
  }
  const id = setTimeout(fn, 300);
  return () => clearTimeout(id);
}

const WIDE = "(min-width: 1024px)";
const subscribeWide = (cb: () => void) => {
  const m = window.matchMedia(WIDE);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};

/** React 19.2 renders `hidden` as a boolean; the upper-case name passes the value through (HTML attributes are case-insensitive). */
const untilFound = { HIDDEN: "until-found" } as Record<string, string>;

export function DashboardShowcase({
  ctx,
  tabs,
  labels,
}: {
  ctx: DashCtx;
  tabs: Tab[];
  labels: { tablist: string; readOn: string; readOff: string; readHint: string };
}) {
  const idp = ctx.idp;
  const [active, setActive] = useState(0);
  const [plays, setPlays] = useState<number[]>(() => tabs.map(() => 0));
  const [read, setRead] = useState(false);
  // false on the server and during hydration: only the active view renders.
  const [allMounted, setAllMounted] = useState(false);
  useEffect(() => whenIdle(() => startTransition(() => setAllMounted(true))), []);
  // Bumped whenever a lazy view commits; re-runs the chart wiring below.
  const [commits, setCommits] = useState(0);
  const onViewCommit = useCallback(() => setCommits((c) => c + 1), []);
  const rootRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const wide = useSyncExternalStore(
    subscribeWide,
    () => window.matchMedia(WIDE).matches,
    () => true,
  );

  const select = (i: number, focus = false) => {
    if (focus) tabRefs.current[i]?.focus();
    if (i === active) return;
    setActive(i);
    setPlays((p) => p.map((v, j) => (j === i ? v + 1 : v)));
  };

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const n = tabs.length;
    const map: Record<string, number> = {
      ArrowRight: (active + 1) % n,
      ArrowDown: (active + 1) % n,
      ArrowLeft: (active - 1 + n) % n,
      ArrowUp: (active - 1 + n) % n,
      Home: 0,
      End: n - 1,
    };
    if (!(e.key in map)) return;
    e.preventDefault();
    select(map[e.key], true);
  };

  // Find-in-page reveals a hidden="until-found" panel: make it the active tab.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const onMatch = (e: Event) => {
      const i = tabs.findIndex((t) => `${idp}-panel-${t.id}` === (e.target as HTMLElement).id);
      // Activate without bumping `plays`: the revealed panel keeps its DOM
      // node, so the browser's scroll to the match (and scroll anchoring)
      // survives the commit.
      if (i >= 0) setActive(i);
    };
    root.addEventListener("beforematch", onMatch, true);
    return () => root.removeEventListener("beforematch", onMatch, true);
  });

  // First reveal (spec §6.3 Moves): the server-painted charts may already
  // have drawn off-screen (or before hydration on a slow phone), so when the
  // active panel first scrolls into view it is re-mounted and draws again.
  // Nothing happens if it was already in view at mount.
  const revealed = useRef(false);
  useEffect(() => {
    const panel = rootRef.current?.querySelector<HTMLElement>(`#${idp}-panel-${tabs[active].id}`);
    if (!panel || revealed.current || typeof IntersectionObserver === "undefined") return;
    if (panel.getBoundingClientRect().top < window.innerHeight * 0.92) {
      revealed.current = true;
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting) || revealed.current) return;
        revealed.current = true;
        io.disconnect();
        setPlays((p) => p.map((v, j) => (j === active ? v + 1 : v)));
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(panel);
    return () => io.disconnect();
  }, [active, idp, tabs]);

  // Crosshair, highlight and readout for every chart in the shown panel —
  // re-wired when the panel re-mounts and when a lazy view arrives (a tab
  // chosen before its chunk loaded first commits an empty panel).
  const playKey = plays[active];
  useEffect(() => {
    const root = rootRef.current;
    const panel = root?.querySelector<HTMLElement>(`#${idp}-panel-${tabs[active].id}`);
    return panel ? wireCharts(panel) : undefined;
  }, [active, playKey, commits, idp, tabs]);

  return (
    <div ref={rootRef} className={styles.root} data-read={read ? "on" : "off"}>
      <div
        className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12"
        style={{ columnGap: "var(--col-gap)" }}
      >
        <div className="col-span-4 sm:col-span-8 lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:col-span-3 lg:self-start">
          <div
            role="tablist"
            aria-label={labels.tablist}
            aria-orientation={wide ? "vertical" : "horizontal"}
            className={styles.tablist}
            onKeyDown={onKeyDown}
          >
            {tabs.map((t, i) => (
              <button
                key={t.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`${idp}-tab-${t.id}`}
                aria-selected={i === active}
                aria-controls={`${idp}-panel-${t.id}`}
                tabIndex={i === active ? 0 : -1}
                className={styles.tab}
                onClick={() => select(i)}
              >
                <span className="t-data block">{t.index}</span>
                <span className="t-title mt-1 block max-lg:font-mono max-lg:text-[0.8125rem] max-lg:tracking-[0.02em]">
                  {t.name}
                </span>
                <span className={`${styles.tabDesc} t-small font-normal text-muted`}>{t.description}</span>
              </button>
            ))}
          </div>
          <Rule className="mt-0 max-lg:mt-[-1px]" />
          <div className="mt-2 flex flex-wrap items-baseline gap-x-4 lg:block">
            {/* The label says the state, so no aria-pressed ("Hide explanations, pressed"). */}
            <ButtonText active={read} onClick={() => setRead((r) => !r)}>
              {read ? labels.readOff : labels.readOn}
            </ButtonText>
            <p className="t-data max-w-[34ch]">{labels.readHint}</p>
          </div>
        </div>
        <div className="col-span-4 mt-10 sm:col-span-8 lg:col-span-9 lg:col-start-4 lg:mt-0">
          {tabs.map((t, i) => {
            const View = VIEWS[t.id];
            return (
              <div
                key={`${t.id}-${plays[i]}`}
                id={`${idp}-panel-${t.id}`}
                role="tabpanel"
                aria-labelledby={`${idp}-tab-${t.id}`}
                className={i === active && plays[i] > 0 ? styles.panel : undefined}
                {...(i === active ? null : untilFound)}
              >
                {(i === active || allMounted) &&
                  (View === Overview ? (
                    // No Suspense around the eager view: React outlines a
                    // large completed boundary into a hidden <div> after the
                    // footer, which would leave this panel empty without JS.
                    <View ctx={ctx} />
                  ) : (
                    <Suspense fallback={null}>
                      <View ctx={ctx} />
                      <OnCommit onCommit={onViewCommit} />
                    </Suspense>
                  ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** Wires the data-cross contract (kit/ChartSvg.tsx) inside one panel. Returns cleanup. */
function wireCharts(panel: HTMLElement): () => void {
  const offs: (() => void)[] = [];
  panel.querySelectorAll<HTMLElement>("[data-cross]").forEach((el) => {
    const d = el.dataset;
    const axis = d.cross;
    const pos = (d.pos ?? "").split(" ").map(Number);
    const dots = d.dots ? d.dots.split(" ").map((p) => p.split(",").map(Number)) : null;
    const yUnit = d.yu === "%" ? "%" : "";
    const reads: string[] = JSON.parse(d.reads ?? "[]");
    const keys = d.keys ? d.keys.split(" ") : null;
    const idle = Number(d.idle) || 0;
    const band = d.band ? d.band.split(" ").map(Number) : null;
    const bx = d.bx ? d.bx.split(" ").map(Number) : null;
    const link = el.closest<HTMLElement>("[data-link]");
    const scope = link ?? el.closest<HTMLElement>("figure") ?? el;
    const marks = link ?? el;
    const svg = el.querySelector("svg") ?? el;
    const xl = el.querySelector<SVGLineElement>("[data-xl]");
    const xd = el.querySelector<SVGCircleElement>("[data-xd]");
    const readouts = () => scope.querySelectorAll<HTMLElement>("[data-readout]");
    let cur = -1;

    const show = (i: number) => {
      if (i === cur) return;
      cur = i;
      el.setAttribute("data-hl", "");
      link?.setAttribute("data-hl", "");
      marks.querySelectorAll("[data-on]").forEach((n) => n.removeAttribute("data-on"));
      const k = keys ? keys[i] : String(i);
      marks.querySelectorAll(`[data-k="${k}"]`).forEach((n) => n.setAttribute("data-on", ""));
      if (xl && axis === "x") {
        xl.setAttribute("x1", `${pos[i]}%`);
        xl.setAttribute("x2", `${pos[i]}%`);
      }
      if (xd) {
        xd.style.display = dots ? "" : "none";
        if (dots) {
          xd.setAttribute("cx", `${dots[i][0]}%`);
          xd.setAttribute("cy", `${dots[i][1]}${yUnit}`);
        }
      }
      readouts().forEach((r) => (r.textContent = reads[i] ?? ""));
    };
    const hide = () => {
      cur = -1;
      el.removeAttribute("data-hl");
      link?.removeAttribute("data-hl");
      marks.querySelectorAll("[data-on]").forEach((n) => n.removeAttribute("data-on"));
      readouts().forEach((r) => (r.textContent = r.dataset.idle ?? ""));
    };
    const nearest = (e: PointerEvent) => {
      const r = svg.getBoundingClientRect();
      if (axis === "pt" && dots) {
        let best = -1;
        let bd = 40;
        dots.forEach(([x, y], i) => {
          const py = r.top + (yUnit ? (y / 100) * r.height : y);
          const dd = Math.hypot(r.left + (x / 100) * r.width - e.clientX, py - e.clientY);
          if (dd < bd) {
            bd = dd;
            best = i;
          }
        });
        return best;
      }
      // A 100% bar: over the bar band, the segment under the pointer wins.
      const py = e.clientY - r.top;
      if (band && bx && py >= band[0] && py <= band[1]) {
        const px = ((e.clientX - r.left) / r.width) * 100;
        let seg = 0;
        bx.forEach((s, i) => {
          if (px >= s) seg = i;
        });
        return seg;
      }
      const p = axis === "y" ? py : ((e.clientX - r.left) / r.width) * 100;
      let best = 0;
      pos.forEach((v, i) => {
        if (Math.abs(v - p) < Math.abs(pos[best] - p)) best = i;
      });
      return best;
    };
    const onMove = (e: PointerEvent) => {
      const i = nearest(e);
      if (i < 0) hide();
      else show(i);
    };
    const onKey = (e: KeyboardEvent) => {
      const n = pos.length;
      const at = cur < 0 ? idle : cur;
      const next: Record<string, number> = {
        ArrowRight: Math.min(n - 1, at + 1),
        ArrowDown: Math.min(n - 1, at + 1),
        ArrowLeft: Math.max(0, at - 1),
        ArrowUp: Math.max(0, at - 1),
        Home: 0,
        End: n - 1,
      };
      if (!(e.key in next)) return;
      e.preventDefault();
      show(next[e.key]);
    };
    const onFocus = () => show(idle);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", hide);
    el.addEventListener("focus", onFocus);
    el.addEventListener("blur", hide);
    el.addEventListener("keydown", onKey);
    offs.push(() => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", hide);
      el.removeEventListener("focus", onFocus);
      el.removeEventListener("blur", hide);
      el.removeEventListener("keydown", onKey);
    });
  });
  return () => offs.forEach((off) => off());
}
