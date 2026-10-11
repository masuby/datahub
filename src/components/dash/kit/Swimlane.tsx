import type { DashCtx, Mark } from "../context";
import { ReadMarker } from "../ReadMarker";
import { ChartArea, ChartSvg } from "./ChartSvg";
import { linear } from "./scales";
import styles from "../dash.module.css";

export type LaneItem = { time: string; lane: number; label: string };

/**
 * A day's schedule as swimlanes (Fig. 02.10). Lanes are named rows; each job
 * is a 6px dot at its time with a static ✓ and its label. Labels are HTML laid
 * over the SVG so long Kiswahili lines can wrap on a phone. No "now" line, no
 * pulse: it is a schedule, not a live feed.
 */
export function Swimlane({
  ctx,
  id,
  summary,
  lanes,
  items,
  fromHour,
  toHour,
  axisTitle,
  links = [],
  marks,
}: {
  ctx: DashCtx;
  id: string;
  summary: string;
  lanes: readonly string[];
  items: readonly LaneItem[];
  fromHour: number;
  toHour: number;
  axisTitle: string;
  /** Connect item a to item b (e.g. an alert handed to the agent). */
  links?: readonly [number, number][];
  marks: Mark[];
}) {
  const LANE_H = 26;
  const ROW_H = 36;
  const TOP = 26;
  const minutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  const x = linear(fromHour * 60, toHour * 60, 1, 99);

  // Rows: lane header, then that lane's items in time order.
  const rows: ({ kind: "lane"; lane: number; y: number } | { kind: "item"; index: number; y: number })[] = [];
  let yy = TOP;
  lanes.forEach((_, lane) => {
    rows.push({ kind: "lane", lane, y: yy + LANE_H / 2 });
    yy += LANE_H;
    items
      .map((it, index) => ({ it, index }))
      .filter(({ it }) => it.lane === lane)
      .sort((a, b) => minutes(a.it.time) - minutes(b.it.time))
      .forEach(({ index }) => {
        rows.push({ kind: "item", index, y: yy + ROW_H / 2 });
        yy += ROW_H;
      });
  });
  const plotBottom = yy + 4;
  const height = plotBottom + 40;
  const itemY = new Map(rows.flatMap((r) => (r.kind === "item" ? [[r.index, r.y] as const] : [])));
  const hours: number[] = [];
  for (let h = fromHour; h <= toHour; h += 3) hours.push(h);

  return (
    <ChartArea style={{ height }}>
      <ChartSvg ctx={ctx} titleId={`${id}-title`} summary={summary} height={height}>
        <g aria-hidden="true">
          {hours.map((h) => (
            <g key={h}>
              <line
                x1={`${x(h * 60)}%`}
                x2={`${x(h * 60)}%`}
                y1={TOP}
                y2={plotBottom}
                strokeWidth={1}
                strokeDasharray="1 3"
                style={{ stroke: "var(--rule)" }}
              />
              <text
                x={`${x(h * 60)}%`}
                y={plotBottom + 16}
                textAnchor={h === fromHour ? "start" : h === toHour ? "end" : "middle"}
              >
                {String(h).padStart(2, "0")}:00
              </text>
            </g>
          ))}
          <line x1="0%" x2="100%" y1={plotBottom} y2={plotBottom} strokeWidth={1} style={{ stroke: "var(--rule-input)" }} />
          <text x="0%" y={plotBottom + 34}>
            {axisTitle}
          </text>
        </g>
        {rows.map((r) =>
          r.kind === "lane" ? (
            <g key={`lane-${r.lane}`}>
              {r.lane > 0 && (
                <line x1="0%" x2="100%" y1={r.y - LANE_H / 2} y2={r.y - LANE_H / 2} strokeWidth={1} style={{ stroke: "var(--rule)" }} />
              )}
              <text x="0%" y={r.y + 4} className={styles.stampText} style={{ fill: "var(--fg-subtle)" }}>
                {lanes[r.lane].toUpperCase()}
              </text>
            </g>
          ) : null,
        )}
        {links.map(([a, b]) => (
          <line
            key={`${a}-${b}`}
            x1={`${x(minutes(items[a].time))}%`}
            x2={`${x(minutes(items[b].time))}%`}
            y1={itemY.get(a)}
            y2={itemY.get(b)}
            strokeWidth={1}
            strokeDasharray="2 3"
            style={{ stroke: "var(--s-ref)" }}
          />
        ))}
        {items.map((it, i) => (
          <circle
            key={i}
            cx={`${x(minutes(it.time))}%`}
            cy={itemY.get(i)}
            r={3}
            className="a-fade"
            style={{ fill: "var(--s1)", animationDelay: `${Math.min(i, 6) * 60}ms` }}
          />
        ))}
      </ChartSvg>
      {items.map((it, i) => {
        const px = x(minutes(it.time));
        const right = px > 55;
        const m = /^(\d{1,2}:\d{2})\s+(.*)$/.exec(it.label);
        const text = m ? m[2] : it.label;
        return (
          <p
            key={i}
            className={styles.laneLabel}
            style={{
              top: itemY.get(i),
              ...(right
                ? { right: `calc(${100 - px}% + 16px)`, maxWidth: `calc(${px}% - 16px)`, textAlign: "right" }
                : { left: `calc(${px}% + 16px)`, maxWidth: `calc(${100 - px}% - 16px)` }),
            }}
          >
            <span className="text-ok" aria-hidden="true">
              ✓{" "}
            </span>
            <b>{it.time}</b> {text}
          </p>
        );
      })}
      {marks.map((mk, k) => (
        <ReadMarker key={mk.n} n={mk.n} order={k} left={x(minutes(items[mk.i].time))} top={itemY.get(mk.i) ?? 0} />
      ))}
    </ChartArea>
  );
}
