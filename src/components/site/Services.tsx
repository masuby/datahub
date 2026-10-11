import Link from "next/link";
import { localePath, type Locale } from "@/i18n/config";
import { getDictionary, type Dictionary } from "@/i18n/get-dictionary";
import { servicesFor } from "@/lib/services";
import type { ServiceSlug } from "@/lib/service-slugs";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { bindAmpersands, cn } from "@/lib/utils";
import { ServiceIcon } from "./ServiceIcon";
import styles from "./Services.module.css";

/**
 * 01 — What we do: the head of /services (`headingLevel` 1 there, where its
 * title is the page's h1 and the service titles step up to h2).
 *
 * The three services as three centred columns (iteration-5 §B, §D): the
 * service's 3D icon, its index, title, tagline, description, deliverables
 * and "Read more →", divided by vertical hairlines from 1024px and stacked
 * with a hairline between them below (layout in Services.module.css). Each
 * column is a single <a> (the whole column is the hit area) containing its
 * heading; the link's name comes from its content, so every screen reader
 * hears the tagline, description and deliverables too. The icon and the
 * "Read more" label are decorative. The section reveal comes only from
 * <Reveal>; on hover/focus the index and title turn accent, the icon's glow
 * lifts and the arrow moves 6px. No underlines, no threads.
 *
 * Home-page summaries come from the dictionary; deliverable labels come from
 * the locale's service content (`servicesFor(lang)`), so both languages list
 * exactly what the service page promises.
 */

/**
 * Service slug → dictionary item key. Slugs never change (SEO URLs). Shared
 * with the home page's teaser and the service pages' "Also from DataHub".
 */
export const SERVICE_ITEM_KEY = {
  dashboards: "dashboards",
  automation: "automation",
  "ai-agents": "aiAgents",
} as const satisfies Record<ServiceSlug, keyof Dictionary["services"]["items"]>;

const isListed = (slug: string): slug is ServiceSlug => slug in SERVICE_ITEM_KEY;

export async function Services({ lang, headingLevel = 2 }: { lang: Locale; headingLevel?: 1 | 2 }) {
  const t = await getDictionary(lang);
  const s = t.services;
  const rows = servicesFor(lang).filter((svc) => isListed(svc.slug));
  const ColumnHeading = headingLevel === 1 ? "h2" : "h3";

  return (
    <Section id="services" labelledBy="services-title">
      <Container>
        <SectionHeader
          index="01"
          eyebrow={s.eyebrow}
          title={s.title}
          titleId="services-title"
          lead={s.lead}
          headingLevel={headingLevel}
        />

        <Reveal>
          <ol className={styles.list} role="list">
            {rows.map((svc, i) => {
              const slug = svc.slug as ServiceSlug;
              const item = s.items[SERVICE_ITEM_KEY[slug]];
              return (
                <li key={slug} className={cn(styles.item, "a-rise")} style={{ animationDelay: `${i * 60}ms` }}>
                  <Link href={localePath(lang, `/services/${slug}`)} className={cn("group", styles.link)}>
                    <span aria-hidden="true" className={styles.visual}>
                      <ServiceIcon slug={slug} size={96} eager={headingLevel === 1} className={styles.icon} />
                    </span>
                    <span className={cn("t-eyebrow", styles.index)}>{item.index}</span>
                    <ColumnHeading className={cn("t-h3", styles.title)}>{bindAmpersands(item.title)}</ColumnHeading>
                    <span className={cn("t-body font-bold text-fg", styles.tagline)}>{item.tagline}</span>
                    <span className={cn("t-body text-muted", styles.description)}>{item.description}</span>
                    {svc.deliverables.length > 0 ? (
                      <ul className={cn("t-data list-none p-0", styles.deliverables)} role="list">
                        {svc.deliverables.map((d) => (
                          <li key={d.title}>{d.title}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className={styles.deliverables} />
                    )}
                    <span aria-hidden="true" className={styles.more}>
                      {s.readMore}
                      <span className={styles.arrow}>→</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </Reveal>
      </Container>
    </Section>
  );
}
