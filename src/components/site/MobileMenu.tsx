"use client";

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { BrandLockup } from "@/components/brand/BrandMark";
import { ButtonPrimary } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { cn } from "@/lib/utils";
import { landOnSection, scrollToSection } from "@/lib/scroll-to-section";

/*
 * Client islands of the site chrome: the header shell (scroll state, progress
 * thread, active section, in-page links that keep the query string), the
 * mobile menu sheet, and the mobile action rail. They share one signal — the
 * menu being open — published as <html data-menu="open"> plus an event.
 */

const MENU_EVENT = "dh-menu-change";
const SECTION_IDS = ["services", "dashboards", "estimator", "process", "security", "team", "faq", "contact"] as const;
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** True until the first page of this document has handled its URL fragment. */
let documentArrival = true;

function menuIsOpen(): boolean {
  return document.documentElement.dataset.menu === "open";
}

/**
 * Moves keyboard focus to a section reached by an in-page link, so the next
 * Tab continues inside it and screen readers land there too. The section's
 * heading (its aria-labelledby target, else its first h1/h2) takes focus
 * rather than the section itself, whose focus outline would draw a box. A
 * heading is not a control, so it gets tabindex=-1 and no outline.
 */
function focusSection(section: HTMLElement) {
  const labelId = section.getAttribute("aria-labelledby")?.split(/\s+/)[0];
  const el =
    (labelId ? document.getElementById(labelId) : null) ??
    section.querySelector<HTMLElement>("h1, h2") ??
    section;
  if (!el.matches(FOCUSABLE) && !el.hasAttribute("tabindex")) {
    el.setAttribute("tabindex", "-1");
    el.style.outline = "none";
  }
  el.focus({ preventScroll: true });
}

/* ───────────────────────── Header shell ───────────────────────── */

/**
 * The sticky <header>. Transparent at the top of the page; from 8px of scroll
 * it takes the header surface and an R1 bottom hairline. A 2px thread on that
 * hairline shows reading progress (one passive, rAF-throttled listener). The
 * nav link of the section in view gets `data-active` (an in-page position,
 * so not aria-current).
 *
 * It also makes every `a[data-hash-link]` that points at a section of the
 * current page scroll there without a navigation, so `?ref=` stays in the
 * address bar (a plain `/#contact` would drop it).
 */
export function HeaderShell({ children, progressLabel }: { children: ReactNode; progressLabel: string }) {
  const ref = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [scrolled, setScrolled] = useState(false);

  // Scroll state and progress.
  useEffect(() => {
    let raf = 0;
    let lastPct = -1;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y >= 8);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      const bar = barRef.current;
      if (bar) {
        bar.style.transform = `scaleX(${p.toFixed(4)})`;
        const pct = Math.round(p * 100);
        if (pct !== lastPct) {
          bar.setAttribute("aria-valuenow", String(pct));
          lastPct = pct;
        }
      }
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  // Active section: the one crossing a thin band about a third down the viewport.
  useEffect(() => {
    const header = ref.current;
    if (!header || typeof IntersectionObserver === "undefined") return;
    const links = Array.from(header.querySelectorAll<HTMLElement>("[data-nav]"));
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (!links.length || !sections.length) return;
    const inBand = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) inBand.add(e.target.id);
          else inBand.delete(e.target.id);
        }
        const active = SECTION_IDS.find((id) => inBand.has(id));
        for (const a of links) {
          if (a.dataset.nav === active) a.setAttribute("data-active", "true");
          else a.removeAttribute("data-active");
        }
      },
      { rootMargin: "-35% 0px -60% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Arriving with a section in the URL — /#contact from a service page, a
  // shared link, a reload — the browser's or the router's own fragment
  // scroll aims at placeholder heights (see scroll-to-section.ts), so land
  // on it once the page is up. Not on a back/forward load, where the
  // browser restores the visitor's own position.
  const pathname = usePathname();
  useEffect(() => {
    const first = documentArrival;
    documentArrival = false;
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (first && nav?.type === "back_forward") return;
    const target = document.getElementById(decodeURIComponent(hash));
    if (target) landOnSection(target);
  }, [pathname]);

  // Same-page section links keep the query string. Capture phase, so it runs
  // before next/link's handler (which then sees defaultPrevented and stands down).
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[data-hash-link]");
      if (!(a instanceof HTMLAnchorElement) || !a.hash) return;
      if (a.origin !== window.location.origin || a.pathname !== window.location.pathname) return;
      const target = document.getElementById(decodeURIComponent(a.hash.slice(1)));
      if (!target) return;
      e.preventDefault();
      const url = `${window.location.pathname}${window.location.search}${a.hash}`;
      if (`${window.location.pathname}${window.location.search}${window.location.hash}` !== url) {
        history.pushState(history.state, "", url);
      }
      // After this click's other handlers (e.g. the menu closing and
      // unlocking the page) have run. scrollToSection lands exactly even
      // past deferred sections. Then focus follows the jump, as a native
      // fragment link would move it.
      setTimeout(() => {
        scrollToSection(target);
        focusSection(target);
      }, 0);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return (
    <header
      ref={ref}
      data-scrolled={scrolled ? "true" : undefined}
      className={cn(
        "sticky top-0 z-40 transition-colors duration-[160ms]",
        scrolled ? "bg-[var(--header-bg)]" : "bg-transparent",
      )}
    >
      {children}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-rule transition-opacity duration-[160ms]"
        style={{ opacity: scrolled ? 1 : 0 }}
      />
      <span
        ref={barRef}
        role="progressbar"
        aria-label={progressLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={0}
        className="thread pointer-events-none absolute inset-x-0 bottom-0"
        style={{ transform: "scaleX(0)" }}
      />
    </header>
  );
}

/* ───────────────────────── Mobile menu ───────────────────────── */

export type MenuItem = { href: string; label: string; index: string };

/**
 * "Menu" text button (below 1024px) that opens a full-screen sheet: links in
 * Outfit 2rem numbered 01–08, separated by R1, each a full-row 56px target;
 * then the primary action, WhatsApp, and the language and theme preferences
 * (passed in as `children`).
 *
 * While open: focus is trapped in the sheet, everything else on the page is
 * `inert`, the page does not scroll, and Esc or Close returns focus to the
 * Menu button. Following a link closes it and lets the page scroll there.
 */
export function MobileMenu({
  labels,
  items,
  ctaHref,
  whatsappHref,
  newTabLabel,
  children,
}: {
  labels: { open: string; close: string; dialog: string; nav: string; cta: string; whatsapp: string; preferences: string };
  items: MenuItem[];
  ctaHref: string;
  /** Empty when no WhatsApp number is configured: the link is not rendered. */
  whatsappHref: string;
  newTabLabel: string;
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const inerted = useRef<HTMLElement[]>([]);
  const restoreFocus = useRef(true);
  const sheetId = useId();

  const unlock = useCallback(() => {
    const root = document.documentElement;
    if (root.dataset.menu !== "open") return;
    delete root.dataset.menu;
    root.style.overflow = "";
    inerted.current.forEach((el) => (el.inert = false));
    inerted.current = [];
    window.dispatchEvent(new Event(MENU_EVENT));
  }, []);

  const lock = useCallback(() => {
    const sheet = sheetRef.current;
    if (!sheet) return;
    const root = document.documentElement;
    root.dataset.menu = "open";
    root.style.overflow = "hidden";
    inerted.current = Array.from(document.body.children).filter(
      (el): el is HTMLElement =>
        el instanceof HTMLElement &&
        el !== sheet &&
        !el.inert &&
        // The action rail hides itself while the menu is open (and manages its own inert).
        !el.classList.contains("action-rail") &&
        !/^(SCRIPT|STYLE|TEMPLATE|LINK|NEXT-ROUTE-ANNOUNCER)$/.test(el.tagName),
    );
    inerted.current.forEach((el) => (el.inert = true));
    window.dispatchEvent(new Event(MENU_EVENT));
  }, []);

  const close = useCallback((restore: boolean) => {
    restoreFocus.current = restore;
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const button = buttonRef.current;
    restoreFocus.current = true;
    lock();
    sheetRef.current?.querySelector<HTMLElement>("[data-menu-close]")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close(true);
        return;
      }
      if (e.key !== "Tab" || !sheetRef.current) return;
      const f = Array.from(sheetRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || !sheetRef.current.contains(document.activeElement))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (document.activeElement === last || !sheetRef.current.contains(document.activeElement))) {
        e.preventDefault();
        first.focus();
      }
    };
    // The sheet only exists below 1024px; widening the window closes it.
    const wide = window.matchMedia("(min-width: 1024px)");
    const onWide = () => {
      if (wide.matches) close(false);
    };
    document.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      document.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
      unlock();
      if (restoreFocus.current) button?.focus();
    };
  }, [open, lock, unlock, close]);

  // Following a link: release the page first so the scroll can land.
  const onNavigate = () => {
    unlock();
    close(false);
  };

  const sheet = (
    <div
      ref={sheetRef}
      id={sheetId}
      role="dialog"
      aria-modal="true"
      aria-label={labels.dialog}
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto overscroll-contain bg-elev text-fg lg:hidden"
    >
      <Container className="flex h-[var(--header-h)] shrink-0 items-center justify-between gap-4">
        <BrandLockup markClassName="h-6 w-6" wordClassName="text-[1.2rem]" />
        <button
          type="button"
          data-menu-close
          onClick={() => close(true)}
          className="t-small -mr-1 inline-flex min-h-11 items-center px-1 font-semibold text-fg"
        >
          <span className="link-thread pb-0.5">{labels.close}</span>
        </button>
      </Container>
      <span aria-hidden="true" className="rule-hair shrink-0" />

      <Container className="flex flex-1 flex-col pb-[calc(2.5rem+env(safe-area-inset-bottom))]">
        <nav aria-label={labels.nav}>
          <ol>
            {items.map((it, i) => (
              <li key={it.href}>
                {i > 0 && <span aria-hidden="true" className="rule-hair" />}
                <a
                  href={it.href}
                  data-hash-link
                  onClick={onNavigate}
                  className="group flex min-h-14 items-baseline gap-4 py-3"
                >
                  <span className="t-mono w-6 shrink-0 text-subtle tnum">{it.index}</span>
                  <span className="font-display text-[2rem] font-medium leading-[1.15] tracking-[-0.02em] transition-colors duration-[160ms] group-hover:text-accent">
                    {it.label}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <span aria-hidden="true" className="rule-hair" />

        <div className="mt-8 flex flex-col items-start gap-2">
          <ButtonPrimary href={ctaHref} data-hash-link onClick={onNavigate} className="w-full sm:w-auto">
            {labels.cta}
          </ButtonPrimary>
          {whatsappHref && (
            <LinkArrow href={whatsappHref} external newTabLabel={newTabLabel} arrow="↗">
              {labels.whatsapp}
            </LinkArrow>
          )}
        </div>

        {children && (
          <div className="mt-10">
            <p className="t-eyebrow">{labels.preferences}</p>
            <span aria-hidden="true" className="rule-hair mt-3" />
            <div className="mt-2 flex flex-col gap-1">{children}</div>
          </div>
        )}
      </Container>
    </div>
  );

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? sheetId : undefined}
        onClick={() => setOpen(true)}
        className="t-small -mr-1 inline-flex min-h-11 items-center px-1 font-semibold text-fg sm:px-2 lg:hidden"
      >
        <span className="link-thread pb-0.5">{labels.open}</span>
      </button>
      {open && createPortal(sheet, document.body)}
    </>
  );
}

/* ───────────────────────── Action rail ───────────────────────── */

/**
 * Mobile-only fixed bottom rail: WhatsApp (glyph + word) and the primary
 * action. It slides in once the hero's call to action has scrolled away and
 * steps aside while the contact section is on screen, while a text field has
 * focus (the keyboard is up), and while the menu is open. Hidden, it is
 * `inert`, so it never takes focus. Without a WhatsApp number the action
 * takes the full width.
 */
export function ActionRailBar({
  label,
  whatsappLabel,
  whatsappHref,
  newTabLabel,
  ctaLabel,
  ctaShortLabel,
  ctaHref,
}: {
  label: string;
  whatsappLabel: string;
  whatsappHref: string;
  newTabLabel: string;
  ctaLabel: string;
  /** Shown instead of ctaLabel below 360px, where the full label cannot fit on one line. */
  ctaShortLabel: string;
  ctaHref: string;
}) {
  const [past, setPast] = useState(false);
  const [atContact, setAtContact] = useState(false);
  const [typing, setTyping] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    // The hero CTA (#hero-cta, or anything marked data-rail-anchor); elsewhere
    // the first block of <main> (a service page's opening) stands in for it.
    const anchor = document.querySelector("[data-rail-anchor], #hero-cta") ?? document.querySelector("#main > *");
    const timer = setTimeout(() => {
      if (!anchor || typeof IntersectionObserver === "undefined") setPast(true);
    }, 0);
    if (anchor && typeof IntersectionObserver !== "undefined") {
      const io = new IntersectionObserver(([e]) => {
        setPast(!e.isIntersecting && e.boundingClientRect.top < 0);
      });
      io.observe(anchor);
      observers.push(io);
    }
    const contact = document.getElementById("contact");
    if (contact && typeof IntersectionObserver !== "undefined") {
      const io = new IntersectionObserver(([e]) => setAtContact(e.isIntersecting));
      io.observe(contact);
      observers.push(io);
    }

    const isTextField = (t: EventTarget | null) =>
      t instanceof Element &&
      t.matches(
        'textarea, select, input:not([type="radio"]):not([type="checkbox"]):not([type="range"]):not([type="button"]):not([type="submit"]):not([type="reset"])',
      );
    const onIn = (e: FocusEvent) => setTyping(isTextField(e.target));
    const onOut = (e: FocusEvent) => {
      if (!isTextField(e.relatedTarget)) setTyping(false);
    };
    const onMenu = () => setMenu(menuIsOpen());
    document.addEventListener("focusin", onIn);
    document.addEventListener("focusout", onOut);
    window.addEventListener(MENU_EVENT, onMenu);
    return () => {
      clearTimeout(timer);
      observers.forEach((io) => io.disconnect());
      document.removeEventListener("focusin", onIn);
      document.removeEventListener("focusout", onOut);
      window.removeEventListener(MENU_EVENT, onMenu);
    };
  }, []);

  const shown = past && !atContact && !typing && !menu;

  return (
    <div
      role="region"
      aria-label={label}
      inert={!shown}
      className="action-rail fixed inset-x-0 bottom-0 z-30 bg-[var(--header-bg)] pb-[env(safe-area-inset-bottom)] transition-transform duration-[280ms] ease-[var(--ease-silk)] lg:hidden"
      style={{ transform: shown ? "translateY(0)" : "translateY(100%)" }}
    >
      <span aria-hidden="true" className="rule-hair absolute inset-x-0 top-0" />
      <div className="flex h-14 items-center gap-3" style={{ paddingInline: "var(--gutter-x)" }}>
        {whatsappHref && (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="t-small inline-flex h-11 flex-none items-center justify-center gap-2 whitespace-nowrap px-1 font-semibold text-fg transition-colors duration-[160ms] hover:text-accent"
          >
            <WhatsAppGlyph className="size-5 text-accent" />
            <span>{whatsappLabel}</span>
            <span className="sr-only"> {newTabLabel}</span>
          </a>
        )}
        <ButtonPrimary
          href={ctaHref}
          size="compact"
          data-hash-link
          className="min-w-0 flex-1 whitespace-nowrap px-4 max-[359px]:px-3"
        >
          <span className="max-[359px]:hidden">{ctaLabel}</span>
          <span className="hidden max-[359px]:inline">{ctaShortLabel}</span>
        </ButtonPrimary>
      </div>
    </div>
  );
}

/* ───────────────────────── Glyph ───────────────────────── */

/**
 * A plain speech-bubble-and-handset glyph in currentColor. Always decorative:
 * the visible word "WhatsApp" names the link (status = glyph + word).
 */
export function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={className}>
      <path
        d="M12 3.25a8.75 8.75 0 0 0-7.6 13.08L3.25 20.75l4.53-1.12A8.75 8.75 0 1 0 12 3.25Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9.1 7.9c.2-.35.45-.4.7-.4h.5c.2 0 .4.08.5.35l.65 1.55c.08.2.04.42-.1.58l-.55.62c.62 1.15 1.55 2.08 2.7 2.7l.62-.55c.16-.14.38-.18.58-.1l1.55.65c.27.1.35.3.35.5v.5c0 .25-.05.5-.4.7-.55.32-1.3.5-2.1.3-2.4-.62-4.28-2.5-4.9-4.9-.2-.8-.02-1.55.3-2.1Z"
        fill="currentColor"
      />
    </svg>
  );
}
