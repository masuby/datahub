import type { ReactNode } from "react";
import { getImageProps, type StaticImageData } from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import styles from "./home.module.css";

/**
 * Phones: with no rules between the sections any more, space alone sets
 * them apart, so they take a little more of it than Section's compact 24px.
 * From 640px Section's own rhythm applies.
 */
export const HOME_SECTION_Y = "py-7";

/**
 * The opener of a home section in the new rhythm (iteration-3 §C): no rule
 * across the page, only a short thread that draws from the left (the brand
 * thread that starts every R2) and the eyebrow-styled label beside it — the
 * section's h2 for the tile rows, a <p> where the section has a title of its
 * own (the dashboard teaser). `aside` sits on the same line, right-aligned
 * ("All services →").
 */
export function HomeOpener({
  id,
  as: Tag = "h2",
  aside,
  children,
}: {
  id?: string;
  as?: "h2" | "p";
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    // With a link beside it the line is the link's 48px tall; alone, only the label's.
    <div className={cn("flex flex-wrap items-center justify-between gap-x-6", aside && "min-h-12")}>
      <Tag id={id} className="t-eyebrow flex items-center gap-3 a-rise" style={{ animationDelay: "120ms" }}>
        <span aria-hidden="true" className="thread a-draw-x w-8 shrink-0" />
        {children}
      </Tag>
      {aside && (
        <div className="a-fade" style={{ animationDelay: "180ms" }}>
          {aside}
        </div>
      )}
    </div>
  );
}

export type Tile = {
  key: string;
  href: string;
  /** "01.1", or the linked page's chapter number. */
  index: string;
  title: string;
  /** The one line under the title. */
  line: string;
  /** A 3D icon (`icon`) or the team's overlapping portraits (`avatars`). */
  icon?: StaticImageData;
  avatars?: readonly StaticImageData[];
};

/**
 * A tile picture at two intrinsic sizes — `narrow` px on phones, `wide` px
 * from 640px — each with its 1x and 2x candidates from next/image's
 * optimiser (getImageProps), art-directed by <picture>: a phone never
 * downloads the desktop size, and the HTML carries two short srcsets rather
 * than the long `sizes` list. Lazy, decorative (alt=""), and drawn into a
 * box CSS sizes at every width, so nothing shifts when it arrives.
 */
function TileImage({
  src,
  narrow,
  wide,
  className,
}: {
  src: StaticImageData;
  narrow: number;
  wide: number;
  className: string;
}) {
  const {
    props: { srcSet: wideSet },
  } = getImageProps({ src, alt: "", width: wide, height: wide });
  const {
    props: { srcSet: narrowSet, ...img },
  } = getImageProps({ src, alt: "", width: narrow, height: narrow });
  return (
    <picture>
      <source media="(min-width: 640px)" srcSet={wideSet} width={wide} height={wide} />
      <img {...img} srcSet={narrowSet} alt="" className={className} />
    </picture>
  );
}

/**
 * Three tiles side by side, divided by vertical hairlines; on phones, rows
 * with space between them (layout and states in home.module.css). Each tile
 * is one link — the whole tile is the hit area — holding its <h3>, so the
 * link's name is the title and the line. The pictures and the index (a
 * chapter number, shown from 640px) are decorative and hidden from it, so
 * the name is the same at every width.
 *
 * `ordered` for a numbered sequence (the services, 01.1–01.3): an <ol>.
 *
 * Pictures: see TileImage. Icons are 56px on phones, 80px on tablets and
 * 96px from 1024px; avatars 28px, 52px and 64px.
 */
export function HomeTiles({ tiles, ordered = false }: { tiles: readonly Tile[]; ordered?: boolean }) {
  const List = ordered ? "ol" : "ul";
  return (
    <List role="list" className={cn(styles.tiles, "mt-5 sm:mt-8")}>
      {tiles.map((tile, i) => (
        <li key={tile.key} className={cn(styles.tile, "a-rise")} style={{ animationDelay: `${180 + i * 60}ms` }}>
          <Link href={tile.href} className={styles.link}>
            <span aria-hidden="true" className={cn(styles.visual, tile.avatars && styles.avatarsVisual)}>
              {tile.avatars ? (
                <span className={styles.avatars}>
                  {tile.avatars.map((src, j) => (
                    <TileImage key={j} src={src} narrow={28} wide={64} className={styles.avatar} />
                  ))}
                </span>
              ) : (
                tile.icon && <TileImage src={tile.icon} narrow={56} wide={96} className={styles.icon} />
              )}
            </span>
            <span aria-hidden="true" className={cn("t-eyebrow", styles.index)}>
              {tile.index}
            </span>
            <h3 className={cn("t-title", styles.title)}>
              <span className={styles.titleText}>{tile.title}</span>
            </h3>
            <span className={cn("t-body", styles.line)}>{tile.line}</span>
            <span aria-hidden="true" className={styles.arrow}>
              →
            </span>
          </Link>
        </li>
      ))}
    </List>
  );
}
