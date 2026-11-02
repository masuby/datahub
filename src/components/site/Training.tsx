import { getImageProps } from "next/image";
import { localePath, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { offersExtra } from "@/i18n/extra/offers";
import { Container } from "@/components/ui/Container";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";
import { CommittedPicture } from "./home/CommittedPicture";
import { TEAM_AVATARS } from "./home/home-art";
import { PrefillLink } from "./PrefillLink";
import styles from "./Training.module.css";

/**
 * Training (/training; owner, 2 Nov 2026): two days, from Excel to
 * automated reports and dashboards, at the prices of the printed sheet.
 *
 * A centred header; the two formats as centred columns (in-house for a
 * team, the open class), each with its price and a link that opens the
 * contact page with the request already begun (PrefillLink); the next open
 * class's date, or that it is coming; the two days; who it is for, what you
 * take home and what you need; the trainer, with his portrait from the team
 * page. Layout in Training.module.css.
 */
export async function Training({ lang }: { lang: Locale }) {
  const t = await getDictionary(lang);
  const x = offersExtra[lang].training;
  const contact = localePath(lang, "/contact");
  const trainer = t.team.members.cto;
  const avatar = getImageProps({ src: TEAM_AVATARS[0], alt: "", width: 72, height: 72 }).props;

  return (
    <Section id="training" labelledBy="training-title">
      <Container>
        <SectionHeader eyebrow={x.eyebrow} title={x.title} titleId="training-title" lead={x.lead} headingLevel={1} />

        <Reveal>
          <ul role="list" aria-label={x.formatsLabel} className={styles.formats}>
            {x.formats.map((f, i) => (
              <li key={f.key} id={f.key} className={cn(styles.format, "a-rise")} style={{ animationDelay: `${i * 60}ms` }}>
                <div className={styles.formatCard}>
                  <h2 className="t-h3">{f.name}</h2>
                  <p className={styles.priceBlock}>
                    <span className={styles.price}>{f.price}</span>
                    <span className="t-small text-muted">{f.priceNote}</span>
                  </p>
                  <ul role="list" className={cn("t-small", styles.lines)}>
                    {f.lines.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                  <PrefillLink href={contact} message={f.prefill} className={styles.cta}>
                    {f.cta}
                  </PrefillLink>
                </div>
              </li>
            ))}
          </ul>
          <p className={cn("t-small text-muted", styles.openNext)}>{x.openNext}</p>
        </Reveal>

        <Reveal>
          <div className={styles.block}>
            <h2 className="t-h2 a-rise">{x.daysTitle}</h2>
            <ul role="list" className={cn(styles.days, "mt-8")}>
              {x.days.map((day) => (
                <li key={day.name} className={cn(styles.day, "a-rise")}>
                  <div className={styles.dayCard}>
                    <h3 className="t-title">{day.name}</h3>
                    <ul role="list" className={cn("t-body text-muted", styles.dayList)}>
                      {day.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal>
          <div className={styles.block}>
            <ul role="list" className={styles.facts}>
              <li className={cn(styles.fact, "a-rise")}>
                <div className={styles.factCard}>
                  <h2 className="t-eyebrow">{x.forTitle}</h2>
                  <p className="t-body mt-3 text-muted">{x.forText}</p>
                </div>
              </li>
              <li className={cn(styles.fact, "a-rise")}>
                <div className={styles.factCard}>
                  <h2 className="t-eyebrow">{x.takeTitle}</h2>
                  <ul role="list" className="t-body mt-3 grid gap-1.5 text-muted">
                    {x.takeItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </li>
              <li className={cn(styles.fact, "a-rise")}>
                <div className={styles.factCard}>
                  <h2 className="t-eyebrow">{x.needTitle}</h2>
                  <p className="t-body mt-3 text-muted">{x.needText}</p>
                </div>
              </li>
            </ul>
          </div>
        </Reveal>

        <Reveal>
          <div className={cn(styles.block, styles.trainer, "a-rise")}>
            <h2 className="t-eyebrow">{x.trainerTitle}</h2>
            <span aria-hidden="true" className={styles.avatarBox}>
              <CommittedPicture>
                {/* eslint-disable-next-line @next/next/no-img-element -- next/image's props, drawn only once committed (CommittedPicture) */}
                <img {...avatar} alt="" className={styles.avatar} />
              </CommittedPicture>
            </span>
            <p className="t-title mt-4">{trainer.name}</p>
            <p className="t-small mt-1 text-accent">{trainer.role}</p>
            <p className="t-body mt-3 max-w-[44ch] text-muted">{x.trainerText}</p>
            <LinkArrow href={localePath(lang, "/team")} className="mt-2">
              {x.trainerLink}
            </LinkArrow>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
