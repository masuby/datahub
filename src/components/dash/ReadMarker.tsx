import { fill } from "@/i18n/fill";
import { cn } from "@/lib/utils";
import type { DashCtx, Note } from "./context";
import styles from "./dash.module.css";

/**
 * Read mode ("Explain this view", spec §10.1): a numbered 24px ring placed at
 * a data coordinate. On /dashboards it is a focusable <button> described by
 * its note; with read mode off it is display:none (out of the tab order and
 * the accessibility tree). On service pages notes are always shown and the
 * marker is a plain numeral beside the chart.
 *
 * `left` is a percentage of the chart width; `top` is px (or % with `topPct`).
 * Hover/focus linking with the note is pure CSS (:has) in dash.module.css.
 */
export function ReadMarker({
  ctx,
  n,
  noteId,
  order = 0,
  left,
  top,
  topPct = false,
  inline = false,
}: {
  ctx: DashCtx;
  n: number;
  noteId: string;
  order?: number;
  left?: number;
  top?: number;
  topPct?: boolean;
  inline?: boolean;
}) {
  const className = cn(styles.marker, styles.readEl, inline && styles.markerInline);
  const style = {
    ...(inline ? null : { left: `${left}%`, top: topPct ? `${top}%` : `${top}px` }),
    ["--i" as string]: order,
  };
  if (!ctx.live) {
    return (
      <span className={className} style={style} data-m={n} aria-hidden="true">
        {n}
      </span>
    );
  }
  return (
    <button
      type="button"
      className={className}
      style={style}
      data-m={n}
      aria-label={fill(ctx.t.read.markerLabel, { n })}
      aria-describedby={noteId}
    >
      <span aria-hidden="true">{n}</span>
    </button>
  );
}

/** The numbered notes of one figure: what it shows, and the decision it supports. */
export function ReadNotes({ ctx, notes }: { ctx: DashCtx; notes: Note[] }) {
  if (notes.length === 0) return null;
  return (
    <ol className={cn(styles.notes, styles.readEl)} aria-label={ctx.t.read.listLabel}>
      {notes.map((note) => (
        <li key={note.n} id={note.noteId} className={styles.note} data-n={note.n}>
          <span className={styles.noteNum} aria-hidden="true">
            {note.n}
          </span>
          <span className="min-w-0">
            <span className="t-small block font-semibold text-fg">{note.shows}</span>
            <span className="t-small mt-1 block text-muted">
              <span className="font-semibold text-subtle">{ctx.t.read.decisionPrefix} </span>
              {note.decision}
            </span>
          </span>
        </li>
      ))}
    </ol>
  );
}
