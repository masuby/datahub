import Link from "next/link";
import { localePath, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { BrandLockup } from "@/components/brand/BrandMark";
import { ButtonPrimary } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { LangSwitch } from "@/components/system/LangSwitch";
import { ThemeToggle } from "@/components/system/ThemeToggle";
import { ThemeSettings } from "@/components/system/ThemeSettings";
import { WHATSAPP_HREF, WHATSAPP_NUMBER } from "@/lib/contact-info";
import { HeaderShell, MobileMenu, type MenuItem } from "./MobileMenu";

/** Home-page sections, in page order; the menu numbers them 01–08. */
const MENU_SECTIONS = ["services", "dashboards", "estimator", "process", "security", "team", "faq", "contact"] as const;

/**
 * Sticky site header (§6.0). Server-rendered links and labels; the scroll
 * state, progress thread, active-section underline, theme and language
 * controls and the mobile menu are small client islands.
 *
 *   ≥1280  lockup · Services Dashboards Process Security Team FAQ · EN|SW ◐ [Start a conversation]
 *   ≥1024  as above without Process and Security (they stay in the menu and footer)
 *   <1024  lockup · EN|SW ◐ Menu
 *
 * Section links point at the home page (`/#team`, `/sw#team`) so they work
 * from service pages too; on the home page they scroll in place and keep the
 * query string. The skip link is the first focusable element.
 */
export async function Header({ lang }: { lang: Locale }) {
  const t = await getDictionary(lang);
  const home = localePath(lang, "/");
  const at = (id: string) => `${home}#${id}`;

  const nav: { id: string; label: string; wideOnly?: boolean }[] = [
    { id: "services", label: t.nav.services },
    { id: "dashboards", label: t.nav.dashboards },
    { id: "process", label: t.nav.process, wideOnly: true },
    { id: "security", label: t.nav.security, wideOnly: true },
    { id: "team", label: t.nav.team },
    { id: "faq", label: t.nav.faq },
  ];

  const menuItems: MenuItem[] = MENU_SECTIONS.map((id, i) => ({
    href: at(id),
    label: t.menu.items[i] ?? id,
    index: String(i + 1).padStart(2, "0"),
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
              <li key={item.id} className={item.wideOnly ? "hidden xl:flex" : "flex"}>
                <a
                  href={at(item.id)}
                  data-nav={item.id}
                  data-hash-link
                  className={
                    "relative flex items-center whitespace-nowrap font-sans text-sm font-medium text-muted transition-colors duration-[160ms] hover:text-fg data-[active=true]:text-fg " +
                    "after:absolute after:inset-x-0 after:bottom-0 after:z-10 after:h-0.5 after:origin-left after:scale-x-0 after:bg-[image:var(--thread)] after:transition-transform after:duration-[280ms] after:ease-[var(--ease-thread)] " +
                    "data-[active=true]:after:scale-x-100"
                  }
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-0 min-[360px]:gap-1 sm:gap-2 lg:ml-0 lg:gap-3">
          <LangSwitch lang={lang} labels={t.lang} variant="short" />
          <ThemeToggle labels={t.theme.toggle} />
          <ButtonPrimary href={at("contact")} size="compact" data-hash-link className="hidden lg:inline-flex">
            {t.header.cta}
          </ButtonPrimary>
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
            ctaHref={at("contact")}
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
