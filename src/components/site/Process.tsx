import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { Container } from "@/components/ui/Container";
import { Grid } from "@/components/ui/Grid";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";
import styles from "./Process.module.css";

/**
 * 03 — How we work: the /process page (`headingLevel` 1 there, where its
 * title is the page's h1 and the step titles step up to h2).
 *
 * Four centred steps (iteration-5 §B), each under its node. Desktop: the
 * steps stand side by side (cols 1–3, 4–6, 7–9, 10–12) and one track joins
 * their nodes, from the first step's centre to the last's, with a fading
 * hairline between the steps below it. Below 1024px the steps stack, each
 * node above its step and a fading hairline between them; no track.
 *
 * The thread fills the track as the list scrolls through the viewport where
 * scroll-driven animation exists, and draws once on reveal elsewhere; the
 * nodes light as it reaches them (see Process.module.css). Zero client JS
 * beyond the shared <Reveal>.
 */
export async function Process({ lang, headingLevel = 2 }: { lang: Locale; headingLevel?: 1 | 2 }) {
  const t = (await getDictionary(lang)).process;
  const titleId = "process-title";
  const StepHeading = headingLevel === 1 ? "h2" : "h3";

  return (
    <Section id="process" labelledBy={titleId}>
      <Container>
        <SectionHeader
          index="03"
          eyebrow={t.eyebrow}
          title={t.title}
          titleId={titleId}
          lead={t.lead}
          headingLevel={headingLevel}
        />

        <Reveal>
          <div className={styles.flow}>
            <span aria-hidden="true" className={styles.track}>
              <span className={styles.fill} />
            </span>

            <Grid as="ol" className="list-none">
              {t.steps.map((step, i) => (
                <li
                  key={step.index}
                  className={cn(styles.step, "col-span-4 sm:col-span-8 lg:col-span-3")}
                >
                  {i > 0 && <span aria-hidden="true" className={styles.between} />}
                  <span aria-hidden="true" className={styles.node} />

                  <p className="t-eyebrow">{step.index}</p>
                  <StepHeading className="t-title mt-3">{step.title}</StepHeading>
                  <p className="t-body mt-3 max-w-[32ch] text-balance text-muted">{step.description}</p>
                  <p className="t-small mt-5 max-w-[32ch] text-balance text-fg">
                    <span className="t-data">{t.receivePrefix}</span> {step.receive}
                  </p>
                </li>
              ))}
            </Grid>
          </div>
        </Reveal>

        <p className="t-lead mx-auto mt-[clamp(3rem,2.2rem+3vw,5rem)] max-w-[40rem] text-center">{t.closing}</p>
      </Container>
    </Section>
  );
}
