import Link from "next/link";
import { localePath, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { servicesFor } from "@/lib/services";
import { Container } from "@/components/ui/Container";
import { Rule } from "@/components/ui/Rule";
import { cn } from "@/lib/utils";
import styles from "./ServiceIndex.module.css";

/**
 * The hero's floor: the three services as one row of links.
 *
 * Desktop: a full-bleed R2 rule — the line the silk's decision filament lands
 * on, so its thread starts exactly where the filament touches down (96% of the
 * width, the end of the landing in src/lib/silk.ts) — then three columns
 * (cols 1–4, 5–8, 9–12) divided by vertical hairlines that start at the rule
 * and stop at the section's bottom. Mobile: a normal R2, then three stacked
 * full-row links with hairlines between.
 *
 * Hover/focus: a thread draws over the item's top, the index turns accent and
 * the arrow moves 6px. Labels come from the dictionary; slugs and order from
 * src/lib/services.ts.
 */
export async function ServiceIndex({ lang }: { lang: Locale }) {
  const t = await getDictionary(lang);
  const slugs = servicesFor(lang).map((s) => s.slug);
  const items = t.serviceIndex.items.slice(0, slugs.length);

  return (
    <nav aria-label={t.serviceIndex.label} className="relative">
      {/* Full-bleed R2 (scroll-lit sheen and forced-colors handling come with
          .rule-section); its thread starts where the filament lands. */}
      <span aria-hidden="true" className={cn("rule-section absolute inset-x-0 top-0 hidden lg:block", styles.landing)} />
      <Container>
        <Rule variant="section" className="lg:hidden" />
        <ul className="grid grid-cols-1 lg:grid-cols-12" style={{ columnGap: "var(--col-gap)" }}>
          {items.map((item, n) => (
            <li
              key={slugs[n]}
              className={cn(
                "relative lg:col-span-4",
                n > 0 &&
                  "lg:before:absolute lg:before:inset-y-0 lg:before:left-[calc(var(--col-gap)/-2)] lg:before:w-px lg:before:bg-rule lg:before:content-['']",
              )}
            >
              {n > 0 && <span aria-hidden="true" className="rule-hair lg:hidden" />}
              <Link
                href={localePath(lang, `/services/${slugs[n]}`)}
                className="group relative flex min-h-14 items-center justify-between gap-4 py-3 lg:h-full lg:min-h-[var(--index-h,112px)] lg:items-end lg:py-7"
              >
                <span
                  aria-hidden="true"
                  className="thread absolute inset-x-0 top-[-0.5px] scale-x-0 transition-transform duration-[280ms] ease-[var(--ease-thread)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
                />
                <span className="flex min-w-0 flex-row items-baseline gap-4 lg:flex-col lg:items-start lg:gap-2">
                  <span className="t-eyebrow transition-colors duration-[160ms] group-hover:text-accent group-focus-visible:text-accent">
                    {item.index}
                  </span>
                  <span className="t-title text-fg">{item.label}</span>
                </span>
                <span
                  aria-hidden="true"
                  className="t-title shrink-0 text-muted transition-transform duration-[280ms] ease-[var(--ease-silk)] group-hover:translate-x-1.5 group-hover:text-fg group-focus-visible:translate-x-1.5 lg:pr-2"
                >
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </nav>
  );
}
