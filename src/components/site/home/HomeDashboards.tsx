import { localePath, type Locale } from "@/i18n/config";
import { pagesExtra } from "@/i18n/extra/pages";
import { makeDashCtx } from "@/components/dash/make-ctx";
import { Container } from "@/components/ui/Container";
import { Grid } from "@/components/ui/Grid";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import dashStyles from "@/components/dash/dash.module.css";
import { TeaserPlate, type TeaserCtx } from "./TeaserPlate";

/**
 * Home · 02 — Sample dashboards, short: the section header with the honesty
 * notice, one plate (View 1's KPI strip and revenue chart; on phones the
 * chart and its credit line, see TeaserPlate) in the title's columns, and
 * "Explore the sample dashboards →" to /dashboards, where all four views can
 * be explored.
 * In the visitor's own theme, like the dashboards page.
 */
export async function HomeDashboards({ lang }: { lang: Locale }) {
  const full = await makeDashCtx(lang, "home", false);
  const t = full.t;
  // View 1's strings only: the teaser shows nothing from the other three views.
  const ctx: TeaserCtx = { ...full, t: { ...t, views: { overview: t.views.overview } } };

  return (
    <Section id="dashboards" labelledBy="dashboards-title" compact>
      <Container>
        <SectionHeader index="02" eyebrow={t.eyebrow} title={t.title} titleId="dashboards-title" compact>
          <p className="t-eyebrow text-accent">{t.notice}</p>
        </SectionHeader>
        <Grid>
          <div className={`${dashStyles.root} col-span-4 sm:col-span-8 lg:col-span-9 lg:col-start-4`}>
            <Reveal>
              <TeaserPlate ctx={ctx} />
            </Reveal>
            <LinkArrow href={localePath(lang, "/dashboards")} className="mt-4">
              {pagesExtra[lang].home.dashboardsExplore}
            </LinkArrow>
          </div>
        </Grid>
      </Container>
    </Section>
  );
}
