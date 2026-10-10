import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { HoursEstimatorClient } from "./HoursEstimatorClient";

/**
 * 03 — Where do the hours go? (spec §6.4, §10.2)
 *
 * Server shell: the section, its header and the strings. Everything that
 * reacts to input lives in the client island, which receives only the
 * `estimator` strings it renders (never the dictionary module).
 */
export async function HoursEstimator({ lang }: { lang: Locale }) {
  const { eyebrow, title, lead, ...strings } = (await getDictionary(lang)).estimator;

  return (
    <Section id="estimator" labelledBy="estimator-title">
      <Container>
        <SectionHeader index="03" eyebrow={eyebrow} title={title} titleId="estimator-title" lead={lead} />
        <Reveal>
          <HoursEstimatorClient s={strings} />
        </Reveal>
      </Container>
    </Section>
  );
}
