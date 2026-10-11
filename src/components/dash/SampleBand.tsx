import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SamplePlate, type SampleService } from "./SamplePlate";
import { makeDashCtx } from "./make-ctx";
import styles from "./dash.module.css";

/** The band's section number on a service page. */
const SECTION = "03";

/**
 * The sample band on service pages ("03 — See it in a sample", spec §7.4):
 * a few figures of the sample dashboards, with read-mode notes always
 * shown as numbered lists; `service` picks the figures (see SamplePlate).
 * It sits on the page background and follows the visitor's theme, like
 * every other section (iteration 2, §C): no ink surface.
 *
 * SAMPLE stamp, honesty notice and credit lines on every plate. The plate
 * sits in <Reveal> so its charts draw when scrolled to.
 */
export async function SampleBand({
  lang,
  service,
  total = 6,
}: {
  lang: Locale;
  service: SampleService;
  /** Number of numbered sections on the hosting page (the band is "03"). */
  total?: number;
}) {
  const dict = await getDictionary(lang);
  const ctx = await makeDashCtx(lang, `sb-${service}`);
  const s = dict.servicePage.sample;

  return (
    <Section id="sample" labelledBy="sample-title">
      <Container>
        <SectionHeader index={SECTION} total={total} eyebrow={s.eyebrow} title={s.title} titleId="sample-title" lead={s.lead}>
          <p className="t-eyebrow mt-5 text-accent">{ctx.t.notice}</p>
        </SectionHeader>
        <div
          className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12"
          style={{ columnGap: "var(--col-gap)" }}
        >
          {/* Centred under the centred header (iteration-5 §B). */}
          <div className={`${styles.root} col-span-4 sm:col-span-8 lg:col-span-10 lg:col-start-2`}>
            <Reveal>
              <SamplePlate ctx={ctx} service={service} section={SECTION} />
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
