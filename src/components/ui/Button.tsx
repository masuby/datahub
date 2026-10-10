import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The primary action — the only filled shape on the site besides chart marks.
 * Royal pill; hover fills navy (light) / sky (dark). At most one per viewport
 * (the header CTA excepted). Renders a link when given `href`.
 */
const primary =
  "inline-flex items-center justify-center gap-2 rounded-full bg-action px-7 font-sans text-base font-semibold text-on-action " +
  "transition-colors duration-[160ms] hover:bg-action-hover hover:text-on-action-hover " +
  "disabled:cursor-not-allowed aria-busy:cursor-progress";

const sizes = {
  default: "h-[52px] lg:h-14",
  compact: "h-11 px-5 text-[0.9375rem]",
};

type Common = { children: ReactNode; size?: keyof typeof sizes; className?: string };

export function ButtonPrimary(
  props: Common &
    (
      | ({ href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children">)
      | ({ href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">)
    ),
) {
  const { children, size = "default", className, ...rest } = props;
  const classes = cn(primary, sizes[size], className);
  if ("href" in rest && rest.href !== undefined) {
    const { href, ...anchor } = rest;
    if (href.startsWith("#") || /^(https?:|mailto:|tel:)/.test(href)) {
      return (
        <a href={href} className={classes} {...anchor}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...anchor}>
        {children}
      </Link>
    );
  }
  const button = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type={button.type ?? "button"} className={classes} {...button}>
      {children}
    </button>
  );
}

/**
 * Secondary action on a <button>: LinkArrow styling, 48px minimum hit area.
 */
export function ButtonText({
  children,
  arrow,
  className,
  ...rest
}: {
  children: ReactNode;
  arrow?: "→" | "↓" | "";
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
      <span className="link-thread pb-0.5" data-active={rest["aria-pressed"] === true ? "true" : undefined}>
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
