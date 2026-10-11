import type { ReactNode } from "react";
import { getImageProps, type StaticImageData } from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CommittedPicture } from "./CommittedPicture";
import styles from "./home.module.css";

/**
 * Phones: with no rules between the sections any more, space alone sets
 * them apart, so they take a little more of it than Section's compact 24px.
 * From 640px Section's own rhythm applies.
 */
export const HOME_SECTION_Y = "py-7";

/**
 * The opener of a tile section on the home page (iteration-5 §A, §B): the
 * eyebrow-styled label alone, as the section's h2, centred over the centred
 * tiles, with no rule and no thread before it. (The dashboards section has
 * a title of its own and uses SectionHeader.)
 */
export function HomeOpener({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h2 id={id} className="t-eyebrow text-center a-rise" style={{ animationDelay: "120ms" }}>
      {children}
    </h2>
  );
}

export type Tile = {
  key: string;
  href: string;
  /** "01.1" (the services); none for the reasons. */
  index?: string;
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
 * box CSS sizes at every width, so nothing shifts when it arrives. Made only
 * in a render React commits at once (CommittedPicture), so a client-side
 * navigation never leaves one behind, holding its discarded page.
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
    <CommittedPicture>
      <picture>
        <source media="(min-width: 640px)" srcSet={wideSet} width={wide} height={wide} />
        <img {...img} srcSet={narrowSet} alt="" className={className} />
      </picture>
    </CommittedPicture>
  );
}

/**
 * The title with its arrow glued to the last word, so the arrow never wraps
 * onto a line of its own (a centred line holding only "→").
 */
function TitleWithArrow({ title }: { title: string }) {
  const cut = title.lastIndexOf(" ") + 1;
  return (
    <>
      {title.slice(0, cut)}
      <span className="whitespace-nowrap">
        {title.slice(cut)}
        <span aria-hidden="true" className={styles.arrow}>
          →
        </span>
      </span>
    </>
  );
}

/**
 * Three tiles, each centred — the picture on top, then the title and its
 * one line (iteration-5 §B): side by side from 640px, divided by vertical
 * hairlines and sharing their rows, so the lines start level even when one
 * title wraps; on phones stacked, with space between them (layout and
 * states in home.module.css). Each tile is one link — the whole tile is the
 * hit area — holding its <h3>, so the link's name is the title and the
 * line. The pictures, the index (01.1–01.3 for the services, shown from
 * 640px) and the arrow are decorative and hidden from it, so the name is
 * the same at every width.
 *
 * `ordered` for a numbered sequence (the services, 01.1–01.3): an <ol>.
 *
 * Pictures: see TileImage. Icons are 72px on phones, 88px on tablets and
 * 104px from 1024px (the 2x candidates, 256px, stay sharp at all three);
 * avatars 44px, 60px and 72px.
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
                    <TileImage key={j} src={src} narrow={44} wide={72} className={styles.avatar} />
                  ))}
                </span>
              ) : (
                tile.icon && <TileImage src={tile.icon} narrow={72} wide={104} className={styles.icon} />
              )}
            </span>
            {tile.index && (
              <span aria-hidden="true" className={cn("t-eyebrow", styles.index)}>
                {tile.index}
              </span>
            )}
            <h3 className={cn("t-title", styles.title)}>
              <TitleWithArrow title={tile.title} />
            </h3>
            <span className={cn("t-body", styles.line)}>{tile.line}</span>
          </Link>
        </li>
      ))}
    </List>
  );
}
