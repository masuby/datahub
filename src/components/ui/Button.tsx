import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { GlassSurface } from "./glass/GlassSurface";
import { glassClasses } from "./glass/glass-classes";

/**
 * The primary action — the only filled shape on the site besides chart marks.
 * Liquid-metal glass, like the hero's hand (iteration 5 §E): a deep royal
 * glass pill inside a chrome ring that slowly turns; hover brightens the
 * ring. A 14px semibold display-face label, so the pill stays 44px (40px
 * compact, the header and the action rail). At most one per viewport (the
 * header CTA excepted). Renders a link when given `href`.
 *
 * The element stays a real <a> (next/link) or <button>, with its label,
 * focus ring and keyboard behaviour; GlassSurface only paints its surface
 * and metal (src/components/ui/glass). `glass` picks what wakes its liquid
 * layer: "zone" — the pointer coming near, for a button inside a
 * [data-glass-zone] (the hero); "self" (default) — the pointer over it.
 * Keyboard focus always does.
 */
const primary =
  "inline-flex items-center justify-center gap-2 px-6 font-display text-sm font-semibold tracking-[0.01em] " +
  "disabled:cursor-not-allowed disabled:opacity-60 aria-busy:cursor-progress " +
  glassClasses.royal;

const sizes = {
  default: "h-11",
  compact: "h-10 px-5",
};

type Common = { children: ReactNode; size?: keyof typeof sizes; className?: string; glass?: "zone" | "self" };

export function ButtonPrimary(
  props: Common &
    (
      | ({ href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children">)
      | ({ href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">)
    ),
) {
  const { children, size = "default", className, glass = "self", ...rest } = props;
  const classes = cn(primary, sizes[size], className);
  const surface = <GlassSurface wake={glass} metal />;
  if ("href" in rest && rest.href !== undefined) {
    const { href, ...anchor } = rest;
    if (href.startsWith("#") || /^(https?:|mailto:|tel:)/.test(href)) {
      return (
        <a href={href} className={classes} {...anchor}>
          {surface}
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...anchor}>
        {surface}
        {children}
      </Link>
    );
  }
  const button = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type={button.type ?? "button"} className={classes} {...button}>
      {surface}
      {children}
    </button>
  );
}

/**
 * Secondary action on a <button>: LinkArrow styling (a display-face label),
 * 48px minimum hit area.
 * `active` (or aria-pressed) holds the label in the accent colour, as hover
 * does — no underline (iteration-5 §A). Use `active` for a button whose
 * label already says its state, so it must not also carry aria-pressed.
 */
export function ButtonText({
  children,
  arrow,
  active,
  className,
  ...rest
}: {
  children: ReactNode;
  arrow?: "→" | "↓" | "";
  active?: boolean;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">) {
  return (
    <button
      type={rest.type ?? "button"}
      data-active={(active ?? rest["aria-pressed"] === true) ? "true" : undefined}
      className={cn(
        "group inline-flex min-h-12 items-center gap-2 font-display text-sm font-semibold tracking-[0.01em] text-fg transition-colors duration-[160ms] hover:text-accent focus-visible:text-accent data-[active=true]:text-accent",
        className,
      )}
      {...rest}
    >
      <span>{children}</span>
      {arrow && (
        <span aria-hidden="true" className="inline-block transition-transform duration-[280ms] group-hover:translate-x-1.5">
          {arrow}
        </span>
      )}
    </button>
  );
}
