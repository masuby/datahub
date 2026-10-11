import Link from "next/link";
import { localePath, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { BrandLockup } from "@/components/brand/BrandMark";
import { SocialLinks } from "@/components/brand/SocialLinks";
import { Container } from "@/components/ui/Container";
import { NavPill } from "@/components/ui/glass/NavPill";
import { glassClasses } from "@/components/ui/glass/glass-classes";
import { LangSwitch } from "@/components/system/LangSwitch";
import { ThemeToggle } from "@/components/system/ThemeToggle";
import { ThemeSettings } from "@/components/system/ThemeSettings";
import { whatsappHref } from "@/lib/contact-info";
import { SERVICE_SLUGS } from "@/lib/service-slugs";
import { cn } from "@/lib/utils";
import { HeaderShell, MobileMenu, NavLink, PrimaryLink, type MenuItem } from "./MobileMenu";

/** The service pages, which belong to "Services" in the navigation. */
const SERVICE_PATHS = SERVICE_SLUGS.map((slug) => `/services/${slug}`);

/**
 * The menu's seven chapters, in their old home-page order, so the numbers
 * 01–07 still match the eyebrows of the pages they open. "Your numbers"
 * (02) is the hours estimator, a part of the services page. The sample
 * dashboards are no chapter since their page became the home page's live
 * showcase (iteration-5 §I).
 */
const MENU_PATHS = [
  "/services",
  "/services#estimator",
  "/process",
  "/security",
  "/team",
  "/faq",
  "/contact",
] as const;

/**
 * Sticky site header (§6.0). Server-rendered links and labels; the scroll
 * state, current-page marking, theme and language controls and the mobile
 * menu are small client islands.
 *
 *   ≥1280  lockup · Services Process Security Team FAQ · ig fb tt in | EN SW ◐ [Start a conversation]
 *   ≥1024  lockup · Services Process Security Team FAQ · EN SW ◐ [Start a conversation]
 *   ≥640   lockup · ig fb tt in | EN SW ◐ Menu
 *   <640   lockup · EN SW ◐ Menu (the social icons are in the menu, and the footer)
 *
 * "ig fb tt in" is DataHub's four social profiles (iteration-3 §A), in
 * their brand colours; a hairline separates them from the language and
 * theme controls. From 1024 to 1279px, where the header is fullest and
 * there is no Menu button, every page keeps its link and the social icons
 * give way (they are in the footer and, below 1024px, in the menu); the
 * spacing also tightens a little so everything fits inside the gutters.
 *
 * Every item is a page; the one showing carries aria-current="page" and
 * sits in a sky liquid-glass pill with a navy label (a service page lights
 * "Services" without claiming to be it); the others are muted text, and a
 * faint clear-glass pill rises behind one on hover or keyboard focus. The
 * language switch and the theme toggle speak the same glass (iteration 5b
 * §K; Glass.module.css, "Navigation glass"). No underline (iteration-5 §A).
 * Each link is a 36px pill whose padding is always there, so no state moves
 * the bar. The call to action opens the contact page. The skip link is the
 * first focusable element.
 */
export async function Header({ lang }: { lang: Locale }) {
  const t = await getDictionary(lang);
  const home = localePath(lang, "/");
  const contact = localePath(lang, "/contact");

  const nav: { path: string; label: string; also?: readonly string[] }[] = [
    { path: "/services", label: t.nav.services, also: SERVICE_PATHS },
    { path: "/process", label: t.nav.process },
    { path: "/security", label: t.nav.security },
    { path: "/team", label: t.nav.team },
    { path: "/faq", label: t.nav.faq },
  ];

  const menuItems: MenuItem[] = MENU_PATHS.map((path, i) => ({
    href: localePath(lang, path),
    label: t.menu.items[i] ?? path,
    index: String(i + 1).padStart(2, "0"),
    also: path === "/services" ? SERVICE_PATHS : undefined,
  }));

  return (
    <HeaderShell>
      <a
        href="#main"
        className="t-small sr-only font-bold focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[60] focus:bg-bg focus:px-4 focus:py-2.5 focus:text-fg"
      >
        {t.a11y.skip}
      </a>
      <Container className="flex h-[var(--header-h)] items-center gap-2 min-[360px]:gap-4 lg:gap-6 xl:gap-8">
        <Link
          href={home}
          aria-label={t.brand.homeLink}
          className="inline-flex min-h-11 shrink-0 items-center"
        >
          <BrandLockup
            className="max-[359px]:gap-2"
            markClassName="h-6 w-6 lg:h-7 lg:w-7"
            wordClassName="text-[1.05rem] min-[360px]:text-[1.2rem] lg:text-[1.3rem]"
          />
        </Link>

        <nav aria-label={t.nav.label} className="hidden h-full flex-1 justify-center lg:flex">
          <ul className="flex h-full items-center gap-1 xl:gap-2">
            {nav.map((item) => (
              <li key={item.path} className="flex">
                <NavLink
                  href={localePath(lang, item.path)}
                  also={item.also}
                  className={cn(
                    glassClasses.nav,
                    "inline-flex h-9 items-center whitespace-nowrap px-3 font-display text-sm font-medium xl:px-3.5",
                  )}
                >
                  <NavPill />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-0 min-[360px]:gap-1 sm:gap-2 lg:ml-0 xl:gap-3">
          <SocialLinks lang={lang} size="header" className="hidden sm:flex lg:hidden xl:flex" />
          <span aria-hidden="true" className="mr-1 hidden h-5 w-px bg-rule sm:block lg:mr-0 lg:hidden xl:block" />
          <LangSwitch lang={lang} labels={t.lang} variant="short" />
          <ThemeToggle labels={t.theme.toggle} />
          <PrimaryLink href={contact} size="compact" className="hidden lg:inline-flex">
            {t.header.cta}
          </PrimaryLink>
          <MobileMenu
            labels={{
              open: t.header.menuOpen,
              close: t.header.menuClose,
              dialog: t.header.menuLabel,
              nav: t.nav.label,
              cta: t.header.cta,
              whatsapp: t.menu.whatsapp,
              preferences: t.menu.preferences,
            }}
            items={menuItems}
            ctaHref={contact}
            whatsappHref={whatsappHref(lang)}
            newTabLabel={t.a11y.opensNewTab}
            social={<SocialLinks lang={lang} size="menu" className="-ml-3 mt-2" />}
          >
            <LangSwitch lang={lang} labels={t.lang} variant="full" />
            <ThemeSettings labels={t.theme.settings} />
          </MobileMenu>
        </div>
      </Container>
    </HeaderShell>
  );
}
