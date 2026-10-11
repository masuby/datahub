"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useTransition,
  type AnchorHTMLAttributes,
  type MouseEventHandler,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { stripLocale } from "@/i18n/config";
import { BrandLockup } from "@/components/brand/BrandMark";
import { useMotionAllowed } from "@/components/system/motion-store";
import { LINKS_READY_EVENT, isPagePath, refOf, tagHref } from "@/components/system/campaign";
import { ButtonPrimary } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { GlassSurface } from "@/components/ui/glass/GlassSurface";
import { glassClasses } from "@/components/ui/glass/glass-classes";
import { cn } from "@/lib/utils";
import { WHATSAPP_GLYPH } from "@/components/brand/social-glyphs";
import styles from "./MobileMenu.module.css";
import fabStyles from "./FloatingWhatsApp.module.css";

/*
 * Client islands of the site chrome: the header shell (scroll state, progress
 * thread, page-change thread, links that keep the campaign tag), the page
 * links that know which page is showing, the mobile menu sheet, the mobile
 * action rail and the floating WhatsApp button. They share two signals —
 * the menu being open, published as <html data-menu="open"> plus an event,
 * and the rail being up, as <html data-rail="shown"> (the button settles
 * into the rail then).
 */

const MENU_EVENT = "dh-menu-change";
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * The element a URL fragment names, or null. Never throws: a mangled link
 * (/#100%, a fragment cut off by a messenger) is not valid percent-encoding,
 * and decodeURIComponent would throw — in an effect, that took the page down.
 */
function fragmentTarget(fragment: string): HTMLElement | null {
  let id = fragment.replace(/^#/, "");
  if (!id) return null;
  try {
    id = decodeURIComponent(id);
  } catch {
    // Look it up as written.
  }
  return document.getElementById(id);
}

function menuIsOpen(): boolean {
  return document.documentElement.dataset.menu === "open";
}

/** A field that brings up the on-screen keyboard: the rail and the WhatsApp button step aside for it. */
function isTextField(t: EventTarget | null): boolean {
  return (
    t instanceof Element &&
    t.matches(
      'textarea, select, input:not([type="radio"]):not([type="checkbox"]):not([type="range"]):not([type="button"]):not([type="submit"]):not([type="reset"])',
    )
  );
}

/** True while a text field has focus (the keyboard is up on a phone). */
function useTyping(): boolean {
  const [typing, setTyping] = useState(false);
  useEffect(() => {
    const onIn = (e: FocusEvent) => setTyping(isTextField(e.target));
    const onOut = (e: FocusEvent) => {
      if (!isTextField(e.relatedTarget)) setTyping(false);
    };
    document.addEventListener("focusin", onIn);
    document.addEventListener("focusout", onOut);
    return () => {
      document.removeEventListener("focusin", onIn);
      document.removeEventListener("focusout", onOut);
    };
  }, []);
  return typing;
}

/**
 * The tab stops inside `root`, in order. A radio group is one stop, as the
 * browser tabs it: the member with focus, else the checked one, else the
 * first. Counting every radio made the theme choice's last option the
 * trap's "last" stop, which focus never reaches while System or Light is
 * chosen, so Tab walked out of the menu.
 */
function tabStops(root: HTMLElement): HTMLElement[] {
  const all = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.offsetParent !== null || el === document.activeElement,
  );
  const groupOf = (el: HTMLElement) => (el instanceof HTMLInputElement && el.type === "radio" && el.name ? el.name : "");
  const rank = (el: HTMLElement) => (el === document.activeElement ? 2 : (el as HTMLInputElement).checked ? 1 : 0);
  const stop = new Map<string, HTMLElement>();
  for (const el of all) {
    const group = groupOf(el);
    if (!group) continue;
    const held = stop.get(group);
    if (!held || rank(el) > rank(held)) stop.set(group, el);
  }
  return all.filter((el) => {
    const group = groupOf(el);
    return !group || stop.get(group) === el;
  });
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

/* ───────────────────────── Campaign tag ───────────────────────── */

/**
 * `href` (a path, optionally with a #fragment) carrying the campaign tag of
 * the address bar — `?ref=`, else `?utm_source=`, sanitised as RefKeeper
 * does — when there is one and `href` has no query of its own.
 *
 * When the site was one page, every menu link scrolled within it and the
 * tag stayed in the address bar. Now they are pages, so the tag travels with
 * the visitor instead: the contact form still reads it from the URL even
 * where sessionStorage (RefKeeper's copy) is blocked. Before hydration,
 * RefScript applies the same rule (src/components/system/campaign.ts).
 */
export function withCampaign(href: string): string {
  return tagHref(href, refOf(window.location.search));
}

/* ───────────────────────── Where am I ───────────────────────── */

/**
 * The page being shown, locale-free ("/team"). usePathname may report the
 * internal /en rewrite on the server and the public path in the browser;
 * stripLocale makes both the same, so the server HTML and the hydrated tree
 * agree on which link is current.
 */
function useHere(): string {
  return stripLocale(usePathname() ?? "/");
}

/** "page" when `href` is the page being shown. A link to a part of a page (`#…`) never is. */
function currentOf(here: string, href: string): "page" | undefined {
  return !href.includes("#") && stripLocale(href) === here ? "page" : undefined;
}

/**
 * A link to a page of the site that knows whether it is the page showing:
 * `aria-current="page"` and `data-active` (the thread underline) on the
 * current one. `also` lists further locale-free paths that belong to this
 * item — the service pages under Services — which light the underline but
 * are not announced as the current page, because they are not it.
 */
export function NavLink({
  href,
  also,
  className,
  children,
  ...rest
}: {
  href: string;
  also?: readonly string[];
  className?: string;
  children: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children">) {
  const here = useHere();
  const current = currentOf(here, href);
  const active = current !== undefined || Boolean(also?.includes(here));
  return (
    <Link
      href={href}
      aria-current={current}
      data-active={active ? "true" : undefined}
      className={className}
      {...rest}
    >
      {children}
    </Link>
  );
}

/** The primary action as a page link, marked current on that page (the header CTA on /contact). */
export function PrimaryLink({
  href,
  children,
  size,
  className,
  onClick,
}: {
  href: string;
  children: ReactNode;
  size?: "default" | "compact";
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}) {
  const here = useHere();
  return (
    <ButtonPrimary href={href} size={size} aria-current={currentOf(here, href)} onClick={onClick} className={className}>
      {children}
    </ButtonPrimary>
  );
}

/* ───────────────────────── Header shell ───────────────────────── */

/**
 * The sticky <header>. Transparent at the top of the page; from 8px of scroll
 * it takes the header surface and an R1 bottom hairline. A 2px thread on that
 * hairline shows reading progress (one passive, rAF-throttled listener).
 *
 * It also handles two kinds of link click for the whole page:
 * - `a[data-hash-link]` pointing at a section of the current page scrolls
 *   there without a navigation, so the query string stays in the address bar
 *   (a plain `#estimator` link would keep it too, but not a `/services#…`
 *   one rendered by next/link);
 * - a link to another page of the site, while the address bar carries a
 *   campaign tag, navigates with the tag (see withCampaign). Language links
 *   (hreflang) refresh their own href from the live URL and are left alone.
 *
 * Page changes. Every page is rendered per request (the CSP nonce), so none
 * is prefetched and a tap waits for the server: on a slow phone network,
 * one to three seconds with nothing on screen changing. While the next page
 * is on its way the header carries `data-navigating`, and a second thread
 * takes the place of the reading-progress one (MobileMenu.module.css). It
 * covers both ways of leaving: the campaign push above, run as a transition
 * (isPending), and a plain click on a link to another page, which next/link
 * then carries out. That one ends when the path changes; when a newer
 * navigation that keeps the path replaces it (a tap on the page showing, or
 * Back/Forward to an entry the router owns); or, after a full page load,
 * when the browser brings this page back from its cache.
 */
export function HeaderShell({ children, progressLabel }: { children: ReactNode; progressLabel: string }) {
  const barRef = useRef<HTMLSpanElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const motion = useMotionAllowed();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [leaving, setLeaving] = useState(false);
  // The next page is showing: the change is over. Adjusted while rendering
  // (React's pattern for state that follows a prop), not in an effect.
  const [shownPath, setShownPath] = useState(pathname);
  if (shownPath !== pathname) {
    setShownPath(pathname);
    setLeaving(false);
  }
  const navigating = isPending || leaving;

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

  // Capture phase, so it runs before next/link's handler (which then sees
  // defaultPrevented and stands down). On the global 404, HardLinks has
  // already turned the click into a full page load: defaultPrevented again.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!(a instanceof HTMLAnchorElement) || a.origin !== window.location.origin) return;

      // A section of this page.
      if (a.hasAttribute("data-hash-link") && a.hash && a.pathname === window.location.pathname) {
        const target = fragmentTarget(a.hash);
        if (target) {
          e.preventDefault();
          const url = `${window.location.pathname}${window.location.search}${a.hash}`;
          if (`${window.location.pathname}${window.location.search}${window.location.hash}` !== url) {
            history.pushState(history.state, "", url);
          }
          // After this click's other handlers (e.g. the menu closing and
          // unlocking the page) have run. Smoothness follows html's
          // scroll-behavior, which is off under reduced motion. Then focus
          // follows the jump, as a native fragment link would move it.
          setTimeout(() => {
            target.scrollIntoView();
            focusSection(target);
          }, 0);
          return;
        }
      }

      // Another page of the site. Language links are full page loads (the
      // browser shows its own progress) and keep their own query.
      if (
        a.hasAttribute("hreflang") ||
        a.hasAttribute("download") ||
        (a.target && a.target !== "_self") ||
        !isPagePath(a.pathname)
      ) {
        return;
      }
      // Keep the campaign tag. The transition shows the change from here, so
      // an earlier click's mark goes: this navigation replaces that one.
      if (!a.search) {
        const plain = `${a.pathname}${a.hash}`;
        const tagged = withCampaign(plain);
        if (tagged !== plain) {
          e.preventDefault();
          setLeaving(false);
          startTransition(() => router.push(tagged));
          return;
        }
      }
      // next/link (or, for a plain <a>, the browser) takes it from here.
      // Another page: mark the header until the page changes. This page: the
      // router replaces any change still on its way, so the mark goes. A jump
      // to a part of this page depends on who makes it: the browser's own
      // (a plain <a href="#…">, such as the skip link) leaves that change
      // running, next/link's replaces it. next/link claims the click
      // (preventDefault) in a later handler, so look once it has been handled.
      if (a.pathname !== window.location.pathname) setLeaving(true);
      else if (!(a.hash && a.search === window.location.search)) setLeaving(false);
      else
        setTimeout(() => {
          if (e.defaultPrevented) setLeaving(false);
        }, 0);
    };
    // Back or Forward to an entry the router owns (it carries state) replaces
    // a change on its way; between fragments of one page (no state) it does not.
    const onPop = (e: PopStateEvent) => {
      if (e.state) setLeaving(false);
    };
    // Back from the browser's page cache after a full page load: nothing is on its way.
    const onShow = (e: PageTransitionEvent) => {
      if (e.persisted) setLeaving(false);
    };
    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPop);
    window.addEventListener("pageshow", onShow);
    // RefScript's before-hydration fallback (storage blocked) stands down
    // now that this handler carries the tag, so no click is tagged twice.
    window.dispatchEvent(new Event(LINKS_READY_EVENT));
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("pageshow", onShow);
    };
  }, [router]);

  return (
    <header
      data-scrolled={scrolled ? "true" : undefined}
      data-navigating={navigating ? "" : undefined}
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
        className={cn("thread pointer-events-none absolute inset-x-0 bottom-0", styles.progress)}
        style={{ transform: "scaleX(0)" }}
      />
      {/* The page-change thread. Still (full width) with reduced motion or motion paused. */}
      <span
        aria-hidden="true"
        data-still={motion ? undefined : ""}
        className={cn("thread pointer-events-none absolute inset-x-0 bottom-0", styles.pending)}
      />
    </header>
  );
}

/* ───────────────────────── Mobile menu ───────────────────────── */

export type MenuItem = {
  href: string;
  label: string;
  /** The chapter number, 01–08. */
  index: string;
  /** Locale-free paths that also belong to this item (see NavLink). */
  also?: readonly string[];
};

/**
 * "Menu" text button (below 1024px) that opens a full-screen sheet: links in
 * Outfit 2rem numbered 01–08 by chapter, separated by R1, each a full-row
 * 56px target, the current page underlined and announced; then the primary
 * action, WhatsApp, DataHub's social profiles (`social`, iteration 3) and
 * the language and theme preferences (passed in as `children`).
 *
 * While open: focus is trapped in the sheet, everything else on the page is
 * `inert`, the page does not scroll, and Esc or Close returns focus to the
 * Menu button. Following a link closes it, then the page changes (or, for a
 * part of the page showing, scrolls there).
 */
export function MobileMenu({
  labels,
  items,
  ctaHref,
  whatsappHref,
  newTabLabel,
  social,
  children,
}: {
  labels: { open: string; close: string; dialog: string; nav: string; cta: string; whatsapp: string; preferences: string };
  items: MenuItem[];
  ctaHref: string;
  /** Empty when no WhatsApp number is configured: the link is not rendered. */
  whatsappHref: string;
  newTabLabel: string;
  /** The social icons (SocialLinks), under the WhatsApp link. */
  social?: ReactNode;
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
      const f = tabStops(sheetRef.current);
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
                <NavLink
                  href={it.href}
                  also={it.also}
                  // Only acts when the link is a part of the page showing.
                  data-hash-link={it.href.includes("#") ? "" : undefined}
                  onClick={onNavigate}
                  className="group flex min-h-14 items-baseline gap-4 py-3"
                >
                  <span className="t-mono w-6 shrink-0 text-subtle tnum group-data-[active=true]:text-accent">
                    {it.index}
                  </span>
                  <span className="link-thread pb-0.5 font-display text-[2rem] font-medium leading-[1.15] tracking-[-0.02em] transition-colors duration-[160ms] group-hover:text-accent group-data-[active=true]:[background-size:100%_2px]">
                    {it.label}
                  </span>
                </NavLink>
              </li>
            ))}
          </ol>
        </nav>
        <span aria-hidden="true" className="rule-hair" />

        <div className="mt-8 flex flex-col items-start gap-2">
          <PrimaryLink href={ctaHref} onClick={onNavigate} className="w-full sm:w-auto">
            {labels.cta}
          </PrimaryLink>
          {whatsappHref && (
            <LinkArrow href={whatsappHref} external newTabLabel={newTabLabel} arrow="↗">
              {labels.whatsapp}
            </LinkArrow>
          )}
          {social}
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
 * Mobile-only fixed bottom rail: the primary action, a link to the contact
 * page, and WhatsApp. It slides in once the page's opening (the hero's call
 * to action, or a page's h1 marked data-rail-anchor) has scrolled away and
 * steps aside while the contact section is on screen, while a text field has
 * focus (the keyboard is up), and while the menu is open. Hidden, it is
 * `inert`, so it never takes focus.
 *
 * WhatsApp is the floating button's (iteration 3): with `dock`, the rail
 * keeps its right end free and, while it is up, says so on <html
 * data-rail="shown">, and the button settles into that end — one green
 * circle, never two WhatsApp links, never one over the other. Without a
 * WhatsApp number there is no button and the action takes the full width.
 */
export function ActionRailBar({
  label,
  dock,
  ctaLabel,
  ctaShortLabel,
  ctaHref,
}: {
  label: string;
  /** Keep the right end free for the floating WhatsApp button. */
  dock: boolean;
  ctaLabel: string;
  /** Shown instead of ctaLabel below 360px, where the full label cannot fit on one line. */
  ctaShortLabel: string;
  ctaHref: string;
}) {
  const [past, setPast] = useState(false);
  const [atContact, setAtContact] = useState(false);
  const typing = useTyping();
  const [menu, setMenu] = useState(false);
  const here = useHere();

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    // The hero CTA (#hero-cta) or a page's h1 (data-rail-anchor); elsewhere
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

    const onMenu = () => setMenu(menuIsOpen());
    window.addEventListener(MENU_EVENT, onMenu);
    return () => {
      clearTimeout(timer);
      observers.forEach((io) => io.disconnect());
      window.removeEventListener(MENU_EVENT, onMenu);
    };
  }, []);

  const shown = past && !atContact && !typing && !menu;

  // Tell the WhatsApp button where to sit.
  useEffect(() => {
    if (!dock || !shown) return;
    const root = document.documentElement;
    root.dataset.rail = "shown";
    return () => {
      delete root.dataset.rail;
    };
  }, [dock, shown]);

  return (
    <div
      role="region"
      aria-label={label}
      inert={!shown}
      className="action-rail fixed inset-x-0 bottom-0 z-30 bg-[var(--header-bg)] pb-[env(safe-area-inset-bottom)] transition-transform duration-[280ms] ease-[var(--ease-silk)] lg:hidden"
      style={{ transform: shown ? "translateY(0)" : "translateY(100%)" }}
    >
      <span aria-hidden="true" className="rule-hair absolute inset-x-0 top-0" />
      <div
        className="flex h-14 items-center gap-3"
        // The free end: the button's 48px, and 12px between it and the action.
        style={{
          paddingLeft: "var(--gutter-x)",
          paddingRight: dock ? "calc(var(--gutter-x) + 60px)" : "var(--gutter-x)",
        }}
      >
        <ButtonPrimary
          href={ctaHref}
          size="compact"
          aria-current={currentOf(here, ctaHref)}
          className="min-w-0 flex-1 whitespace-nowrap px-4 max-[359px]:px-3"
        >
          <span className="max-[359px]:hidden">{ctaLabel}</span>
          <span className="hidden max-[359px]:inline">{ctaShortLabel}</span>
        </ButtonPrimary>
      </div>
    </div>
  );
}

/* ───────────────────────── Floating WhatsApp ───────────────────────── */

/**
 * Where the hero's pause control can be under the floating button: the
 * control sits just above the hero's bottom edge at every width (16px above
 * the floor rule on desktop, the last row of the hero on phones), so while
 * that edge is between HERO_CLEAR_ABOVE px above the bottom of the screen
 * and HERO_CLEAR_BELOW px below it, the two would overlap — on desktop the
 * label, on phones the circle (FloatingWhatsApp.module.css has the sizes).
 */
const HERO_CLEAR_ABOVE = 68;
const HERO_CLEAR_BELOW = 34;

/**
 * The floating WhatsApp button's island (FloatingWhatsApp supplies the link
 * and strings; its look, and where it sits beside the action rail, are in
 * FloatingWhatsApp.module.css). Its accessible name is `name` — "Chat with
 * us on WhatsApp (opens in a new tab)" — which holds the visible label, so
 * speech input finds it by what it shows.
 *
 * Two things it watches: a text field having focus (on a phone it steps
 * aside for the keyboard), and the hero's pause control passing where it
 * floats (data-clear): then on wide screens the label folds away (and no
 * longer takes clicks) and only the circle shows; on phones the circle
 * rises above the control. The hero's bottom edge is read once a frame
 * while the page scrolls, and only while the hero is on screen. Pages
 * without a hero never need it; the footer's pause control sits at the
 * left, clear of the button.
 */
export function WhatsAppFab({ href, label, name }: { href: string; label: string; name: string }) {
  const typing = useTyping();
  const pathname = usePathname();
  // Which page it was measured on: a page change (the layout stays) starts afresh.
  const [near, setNear] = useState<{ path: string | null; hero: boolean }>({ path: null, hero: false });
  const clear = near.path === pathname && near.hero;

  useEffect(() => {
    const hero = document.getElementById("top");
    if (!hero || typeof IntersectionObserver === "undefined") return;
    let raf = 0;
    let listening = false;
    const measure = () => {
      raf = 0;
      const vh = window.innerHeight;
      const bottom = hero.getBoundingClientRect().bottom;
      setNear({ path: pathname, hero: bottom > vh - HERO_CLEAR_ABOVE && bottom < vh + HERO_CLEAR_BELOW });
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    const listen = (on: boolean) => {
      if (on === listening) return;
      listening = on;
      if (on) {
        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule, { passive: true });
      } else {
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", schedule);
      }
    };
    // On screen, or its bottom edge just below it.
    const io = new IntersectionObserver(
      ([e]) => {
        listen(e.isIntersecting);
        schedule();
      },
      { rootMargin: `0px 0px ${HERO_CLEAR_BELOW}px 0px` },
    );
    io.observe(hero);
    return () => {
      io.disconnect();
      listen(false);
      cancelAnimationFrame(raf);
    };
  }, [pathname]);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={name}
      data-fab=""
      data-typing={typing ? "" : undefined}
      data-clear={clear ? "" : undefined}
      className={fabStyles.fab}
    >
      <span aria-hidden="true" className={cn(fabStyles.label, glassClasses.teal)}>
        <GlassSurface />
        {label}
      </span>
      <span aria-hidden="true" className={cn(fabStyles.circle, glassClasses.green)}>
        <GlassSurface shape="circle" />
        <svg viewBox="0 0 24 24" focusable="false">
          <path d={WHATSAPP_GLYPH} />
        </svg>
      </span>
    </a>
  );
}

/* ───────────────────────── Glyph ───────────────────────── */

/**
 * WhatsApp's handset-in-a-bubble mark in currentColor: the same path as the
 * floating button's (WHATSAPP_GLYPH), so the site shows one WhatsApp mark.
 * Always decorative: the visible word "WhatsApp" names the link (status =
 * glyph + word).
 */
export function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={className}>
      <path d={WHATSAPP_GLYPH} fill="currentColor" />
    </svg>
  );
}
