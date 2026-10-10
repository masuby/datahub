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
 * 04 — How we work.
 *
 * Four steps on one track. Desktop: the track runs across the 12 columns with
 * a node at the start of cols 1, 4, 7 and 10 and a hairline dropping from each
 * node beside its step. Below 1024px the track turns vertical at the left edge
 * and the steps stack, separated by hairlines.
 *
 * The thread fills the track as the list scrolls through the viewport where
 * scroll-driven animation exists, and draws once on reveal elsewhere (see
 * Process.module.css). Zero client JS beyond the shared <Reveal>.
 */
export async function Process({ lang }: { lang: Locale }) {
  const t = (await getDictionary(lang)).process;
  const titleId = "process-title";

  return (
    <Section id="process" labelledBy={titleId} deferPaint>
      <Container>
        <SectionHeader index="04" eyebrow={t.eyebrow} title={t.title} titleId={titleId} lead={t.lead} />

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
                  <span aria-hidden="true" className={styles.node} />
                  {i > 0 && <span aria-hidden="true" className={styles.between} />}
                  <span aria-hidden="true" className={styles.drop} />

                  <p className="t-eyebrow">{step.index}</p>
                  <h3 className="t-title mt-3">{step.title}</h3>
                  <p className="t-body mt-3 text-muted">{step.description}</p>
                  <p className="t-small mt-5 text-fg">
                    <span className="t-data">{t.receivePrefix}</span> {step.receive}
                  </p>
                </li>
              ))}
            </Grid>
          </div>
        </Reveal>

        <Grid className="mt-[clamp(3rem,2.2rem+3vw,5rem)]">
          <p className="t-lead col-span-4 sm:col-span-8 lg:col-span-9 lg:col-start-4">{t.closing}</p>
        </Grid>
      </Container>
    </Section>
  );
}
