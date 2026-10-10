import type { ReactNode } from "react";
import Link from "next/link";
import { localePath, type Locale } from "@/i18n/config";
import { fill, getDictionary } from "@/i18n/get-dictionary";
import { chromeExtra } from "@/i18n/extra/chrome";
import { BrandLockup } from "@/components/brand/BrandMark";
import { SilkField } from "@/components/silk/SilkField";
import { Container } from "@/components/ui/Container";
import { Grid } from "@/components/ui/Grid";
import { Rule } from "@/components/ui/Rule";
import { LangSwitch } from "@/components/system/LangSwitch";
import { ThemeSettings } from "@/components/system/ThemeSettings";
import { MotionToggle } from "@/components/system/MotionToggle";
import { CONTACT_EMAIL, WHATSAPP_DISPLAY, WHATSAPP_HREF, WHATSAPP_NUMBER } from "@/lib/contact-info";
import { servicesFor } from "@/lib/services";
import { NavLink, WhatsAppGlyph } from "./MobileMenu";

const linkClass =
  "group t-small inline-flex min-h-11 items-center gap-2 text-muted transition-colors duration-[160ms] hover:text-fg data-[active=true]:text-fg";

/** The label of a page link: the thread underline stays drawn on the page showing. */
const labelClass = "link-thread pb-0.5 group-data-[active=true]:[background-size:100%_2px]";

/**
 * A footer column. Desktop: a vertical R1 on its left, centred in the column
 * gap. Below 1024px the columns stack and the same line runs along the top
 * instead. Never more than one rule per column, never a box.
 */
function Column({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div
      className={
        "relative col-span-4 py-8 sm:col-span-8 lg:py-0 " +
        "before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-rule " +
        "lg:before:inset-x-auto lg:before:inset-y-0 lg:before:-left-3 lg:before:h-auto lg:before:w-px " +
        (className ?? "")
      }
    >
      <h2 className="t-eyebrow">{title}</h2>
      <ul className="mt-3 flex flex-col lg:mt-4">{children}</ul>
    </div>
  );
}

/**
 * Site footer (§6.10): an ink band in both themes. A static silk plate (no
 * canvas) carries the tagline, then R2, four columns, a preferences row
 * (language, theme, motion) and the legal line.
 *
 * Every page of the site is linked from here; the one showing is marked
 * aria-current="page" with its thread underline drawn (NavLink). Services:
 * the three service pages, all services and the sample dashboards. Company
 * (§6.10): process, security, team, FAQ, privacy.
 */
export async function Footer({ lang }: { lang: Locale }) {
  const t = await getDictionary(lang);
  const f = t.footer;
  const x = chromeExtra[lang].footer;
  const home = localePath(lang, "/");
  const services = servicesFor(lang);
  /** Paths of the dictionary's company links, in its order. */
  const company = ["/process", "/security", "/team", "/faq", "/privacy"];
  const year = new Date().getFullYear();

  return (
    <footer
      id="footer"
      className="surface-ink relative pb-[calc(56px+env(safe-area-inset-bottom)+2rem)] lg:pb-10"
    >
      {/* Silk plate with the tagline over its lower left; filaments sink to the right. */}
      <div className="relative overflow-hidden">
        <SilkField preset="plate" className="silk-layer pointer-events-none absolute inset-0 h-full w-full" />
        <Container className="relative flex min-h-[160px] items-end pb-8 pt-16 lg:min-h-[260px] lg:pb-12 lg:pt-24">
          <p className="t-footer-mark text-fg">
            <span className="block">
              {f.tagline.line1Before}
              <span className="text-accent-display">{f.tagline.line1Accent}</span>
            </span>
            <span className="block">{f.tagline.line2}</span>
          </p>
        </Container>
      </div>

      <Container>
        <Rule variant="section" />

        <Grid className="pt-10 lg:pt-14">
          <div className="col-span-4 pb-8 sm:col-span-8 lg:col-span-4 lg:pb-0 lg:pr-6">
            <Link href={home} aria-label={t.brand.homeLink} className="inline-flex min-h-11 items-center">
              <BrandLockup markClassName="h-7 w-7" wordClassName="text-[1.35rem]" />
            </Link>
            <p className="t-small mt-4 max-w-[38ch] text-muted">{f.about}</p>
          </div>

          <Column title={f.columns.services} className="lg:col-span-3">
            {services.map((s, i) => (
              <li key={s.slug}>
                <NavLink href={localePath(lang, `/services/${s.slug}`)} className={linkClass}>
                  <span className={labelClass}>{f.services[i] ?? s.navLabel}</span>
                </NavLink>
              </li>
            ))}
            <li>
              <NavLink href={localePath(lang, "/services")} className={linkClass}>
                <span className={labelClass}>{x.allServices}</span>
              </NavLink>
            </li>
            <li>
              <NavLink href={localePath(lang, "/dashboards")} className={linkClass}>
                <span className={labelClass}>{x.dashboards}</span>
              </NavLink>
            </li>
          </Column>

          <Column title={f.columns.company} className="lg:col-span-2">
            {f.company.map((label, i) => {
              const path = company[i];
              if (!path) return null;
              return (
                <li key={path}>
                  <NavLink href={localePath(lang, path)} className={linkClass}>
                    <span className={labelClass}>{label}</span>
                  </NavLink>
                </li>
              );
            })}
          </Column>

          <Column title={f.columns.contact} className="lg:col-span-3">
            {WHATSAPP_NUMBER && (
              <li>
                <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  <WhatsAppGlyph className="size-4 shrink-0 text-accent" />
                  <span className="link-thread pb-0.5 tnum">{fill(f.contact.whatsapp, { number: WHATSAPP_DISPLAY })}</span>
                  <span className="sr-only"> {t.a11y.opensNewTab}</span>
                </a>
              </li>
            )}
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
                <span className="link-thread pb-0.5">{fill(f.contact.email, { email: CONTACT_EMAIL })}</span>
              </a>
            </li>
            <li>
              <NavLink href={localePath(lang, "/contact")} className={linkClass}>
                <span className={labelClass}>{x.contactPage}</span>
              </NavLink>
            </li>
            <li className="t-small flex min-h-11 items-center text-muted">{f.contact.location}</li>
          </Column>
        </Grid>

        <Rule variant="hair" className="mt-10 lg:mt-16" />
        <div className="flex flex-col gap-2 py-5 lg:flex-row lg:flex-wrap lg:items-center lg:gap-x-12">
          <h2 className="t-eyebrow text-fg lg:mr-2">{f.columns.preferences}</h2>
          <LangSwitch lang={lang} labels={t.lang} variant="full" />
          <ThemeSettings labels={t.theme.settings} />
          <MotionToggle
            variant="footer"
            labels={{
              pause: t.motion.pause,
              resume: t.motion.resume,
              label: t.motion.legend,
              on: t.motion.on,
              off: t.motion.off,
            }}
          />
        </div>
        <Rule variant="hair" />

        <div className="flex flex-col gap-1 pt-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <p className="t-data">{fill(f.legal, { year })}</p>
          <a
            href="#main"
            className="t-data group inline-flex min-h-11 items-center gap-1.5 transition-colors duration-[160ms] hover:text-fg"
          >
            <span className="link-thread pb-0.5">{f.backToTop}</span>
            <span aria-hidden="true" className="inline-block transition-transform duration-[280ms] group-hover:-translate-y-0.5">
              ↑
            </span>
          </a>
        </div>
      </Container>
    </footer>
  );
}
