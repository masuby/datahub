import Image, { type StaticImageData } from "next/image";
import type { ServiceSlug } from "@/lib/service-slugs";
import { cn } from "@/lib/utils";
import { CommittedPicture } from "./home/CommittedPicture";
import { SERVICE_ICON } from "./home/home-art";
import styles from "./ServiceIcon.module.css";

/**
 * A service's 3D icon (iteration-5 §D): the same picture the home page's
 * tiles show for it, from SERVICE_ICON. Decorative (alt=""): the title next
 * to it says what it is. Served by next/image at `size` CSS px (1x and 2x);
 * the width and height reserve its box, so nothing shifts while it loads.
 * A soft brand glow (drop-shadow, tuned per theme) lifts it off the page.
 * Made only in a render React commits at once (CommittedPicture: a srcset
 * image in a discarded render would hold that whole render alive).
 *
 * A slug with no icon renders nothing; the callers' layouts stand without it.
 */
export function ServiceIcon({
  slug,
  size,
  eager = false,
  className,
}: {
  slug: ServiceSlug;
  /** Intrinsic size in CSS px; CSS may draw it smaller on phones. */
  size: number;
  /** Above the fold (the head of /services): load at once, it can be the LCP. */
  eager?: boolean;
  className?: string;
}) {
  const src: StaticImageData | undefined = SERVICE_ICON[slug];
  if (!src) return null;
  return (
    <CommittedPicture>
      <Image
        src={src}
        alt=""
        width={size}
        height={size}
        loading={eager ? "eager" : "lazy"}
        className={cn(styles.icon, className)}
      />
    </CommittedPicture>
  );
}
