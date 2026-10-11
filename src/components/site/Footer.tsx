import type { ReactNode } from "react";
import Link from "next/link";
import { localePath, type Locale } from "@/i18n/config";
import { fill, getDictionary } from "@/i18n/get-dictionary";
import { chromeExtra } from "@/i18n/extra/chrome";
import { BrandLockup } from "@/components/brand/BrandMark";
import { SocialLinks } from "@/components/brand/SocialLinks";
import { FooterMark } from "@/components/footer/FooterMark";
import { Container } from "@/components/ui/Container";
import { Grid } from "@/components/ui/Grid";
import { Rule } from "@/components/ui/Rule";
import { CONTACT_EMAIL, WHATSAPP_DISPLAY, WHATSAPP_NUMBER, whatsappHref } from "@/lib/contact-info";
import { servicesFor } from "@/lib/services";
import { NavLink, WhatsAppGlyph } from "./MobileMenu";

/**
 * A footer link: muted, the text colour on hover and on the page showing
 * (NavLink's data-active). No underline (iteration-5 §A).
 */
const linkClass =
  "t-small inline-flex min-h-11 items-center gap-2 text-muted transition-colors duration-[160ms] hover:text-fg data-[active=true]:text-fg";

/**
 * A footer column. Desktop: a vertical R1 on its left, centred in the column
 * gap. Below 1024px the columns stack, centred, and the same line runs along
 * the top instead. Never more than one rule per column, never a box.
 */
function Column({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div
      className={
        "relative col-span-4 py-8 text-center sm:col-span-8 lg:py-0 lg:text-left " +
        "before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-rule " +
        "lg:before:inset-x-auto lg:before:inset-y-0 lg:before:-left-3 lg:before:h-auto lg:before:w-px " +
        (className ?? "")
      }
    >
      <h2 className="t-eyebrow">{title}</h2>
      <ul className="mt-3 flex flex-col items-center lg:mt-4 lg:items-start">{children}</ul>
    </div>
  );
}

/**
 * Site footer (§6.10, iteration-3 §A). It follows the theme, like every
 * other part of the page (it was an ink band in both themes). A hairline
 * opens it; then the living wordmark (FooterMark: "From Data to" and a word
 * that writes itself, the waving mark, the dot field and the silk, with its
 * own pause control), R2 and four columns. Language and theme are chosen
 * in the header, so the old preferences row is gone. The bottom line (the
 * legal line, "Follow us" with the social icons, "Back to top") is gone too
 * (iteration-5b §J): the icons sit in the Contact column, and "© year
 * DataHub" in the brand column on desktop only.
 *
 * Every page of the site is linked from here; the one showing is marked
 * aria-current="page" and set in the text colour (NavLink). Services: the
 * three service pages and all services. Company (§6.10): process, security,
 * team, FAQ, privacy. Contact: WhatsApp, e-mail, the contact form, and
 * DataHub's social profiles.
 *
 * Below 1024px everything stacks and centres (iteration-5 §B): the brand,
 * then each column, the social icons last.
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
    // Room at the bottom for what floats over it: on phones the action rail
    // (with the WhatsApp button docked in it), on desktop the WhatsApp button
    // (24px from the edge, 56px tall), so neither ever rests on the last line.
    <footer id="footer" className="relative pb-[calc(56px+env(safe-area-inset-bottom)+2rem)] lg:pb-[6.5rem]">
      <span aria-hidden="true" className="rule-hair" />
      <FooterMark lang={lang} />

      <Container>
        <Rule variant="section" />

        <Grid className="pt-10 lg:pt-14">
          <div className="col-span-4 flex flex-col items-center pb-8 text-center sm:col-span-8 lg:col-span-4 lg:items-start lg:pb-0 lg:pr-6 lg:text-left">
            <Link href={home} aria-label={t.brand.homeLink} className="inline-flex min-h-11 items-center">
              <BrandLockup markClassName="h-7 w-7" wordClassName="text-[1.35rem]" />
            </Link>
            <p className="t-small mt-4 max-w-[38ch] text-muted">{f.about}</p>
            {/* Desktop only: there the brand column is shorter than the link
                columns, so the line sits level with their last row and adds no
                height. Stacked below 1024px it would add a row, so it is left out. */}
            <p className="t-data mt-auto hidden min-h-11 items-center lg:flex">{fill(f.legal, { year })}</p>
          </div>

          <Column title={f.columns.services} className="lg:col-span-3">
            {services.map((s, i) => (
              <li key={s.slug}>
                <NavLink href={localePath(lang, `/services/${s.slug}`)} className={linkClass}>
                  {f.services[i] ?? s.navLabel}
                </NavLink>
              </li>
            ))}
            <li>
              <NavLink href={localePath(lang, "/services")} className={linkClass}>
                {x.allServices}
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
                    {label}
                  </NavLink>
                </li>
              );
            })}
          </Column>

          {/* Last in the stack below 1024px, so no padding under it: the
              footer's own bottom room follows. */}
          <Column title={f.columns.contact} className="pb-0 lg:col-span-3">
            {WHATSAPP_NUMBER && (
              <li>
                <a href={whatsappHref(lang)} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  <WhatsAppGlyph className="size-4 shrink-0 text-accent" />
                  <span className="tnum">{fill(f.contact.whatsapp, { number: WHATSAPP_DISPLAY })}</span>
                  <span className="sr-only"> {t.a11y.opensNewTab}</span>
                </a>
              </li>
            )}
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
                {fill(f.contact.email, { email: CONTACT_EMAIL })}
              </a>
            </li>
            <li>
              <NavLink href={localePath(lang, "/contact")} className={linkClass}>
                {x.contactPage}
              </NavLink>
            </li>
            {/* The social icons take the address's row (the address stays on
                /contact and in the structured data). On desktop the row is
                pulled left by half of a 44px box less its 22px glyph, so the
                first mark lines up with the WhatsApp glyph above it. */}
            <li>
              <SocialLinks lang={lang} size="footer" className="lg:-ml-[11px]" />
            </li>
          </Column>
        </Grid>
      </Container>
    </footer>
  );
}
