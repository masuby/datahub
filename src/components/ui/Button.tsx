import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { GlassSurface } from "./glass/GlassSurface";
import { glassClasses } from "./glass/glass-classes";

/**
 * The primary action — the only filled shape on the site besides chart marks.
 * Royal liquid glass (owner's brief, 11 Oct 2026: Apple-style glass
 * buttons); hover turns it navy (light) / sky (dark). At most one per
 * viewport (the header CTA excepted). Renders a link when given `href`.
 *
 * The element stays a real <a> (next/link) or <button>, with its label,
 * focus ring and keyboard behaviour; GlassSurface only paints its surface
 * (src/components/ui/glass). `glass` picks what wakes its liquid layer:
 * "zone" — the pointer coming near, for a button inside a [data-glass-zone]
 * (the hero, the closing band); "self" (default) — the pointer over it.
 * Keyboard focus always does.
 */
const primary =
  "inline-flex items-center justify-center gap-2 px-7 font-sans text-base font-semibold " +
  "disabled:cursor-not-allowed disabled:opacity-60 aria-busy:cursor-progress " +
  glassClasses.royal;

const sizes = {
  default: "h-[52px] lg:h-14",
  compact: "h-11 px-5 text-[0.9375rem]",
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
  const surface = <GlassSurface wake={glass} />;
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
 * Secondary action on a <button>: LinkArrow styling, 48px minimum hit area.
 * `active` draws the thread under the label (for a button whose label
 * already says its state, so it must not also carry aria-pressed).
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
      className={cn(
        "group inline-flex min-h-12 items-center gap-2 font-sans text-[0.9375rem] font-semibold text-fg transition-colors duration-[160ms] hover:text-accent",
        className,
      )}
      {...rest}
    >
      <span className="link-thread pb-0.5" data-active={(active ?? rest["aria-pressed"] === true) ? "true" : undefined}>
        {children}
      </span>
      {arrow && (
        <span aria-hidden="true" className="inline-block transition-transform duration-[280ms] group-hover:translate-x-1.5">
          {arrow}
        </span>
      )}
    </button>
  );
}
