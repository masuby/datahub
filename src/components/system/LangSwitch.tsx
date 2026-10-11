"use client";

import {
  useEffect,
  useId,
  useState,
  useSyncExternalStore,
  type MouseEvent,
  type FocusEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { LANG_TAG, LOCALES, localePath, stripLocale, type Locale } from "@/i18n/config";
import { Container } from "@/components/ui/Container";
import { NavPill } from "@/components/ui/glass/NavPill";
import { glassClasses } from "@/components/ui/glass/glass-classes";
import { cn } from "@/lib/utils";
import { HINT_FLAG, HINT_STORAGE_KEY, LANG_STORAGE_KEY } from "./lang-hint";

/**
 * The same page in another language, keeping the query string and hash, read
 * from the address bar at the moment of use so `?ref=whatsapp` survives the
 * switch and attribution keeps working.
 */
export function langHref(target: Locale): string {
  const { pathname, search, hash } = window.location;
  return `${localePath(target, stripLocale(pathname))}${search}${hash}`;
}

function remember(target: Locale) {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, target);
  } catch {
    /* storage blocked: the switch still works, it just is not remembered */
  }
}

type LangLabels = {
  legend: string;
  en: { short: string; name: string; switchLabel: string };
  sw: { short: string; name: string; switchLabel: string };
};

/**
 * Language switch: real `<a href hreflang>` links, full navigation, no
 * automatic redirects.
 *
 *   variant "short" — `EN SW` in the header (all breakpoints)
 *   variant "full"  — `Language  English · Kiswahili` in the menu
 *
 * The server-rendered href already points at the equivalent page; on hover,
 * focus and click it is refreshed from the live URL so the current query and
 * hash ride along. The current language is announced with aria-current and
 * never underlined (iteration-5 §A). In the header it sits in a small sky
 * glass pill, navy and bold, and the other shows a clear-glass pill on hover,
 * like the nav beside it (iteration 5b §K): each pill is 28px tall, its tap
 * area 44px. In the menu it is marked by colour and weight (the text
 * colour, bold; the other muted).
 */
export function LangSwitch({
  lang,
  labels,
  variant = "short",
  className,
}: {
  lang: Locale;
  labels: LangLabels;
  variant?: "short" | "full";
  className?: string;
}) {
  // usePathname may report the internal /en rewrite on the server and the
  // public path in the browser; stripLocale makes both give the same href.
  const base = stripLocale(usePathname() ?? "/");
  const id = useId();
  const full = variant === "full";

  const refresh = (target: Locale) => (e: MouseEvent<HTMLAnchorElement> | FocusEvent<HTMLAnchorElement> | PointerEvent<HTMLAnchorElement>) => {
    e.currentTarget.href = langHref(target);
  };

  return (
    <div
      role="group"
      aria-label={full ? undefined : labels.legend}
      aria-labelledby={full ? `${id}-legend` : undefined}
      className={cn("flex items-center", full ? "flex-wrap gap-x-3" : "gap-1 min-[360px]:gap-1.5", className)}
    >
      {full && (
        <span id={`${id}-legend`} className="t-eyebrow mr-2">
          {labels.legend}
        </span>
      )}
      {LOCALES.map((l, i) => {
        const current = l === lang;
        return (
          <span key={l} className={cn("flex items-center", full && "gap-3")}>
            {full && i > 0 && (
              <span aria-hidden="true" className="text-subtle">
                ·
              </span>
            )}
            <a
              href={localePath(l, base)}
              hrefLang={LANG_TAG[l]}
              aria-current={current ? "true" : undefined}
              data-active={!full && current ? "true" : undefined}
              onPointerEnter={current ? undefined : refresh(l)}
              onFocus={current ? undefined : refresh(l)}
              onClick={(e) => {
                if (current) {
                  e.preventDefault();
                  return;
                }
                e.currentTarget.href = langHref(l);
                remember(l);
              }}
              className={cn(
                "inline-flex items-center justify-center",
                full
                  ? cn(
                      "t-small min-h-11 transition-colors duration-[160ms]",
                      current ? "font-bold text-fg" : "font-normal text-muted hover:text-fg",
                    )
                  : cn(
                      glassClasses.nav,
                      "h-7 min-w-9 px-2 font-mono text-[0.8125rem] tracking-[0.04em] max-[359px]:min-w-8 max-[359px]:px-1.5",
                      current ? "font-bold" : "font-normal",
                    ),
              )}
            >
              {!full && <NavPill />}
              <span lang={LANG_TAG[l]}>{full ? labels[l].name : labels[l].short}</span>
              {!current && <span className="sr-only">, {labels[l].switchLabel}</span>}
            </a>
          </span>
        );
      })}
    </div>
  );
}

const subscribeNothing = () => () => {};

/**
 * Its children in the server HTML (and while that HTML hydrates), nothing
 * after. For LangHint's pre-paint script: it has done its work by the time
 * React runs, and a <script> React creates on a later page change would
 * never run anyway (React warns about it in development).
 */
export function FirstLoadOnly({ children }: { children: ReactNode }) {
  const fromServer = useSyncExternalStore(
    subscribeNothing,
    () => false,
    () => true,
  );
  return fromServer ? children : null;
}

/**
 * The client half of LangHint: one dismissible line suggesting the other
 * language, written in that language. Renders nothing on the server and on
 * the first client render, then shows if LangHint's pre-paint script marked
 * <html> (HINT_FLAG; the decision itself is in lang-hint.ts). It overlays
 * the top of the page under the header instead of pushing content down, so
 * it costs no layout shift (§13: CLS < 0.02): that flag has already widened
 * the first section's top padding by the line's 45px (globals.css), so it
 * never covers the content it sits over. Dismissing it clears the flag, and
 * the room closes with it (a shift the visitor asked for).
 */
export function LangHintLine({
  lang,
  text,
  linkText,
  dismissLabel,
}: {
  lang: Locale;
  text: string;
  linkText: string;
  dismissLabel: string;
}) {
  const target: Locale = lang === "en" ? "sw" : "en";
  const [href, setHref] = useState<string | null>(null);

  useEffect(() => {
    if (!document.documentElement.hasAttribute(HINT_FLAG)) return;
    const t = setTimeout(() => setHref(langHref(target)), 0);
    return () => clearTimeout(t);
  }, [target]);

  if (!href) return null;

  // The dictionary string ends in a typographic arrow; it is drawn
  // separately so screen readers do not announce it.
  const label = linkText.replace(/\s*→\s*$/, "");

  const dismiss = () => {
    try {
      localStorage.setItem(HINT_STORAGE_KEY, "dismissed");
    } catch {
      /* ignore */
    }
    document.documentElement.removeAttribute(HINT_FLAG);
    setHref(null);
  };

  // Always exactly one 44px row (plus its hairline): the 45px the flag makes
  // room for. Below 640px only the link shows (it already says the same
  // thing, in the other language); wider, the sentence truncates before it
  // can wrap.
  return (
    <div className="lang-hint absolute inset-x-0 z-30 bg-bg" style={{ top: "var(--header-h)" }}>
      <Container className="flex h-11 items-center gap-3">
        <p className="t-small flex min-w-0 flex-1 items-center gap-1.5 whitespace-nowrap text-muted" lang={LANG_TAG[target]}>
          <span className="hidden min-w-0 truncate sm:block">{text}</span>
          <a
            href={href}
            hrefLang={LANG_TAG[target]}
            onClick={(e) => {
              e.currentTarget.href = langHref(target);
              remember(target);
            }}
            className="group inline-flex shrink-0 items-center gap-1.5 font-bold text-fg transition-colors duration-[160ms] hover:text-accent"
          >
            <span>{label}</span>
            <span aria-hidden="true" className="inline-block transition-transform duration-[280ms] group-hover:translate-x-1">
              →
            </span>
          </a>
        </p>
        <button
          type="button"
          aria-label={dismissLabel}
          onClick={dismiss}
          className="-mr-3 inline-grid size-11 shrink-0 place-items-center text-lg leading-none text-muted transition-colors duration-[160ms] hover:text-fg"
        >
          <span aria-hidden="true">×</span>
        </button>
      </Container>
      <span aria-hidden="true" className="rule-hair" />
    </div>
  );
}
