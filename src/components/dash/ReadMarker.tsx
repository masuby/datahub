import { cn } from "@/lib/utils";
import type { DashCtx, Note } from "./context";
import styles from "./dash.module.css";

/**
 * Read mode (spec §10.1), always on in the sample bands: a numbered 24px
 * ring placed at a data coordinate, a plain numeral that points at the note
 * of the same number beside or under the chart. Decorative: screen readers
 * get the notes themselves, as a list.
 *
 * `left` is a percentage of the chart width; `top` is px (or % with `topPct`).
 * Hover linking with the note is pure CSS (:has) in dash.module.css.
 */
export function ReadMarker({
  n,
  order = 0,
  left,
  top,
  topPct = false,
  inline = false,
}: {
  n: number;
  order?: number;
  left?: number;
  top?: number;
  topPct?: boolean;
  inline?: boolean;
}) {
  const style = {
    ...(inline ? null : { left: `${left}%`, top: topPct ? `${top}%` : `${top}px` }),
    ["--i" as string]: order,
  };
  return (
    <span className={cn(styles.marker, inline && styles.markerInline)} style={style} data-m={n} aria-hidden="true">
      {n}
    </span>
  );
}

/** The numbered notes of one figure: what it shows, and the decision it supports. */
export function ReadNotes({ ctx, notes }: { ctx: DashCtx; notes: Note[] }) {
  if (notes.length === 0) return null;
  return (
    <ol className={styles.notes} aria-label={ctx.t.read.listLabel}>
      {notes.map((note) => (
        <li key={note.n} id={note.noteId} className={styles.note} data-n={note.n}>
          <span className={styles.noteNum} aria-hidden="true">
            {note.n}
          </span>
          <span className="min-w-0">
            <span className="t-small block font-bold text-fg">{note.shows}</span>
            <span className="t-small mt-1 block text-muted">
              <span className="font-bold text-subtle">{ctx.t.read.decisionPrefix} </span>
              {note.decision}
            </span>
          </span>
        </li>
      ))}
    </ol>
  );
}
