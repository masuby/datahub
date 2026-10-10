import type { Locale } from "@/i18n/config";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DashboardShowcase } from "@/components/dash/DashboardShowcase";
import { makeDashCtx } from "@/components/dash/make-ctx";
import { BandEdges } from "@/components/dash/Plate";
import type { ViewKey } from "@/components/dash/context";

const VIEWS: ViewKey[] = ["overview", "loans", "sales", "operations"];

/**
 * 02 Sample dashboards (spec §6.3). An ink band in both themes. The views
 * render inside the DashboardShowcase island from `ctx` (plain data): the
 * first in the server HTML, the other three once the page is idle — see the
 * island for why. Every number is labelled sample data.
 */
export async function Dashboards({ lang }: { lang: Locale }) {
  const ctx = await makeDashCtx(lang, "dh", true);
  const t = ctx.t;
  return (
    <Section id="dashboards" labelledBy="dashboards-title" ink>
      <BandEdges />
      <Container>
        <SectionHeader index="02" eyebrow={t.eyebrow} title={t.title} titleId="dashboards-title" lead={t.lead}>
          <p className="t-eyebrow mt-5 text-accent">{t.notice}</p>
        </SectionHeader>
        <p id="dh-keys" className="sr-only">
          {ctx.a11y.sampleFigure} {ctx.a11y.chartKeys}
        </p>
        <Reveal>
          <DashboardShowcase
            ctx={ctx}
            tabs={VIEWS.map((v) => ({
              id: v,
              index: t.views[v].index,
              name: t.views[v].tab,
              description: t.views[v].tabDescription,
            }))}
            labels={{
              tablist: t.tablistLabel,
              readOn: t.read.on,
              readOff: t.read.off,
              readHint: t.readHint,
            }}
          />
        </Reveal>
      </Container>
    </Section>
  );
}
