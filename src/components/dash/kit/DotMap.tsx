import { TZ_DOTS, TZ_DOTS_HEIGHT, TZ_DOTS_WIDTH, TZ_DOT_SIZE, projectTZ, type TzTerritory } from "@/lib/tz-dots";
import type { DashCtx, Mark } from "../context";
import { ReadMarker } from "../ReadMarker";
import { SampleStamp } from "../SampleStamp";
import { ChartArea } from "./ChartSvg";
import styles from "../dash.module.css";

export type MapHub = {
  key: TzTerritory;
  lat: number;
  lon: number;
  /** Ring radius in map units (∝ √sales). */
  r: number;
  /** CSS colour of the territory's dots (ramp step by growth). */
  tone: string;
};

/**
 * Dot-matrix Tanzania (Fig. 02.8): land only, lakes empty, no border lines of
 * any kind. Dots are coloured by sales territory (nearest hub), rings at each
 * hub are sized by sales. The dots come from src/lib/tz-dots.ts (generated
 * once from Natural Earth; no runtime fetch).
 *
 * The outer SVG keeps the map's aspect ratio and holds the SAMPLE stamp at a
 * constant size; the map itself is a nested, uniformly scaled viewBox.
 */
export function DotMap({
  ctx,
  id,
  label,
  summary,
  readoutId,
  hubs,
  reads,
  marks,
}: {
  ctx: DashCtx;
  id: string;
  label: string;
  summary: string;
  readoutId: string;
  hubs: readonly MapHub[];
  reads: string[];
  marks: Mark[];
}) {
  const W = TZ_DOTS_WIDTH;
  const H = TZ_DOTS_HEIGHT;
  const pts = hubs.map((h) => projectTZ(h.lat, h.lon));
  const pct = pts.map(([px, py]) => [(px / W) * 100, (py / H) * 100] as const);

  return (
    <ChartArea
      ctx={ctx}
      label={label}
      readoutId={readoutId}
      className="mx-auto max-w-[540px]"
      cross={{
        axis: "pt",
        pos: pct.map(([px]) => px),
        dots: pct,
        yPct: true,
        reads,
        keys: hubs.map((h) => h.key),
        idle: 0,
      }}
    >
      <svg
        className={styles.svg}
        width="100%"
        style={{ aspectRatio: `${W} / ${H}`, height: "auto" }}
        role="img"
        aria-labelledby={`${id}-title`}
      >
        <title id={`${id}-title`}>{`${ctx.figurePrefix} ${summary}`}</title>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" overflow="visible" aria-hidden="true">
          <g className="a-fade">
            {hubs.map((h) => (
              <path
                key={h.key}
                data-k={h.key}
                d={TZ_DOTS[h.key]}
                fill="none"
                strokeWidth={TZ_DOT_SIZE}
                strokeLinecap="round"
                style={{ stroke: h.tone }}
              />
            ))}
          </g>
          <g>
            {hubs.map((h, i) => (
              <circle
                key={h.key}
                data-k={h.key}
                className={`${styles.ring} ${styles.fadeLate}`}
                cx={pts[i][0]}
                cy={pts[i][1]}
                r={h.r}
                fill="none"
                strokeWidth={1.5}
                vectorEffect="non-scaling-stroke"
                style={{ stroke: "var(--fg)" }}
              />
            ))}
          </g>
        </svg>
        <SampleStamp text={ctx.t.stamp} />
      </svg>
      {marks.map((m, k) => {
        const [px, py] = pct[m.i];
        const lift = ((hubs[m.i].r + 16) / H) * 100;
        return (
          <ReadMarker
            key={m.n}
            ctx={ctx}
            n={m.n}
            noteId={m.noteId}
            order={k}
            left={px}
            top={py - lift}
            topPct
          />
        );
      })}
    </ChartArea>
  );
}
