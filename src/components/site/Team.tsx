import { Fragment, type CSSProperties } from "react";
import Image from "next/image";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Rule } from "@/components/ui/Rule";
import { cn } from "@/lib/utils";
import styles from "./Team.module.css";

/**
 * Portraits: 740×990 transparent PNGs, head and shoulders, all aligned (eye
 * line at y = 360, pupils 130px apart), so equal boxes give equal heads.
 * Order is fixed and equal in size and spacing: no implied hierarchy.
 */
const PORTRAITS = [
  { key: "cto", src: "/team/daniel-masubi.png" },
  { key: "operations", src: "/team/kanuda-sasi.png" },
  { key: "marketing", src: "/team/yohana-mussa.png" },
] as const;

/**
 * Section 05, id=team: the /team page (`headingLevel` 1 there, where its
 * title is the page's h1 and the names step up to h2). Line-up on one shared
 * floor rule (spec §6.7), each member centred (iteration-5 §B).
 */
export async function Team({ lang, headingLevel = 2 }: { lang: Locale; headingLevel?: 1 | 2 }) {
  const t = (await getDictionary(lang)).team;
  const NameHeading = headingLevel === 1 ? "h2" : "h3";

  return (
    <Section id="team" labelledBy="team-title">
      <Container>
        <SectionHeader
          index="05"
          eyebrow={t.eyebrow}
          title={t.title}
          titleId="team-title"
          lead={t.lead}
          headingLevel={headingLevel}
        />

        <Reveal>
          <div className={styles.lineup}>
            {/* Desktop: the one floor all three stand on, and the two vertical
                R1 dividers that run down from it. They are siblings of the
                members, so the spotlight dims member content only and the line
                structure never changes. */}
            <Rule variant="floor" animate className={styles.floor} />
            <Rule vertical className={cn(styles.divider, styles.dividerMid)} />
            <Rule vertical className={cn(styles.divider, styles.dividerEnd)} />

            {PORTRAITS.map(({ key, src }, i) => {
              const m = t.members[key];
              const nameId = `team-${key}`;
              return (
                <Fragment key={key}>
                  {/* Mobile/tablet: R1 between rows, outside the members. */}
                  {i > 0 && <Rule className={styles.sep} />}

                  <article
                    aria-labelledby={nameId}
                    className={styles.member}
                    style={{ "--col": i * 4 + 1 } as CSSProperties}
                  >
                    <div className={styles.photo}>
                      <div className={cn(styles.frame, "a-rise")} style={{ animationDelay: `${120 + i * 60}ms` }}>
                        <span aria-hidden="true" className={styles.glow} />
                        <Image
                          src={src}
                          alt={m.alt}
                          width={740}
                          height={990}
                          sizes="(min-width: 1024px) 360px, (min-width: 640px) 272px, 240px"
                          quality={80}
                          // On /team the portraits are the first thing under the title.
                          loading={headingLevel === 1 ? "eager" : "lazy"}
                          className={styles.img}
                        />
                      </div>
                      {/* Equal for all three: a plain R2, no implied hierarchy. */}
                      <Rule variant="floor" animate className={styles.shortFloor} />
                    </div>

                    <div className={styles.head}>
                      <p className="t-eyebrow">{m.index}</p>
                      <NameHeading id={nameId} className="t-title mt-3 text-fg">
                        {m.name}
                      </NameHeading>
                      {/* Sentence case .t-small: roles run past three words in
                          Kiswahili (spec §2.2), and all three stay identical. */}
                      <p className="t-small mt-2 text-accent">{m.role}</p>
                    </div>

                    <p className={cn(styles.bio, "t-body text-muted")}>{m.bio}</p>
                  </article>
                </Fragment>
              );
            })}
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
