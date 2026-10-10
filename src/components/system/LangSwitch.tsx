"use client";

import { useEffect, useId, useState, type MouseEvent, type FocusEvent, type PointerEvent } from "react";
import { usePathname } from "next/navigation";
import { LANG_TAG, LOCALES, localePath, stripLocale, type Locale } from "@/i18n/config";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

/** The visitor's last explicit language choice. Only a click writes it. */
export const LANG_STORAGE_KEY = "dh-lang";
const HINT_STORAGE_KEY = "dh-lang-hint";

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
 *   variant "short" — `EN | SW` in the header (all breakpoints)
 *   variant "full"  — `Language  English · Kiswahili` in the footer and menu
 *
 * The server-rendered href already points at the equivalent page; on hover,
 * focus and click it is refreshed from the live URL so the current query and
 * hash ride along. The current language carries the thread underline.
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
      className={cn("flex items-center", full ? "flex-wrap gap-x-3" : "gap-0.5", className)}
    >
      {full && (
        <span id={`${id}-legend`} className="t-eyebrow mr-2">
          {labels.legend}
        </span>
      )}
      {LOCALES.map((l, i) => {
        const current = l === lang;
        return (
          <span key={l} className={cn("flex items-center", full ? "gap-3" : "gap-0.5")}>
            {i > 0 && (
              <span aria-hidden="true" className="text-subtle">
                {full ? "·" : "|"}
              </span>
            )}
            <a
              href={localePath(l, base)}
              hrefLang={LANG_TAG[l]}
              aria-current={current ? "true" : undefined}
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
                "inline-flex min-h-11 items-center justify-center transition-colors duration-[160ms]",
                full ? "t-small" : "min-w-8 px-0.5 font-mono text-[0.8125rem] font-medium tracking-[0.04em] min-[360px]:min-w-9 min-[360px]:px-1",
                current ? "text-fg" : "text-muted hover:text-fg",
              )}
            >
              <span lang={LANG_TAG[l]} className="link-thread pb-0.5" data-active={current ? "true" : undefined}>
                {full ? labels[l].name : labels[l].short}
              </span>
              {!current && <span className="sr-only">, {labels[l].switchLabel}</span>}
            </a>
          </span>
        );
      })}
    </div>
  );
}

/**
 * The client half of LangHint: one dismissible line suggesting the other
 * language, written in that language. Renders nothing on the server and on
 * the first client render, then decides from localStorage and the browser
 * language. It overlays the top of the page under the header instead of
 * pushing content down, so it costs no layout shift (§13: CLS < 0.02); it is
 * held to one 44px row so it never covers the content it sits over.
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
    let stored: string | null = null;
    try {
      if (localStorage.getItem(HINT_STORAGE_KEY) === "dismissed") return;
      stored = localStorage.getItem(LANG_STORAGE_KEY);
    } catch {
      return; // no storage: the hint could never stay dismissed, so never show it
    }
    const browserSw = (navigator.languages?.[0] ?? navigator.language ?? "").toLowerCase().startsWith("sw");
    const show = lang === "en" ? stored === "sw" || (stored === null && browserSw) : stored === "en";
    if (!show) return;
    const t = setTimeout(() => setHref(langHref(target)), 0);
    return () => clearTimeout(t);
  }, [lang, target]);

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
    setHref(null);
  };

  // Always exactly one 44px row (plus its hairline), so the overlay never
  // reaches past the smallest top padding it sits over: below 640px only the
  // link shows (it already says the same thing, in the other language);
  // wider, the sentence truncates before it can wrap.
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
            className="group inline-flex shrink-0 items-center gap-1.5 font-semibold text-fg transition-colors duration-[160ms] hover:text-accent"
          >
            <span className="link-thread pb-0.5">{label}</span>
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
