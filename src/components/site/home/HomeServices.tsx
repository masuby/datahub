import { localePath, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { pagesExtra } from "@/i18n/extra/pages";
import { servicesFor } from "@/lib/services";
import { Container } from "@/components/ui/Container";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SERVICE_ITEM_KEY } from "../Services";
import { SERVICE_ICON } from "./home-art";
import { HOME_SECTION_Y, HomeOpener, HomeTiles } from "./HomeTiles";

/**
 * Home · 01 — What we do, short (iteration-3 §C): the opener — the eyebrow
 * as the section's h2 (the section title, "Three ways we turn data into
 * decisions", stays on /services rather than repeating the hero line right
 * under it) with "All services →" to /services on the same line — then the
 * three services as tiles, side by side between vertical hairlines: a 3D
 * icon, the index, the title, the tagline and an arrow, each tile a link to
 * its service page. Phones: one row per service, no rules.
 */
export async function HomeServices({ lang }: { lang: Locale }) {
  const t = await getDictionary(lang);
  const s = t.services;
  const x = pagesExtra[lang].home;

  const tiles = servicesFor(lang).map((svc) => {
    const item = s.items[SERVICE_ITEM_KEY[svc.slug]];
    return {
      key: svc.slug,
      href: localePath(lang, `/services/${svc.slug}`),
      index: item.index,
      title: item.title,
      line: item.tagline,
      icon: SERVICE_ICON[svc.slug],
    };
  });

  return (
    <Section id="services" labelledBy="services-title" compact className={HOME_SECTION_Y}>
      <Container>
        <Reveal>
          <HomeOpener id="services-title" aside={<LinkArrow href={localePath(lang, "/services")}>{x.servicesAll}</LinkArrow>}>
            {s.eyebrow}
          </HomeOpener>
          <HomeTiles tiles={tiles} ordered />
        </Reveal>
      </Container>
    </Section>
  );
}
