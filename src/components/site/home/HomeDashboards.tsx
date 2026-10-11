import Image from "next/image";
import { localePath, type Locale } from "@/i18n/config";
import { pagesExtra } from "@/i18n/extra/pages";
import { makeDashCtx } from "@/components/dash/make-ctx";
import { Container } from "@/components/ui/Container";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/utils";
import dashStyles from "@/components/dash/dash.module.css";
import { DASHBOARDS_ICON } from "./home-art";
import { HOME_SECTION_Y, HomeOpener } from "./HomeTiles";
import { TeaserPlate, type TeaserCtx } from "./TeaserPlate";
import styles from "./home.module.css";

/**
 * Home · 02 — Sample dashboards, short, in the rhythm of the tiles around
 * it (iteration-3 §C): the opener (the eyebrow), then from 1440px a 3D bar
 * chart, the title, the honesty notice and "Explore the sample dashboards →"
 * to /dashboards, one under the other in the first third, and one plate
 * (View 1's KPI strip and revenue chart; on phones the chart and its credit
 * line, see TeaserPlate) in the other two, behind a vertical hairline on the
 * line of the tiles' first divider. Below 1440px (where two thirds would
 * squeeze the KPI strip): title, notice, plate and link, stacked, without
 * the bar chart. No horizontal rules.
 * In the visitor's own theme, like the dashboards page.
 */
export async function HomeDashboards({ lang }: { lang: Locale }) {
  const full = await makeDashCtx(lang, "home", false);
  const t = full.t;
  // View 1's strings only: the teaser shows nothing from the other three views.
  const ctx: TeaserCtx = { ...full, t: { ...t, views: { overview: t.views.overview } } };

  return (
    <Section id="dashboards" labelledBy="dashboards-title" compact className={HOME_SECTION_Y}>
      <Container>
        <Reveal>
          <HomeOpener as="p">{t.eyebrow}</HomeOpener>
        </Reveal>
        <div className={cn(styles.teaser, "mt-3 min-[90rem]:mt-8")}>
          <Reveal className={styles.teaserText}>
            {/* From 1440px: a 3D bar chart over the title, as the tiles carry theirs. */}
            <div
              aria-hidden="true"
              className="mb-8 hidden a-rise min-[90rem]:block"
              style={{ animationDelay: "120ms" }}
            >
              <span className={styles.visual}>
                <Image src={DASHBOARDS_ICON} alt="" width={96} height={96} className={styles.icon} />
              </span>
            </div>
            <h2 id="dashboards-title" className="t-h3 a-rise" style={{ animationDelay: "180ms" }}>
              {t.title}
            </h2>
            <p className="t-eyebrow mt-4 text-accent a-rise" style={{ animationDelay: "240ms" }}>
              {t.notice}
            </p>
          </Reveal>
          <div className={cn(dashStyles.root, styles.teaserPlate)}>
            <Reveal>
              <TeaserPlate ctx={ctx} />
            </Reveal>
          </div>
          {/* After the plate; from 1440px right under the notice (home.module.css). */}
          <LinkArrow href={localePath(lang, "/dashboards")} className={cn(styles.teaserLink, "mt-2")}>
            {pagesExtra[lang].home.dashboardsExplore}
          </LinkArrow>
        </div>
      </Container>
    </Section>
  );
}
