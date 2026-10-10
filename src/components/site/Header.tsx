import Link from "next/link";
import { localePath, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { BrandLockup } from "@/components/brand/BrandMark";
import { Container } from "@/components/ui/Container";
import { LangSwitch } from "@/components/system/LangSwitch";
import { ThemeToggle } from "@/components/system/ThemeToggle";
import { ThemeSettings } from "@/components/system/ThemeSettings";
import { WHATSAPP_HREF, WHATSAPP_NUMBER } from "@/lib/contact-info";
import { SERVICE_SLUGS } from "@/lib/service-slugs";
import { HeaderShell, MobileMenu, NavLink, PrimaryLink, type MenuItem } from "./MobileMenu";

/** The service pages, which belong to "Services" in the navigation. */
const SERVICE_PATHS = SERVICE_SLUGS.map((slug) => `/services/${slug}`);

/**
 * The menu's eight chapters, in their old home-page order, so the numbers
 * 01–08 still match the eyebrows of the pages they open. "Your numbers"
 * (03) is the hours estimator, a part of the services page.
 */
const MENU_PATHS = [
  "/services",
  "/dashboards",
  "/services#estimator",
  "/process",
  "/security",
  "/team",
  "/faq",
  "/contact",
] as const;

/**
 * Sticky site header (§6.0). Server-rendered links and labels; the scroll
 * state, progress thread, current-page marking, theme and language controls
 * and the mobile menu are small client islands.
 *
 *   ≥1280  lockup · Services Dashboards Process Security Team FAQ · EN|SW ◐ [Start a conversation]
 *   ≥1024  as above without Process and Security (they stay in the menu and footer)
 *   <1024  lockup · EN|SW ◐ Menu
 *
 * Every item is a page; the one showing carries aria-current="page" and the
 * thread underline on the header's bottom hairline (a service page lights
 * "Services" without claiming to be it). The call to action opens the
 * contact page. The skip link is the first focusable element.
 */
export async function Header({ lang }: { lang: Locale }) {
  const t = await getDictionary(lang);
  const home = localePath(lang, "/");
  const contact = localePath(lang, "/contact");

  const nav: { path: string; label: string; wideOnly?: boolean; also?: readonly string[] }[] = [
    { path: "/services", label: t.nav.services, also: SERVICE_PATHS },
    { path: "/dashboards", label: t.nav.dashboards },
    { path: "/process", label: t.nav.process, wideOnly: true },
    { path: "/security", label: t.nav.security, wideOnly: true },
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
    <HeaderShell progressLabel={t.header.progressLabel}>
      <a
        href="#main"
        className="t-small sr-only font-semibold focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[60] focus:bg-bg focus:px-4 focus:py-2.5 focus:text-fg"
      >
        {t.a11y.skip}
      </a>
      <Container className="flex h-[var(--header-h)] items-center gap-2 min-[360px]:gap-4 lg:gap-8">
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
          <ul className="flex h-full items-stretch gap-6 xl:gap-8">
            {nav.map((item) => (
              <li key={item.path} className={item.wideOnly ? "hidden xl:flex" : "flex"}>
                <NavLink
                  href={localePath(lang, item.path)}
                  also={item.also}
                  className={
                    "relative flex items-center whitespace-nowrap font-sans text-sm font-medium text-muted transition-colors duration-[160ms] hover:text-fg data-[active=true]:text-fg " +
                    "after:absolute after:inset-x-0 after:bottom-0 after:z-10 after:h-0.5 after:origin-left after:scale-x-0 after:bg-[image:var(--thread)] after:transition-transform after:duration-[280ms] after:ease-[var(--ease-thread)] " +
                    "data-[active=true]:after:scale-x-100"
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-0 min-[360px]:gap-1 sm:gap-2 lg:ml-0 lg:gap-3">
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
            whatsappHref={WHATSAPP_NUMBER ? WHATSAPP_HREF : ""}
            newTabLabel={t.a11y.opensNewTab}
          >
            <LangSwitch lang={lang} labels={t.lang} variant="full" />
            <ThemeSettings labels={t.theme.settings} />
          </MobileMenu>
        </div>
      </Container>
    </HeaderShell>
  );
}
