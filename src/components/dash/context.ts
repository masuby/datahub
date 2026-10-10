import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Widen } from "@/i18n/dict";
import type { dashExtra } from "@/i18n/extra/dashboards";
import type { Status } from "@/lib/sample-data";

export type DashT = Dictionary["dash"];
export type DashExtra = Widen<(typeof dashExtra)["en"]>;
export type ViewKey = keyof DashT["views"];

/**
 * Everything a dashboard figure needs to render, built once per page on the
 * server. `live` is true on the home page, where the DashboardShowcase island
 * wires up tabs, crosshairs and read mode; on service pages the same figures
 * render as static server HTML with read-mode notes always shown.
 */
export type DashCtx = {
  lang: Locale;
  t: DashT;
  x: DashExtra;
  a11y: Dictionary["a11y"];
  figurePrefix: string;
  /** Unique id prefix for this rendering of the figures ("dh", "sb"). */
  idp: string;
  live: boolean;
  /**
   * Set when a few figures are shown outside the home page's section 02 (a
   * service page's sample band): the figure numbers they show instead
   * ("02.10" -> "03.1"), and which read-mode figures are on the plate, so
   * the notes count 1, 2… on the plate rather than across the whole view.
   */
  plate?: { numbers: Record<string, string>; figures: readonly string[] };
};

export type Note = { n: number; anchor: string; shows: string; decision: string; noteId: string };

/**
 * Read-mode notes of one view that belong to `figure`, numbered across the
 * view — or across the plate, when only some of the view's figures are shown.
 */
export function notesFor(ctx: DashCtx, view: ViewKey, figure: string): Note[] {
  const all = ctx.t.views[view].read as readonly { figure: string; anchor: string; shows: string; decision: string }[];
  const shown = ctx.plate?.figures;
  const read = shown ? all.filter((r) => shown.includes(r.figure)) : all;
  return read.flatMap((r, i) =>
    r.figure === figure
      ? [{ n: i + 1, anchor: r.anchor, shows: r.shows, decision: r.decision, noteId: `${ctx.idp}-${view}-note-${i + 1}` }]
      : [],
  );
}

/** A marker to place on a chart: note number + the data index it points at. */
export type Mark = { n: number; i: number; noteId: string };

export function marksFor(notes: Note[], indexOf: (anchor: string) => number): Mark[] {
  return notes.flatMap((note) => {
    const i = indexOf(note.anchor);
    return i < 0 ? [] : [{ n: note.n, i, noteId: note.noteId }];
  });
}

export const STATUS_GLYPH: Record<Status | "sent" | "awaiting" | "queued", string> = {
  onTarget: "✓",
  done: "✓",
  sent: "✓",
  watch: "△",
  awaiting: "△",
  breach: "✕",
  queued: "○",
};

export const STATUS_TONE: Record<Status | "sent" | "awaiting" | "queued", string> = {
  onTarget: "text-ok",
  done: "text-ok",
  sent: "text-ok",
  watch: "text-warn",
  awaiting: "text-warn",
  breach: "text-error",
  queued: "text-subtle",
};

/** "02.1" -> "Fig. 02.1" / "Kielelezo 02.1" (renumbered on a service page's plate). */
export const figLabel = (ctx: DashCtx, number: string) =>
  `${ctx.t.figPrefix} ${ctx.plate?.numbers[number] ?? number}`;

/** Fixed-decimal number with a dot, for sample values (same in both languages). */
export const dec = (v: number, d = 1) => v.toFixed(d);
