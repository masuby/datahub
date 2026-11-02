import { localePath, type Locale } from "@/i18n/config";
import { offersExtra } from "@/i18n/extra/offers";
import { Container } from "@/components/ui/Container";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";
import { PrefillLink } from "./PrefillLink";
import styles from "./Packages.module.css";

/**
 * Packages and prices (/packages; owner, 2 Nov 2026): the four fixed-price
 * packages and the training in brief, the same prices as the printed sheet.
 *
 * A centred header with the four steps of every package under its lead
 * (call, fixed quote, half to start, delivery and the balance), then the
 * packages as centred columns (layout in Packages.module.css). Each column:
 * name (h2), promise, price, time, what is included, care, and "Start with
 * this package →", which opens the contact page with the package and its
 * price already in the message (PrefillLink). No primary button per
 * package: the header carries the one call to action.
 */
export function Packages({ lang }: { lang: Locale }) {
  const p = offersExtra[lang].packages;
  const contact = localePath(lang, "/contact");

  return (
    <Section id="packages" labelledBy="packages-title">
      <Container>
        <SectionHeader eyebrow={p.eyebrow} title={p.title} titleId="packages-title" lead={p.lead} headingLevel={1}>
          <ol aria-label={p.stepsLabel} className={styles.steps}>
            {p.steps.map((step) => (
              <li key={step} className={styles.step}>
                {step}
              </li>
            ))}
          </ol>
        </SectionHeader>

        <Reveal>
          <ul role="list" className={styles.list}>
            {p.items.map((item, i) => (
              <li
                key={item.key}
                id={item.key}
                className={cn(styles.item, "a-rise")}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className={styles.card}>
                  <h2 className={styles.name}>{item.name}</h2>
                  <p className={cn("t-body text-muted", styles.promise)}>{item.promise}</p>
                  <p className={styles.priceBlock}>
                    {item.priceLead && <span className="t-small text-muted">{item.priceLead}</span>}
                    <span className={styles.price}>{item.price}</span>
                    <span className={cn("t-small text-muted", styles.priceNote)}>{item.priceNote}</span>
                  </p>
                  <p className={cn("t-data", styles.time)}>{item.time}</p>
                  <ul role="list" className={cn("t-small", styles.includes)}>
                    {item.includes.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                  <p className={cn("t-small text-muted", styles.care)}>{item.care}</p>
                  <PrefillLink href={contact} message={item.prefill} className={styles.cta}>
                    {p.cta}
                  </PrefillLink>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal>
          <div className={cn(styles.training, "a-rise")}>
            <h2 className="t-h3">{p.training.name}</h2>
            <p className="t-body mt-2 max-w-[40ch] text-muted">{p.training.promise}</p>
            <p className={styles.trainingPrices}>{p.training.prices}</p>
            <LinkArrow href={localePath(lang, "/training")} className="mt-2">
              {p.training.link}
            </LinkArrow>
          </div>
        </Reveal>

        <p className="t-small mx-auto mt-10 max-w-[40rem] text-center text-muted lg:mt-14">{p.notes}</p>
      </Container>
    </Section>
  );
}
