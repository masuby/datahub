import type { AnchorHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Secondary action: a standalone text link with a typographic arrow, its
 * label set like the primary button's (the display face, 14px semibold:
 * a UI label, iteration-5 §F). No underline (iteration-5 §A): hover and
 * focus turn it accent and nudge the arrow. For a link inside a sentence use a plain link with `.link-inline`
 * (globals.css) instead. Internal hrefs use next/link; external ones open in
 * a new tab with an announced suffix.
 */
export function LinkArrow({
  href,
  children,
  arrow = "→",
  external = false,
  newTabLabel,
  className,
  ...rest
}: {
  href: string;
  children: ReactNode;
  /** "→" for navigation, "↓" for in-page jumps, "↗" for external. */
  arrow?: "→" | "↓" | "↗" | "";
  external?: boolean;
  /** Screen-reader suffix for external links, e.g. "(opens in a new tab)". */
  newTabLabel?: string;
  className?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "children" | "className">) {
  const classes = cn(
    "group inline-flex min-h-12 items-center gap-2 font-display text-sm font-semibold tracking-[0.01em] text-fg transition-colors duration-[160ms] hover:text-accent focus-visible:text-accent",
    className,
  );
  const inner = (
    <>
      <span>{children}</span>
      {arrow && (
        <span
          aria-hidden="true"
          className="inline-block transition-transform duration-[280ms] ease-[var(--ease-silk)] group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5"
        >
          {arrow}
        </span>
      )}
      {external && newTabLabel && <span className="sr-only"> {newTabLabel}</span>}
    </>
  );

  if (external || /^(https?:|mailto:|tel:)/.test(href)) {
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...rest}
      >
        {inner}
      </a>
    );
  }
  if (href.startsWith("#")) {
    return (
      <a href={href} className={classes} {...rest}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {inner}
    </Link>
  );
}
