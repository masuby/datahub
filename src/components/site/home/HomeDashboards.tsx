import Image from "next/image";
import { localePath, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { pagesExtra } from "@/i18n/extra/pages";
import { showcaseExtra } from "@/i18n/extra/showcase";
import { Container } from "@/components/ui/Container";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";
import { DASHBOARDS_ICON } from "./home-art";
import { CommittedPicture } from "./CommittedPicture";
import { HOME_SECTION_Y } from "./HomeTiles";
import { Showcase } from "./showcase/Showcase";
import styles from "./home.module.css";

/**
 * Home · the sample dashboard as a live, shining screen (iteration-5 §H):
 * the dashboards icon crowning a centred header (eyebrow, title, and the
 * notice that it is sample data), then the Showcase — a device with a glow
 * rising behind it and a dashboard inside that ticks along by itself — and
 * "How we build dashboards →" to the dashboards service page under it.
 *
 * It replaced the sample-dashboards page (iteration-5 §I), so its eyebrow
 * carries no chapter number. Keep id="dashboards": /dashboards redirects to
 * it (src/proxy.ts, MOVED) and the hero's "See a live sample ↓" jumps to it.
 *
 * The section clips sideways (overflow-x: clip) so the glow can spread past
 * the page container to the edges of the window, never beyond them.
 *
 * The icon is a srcset image, so CommittedPicture makes it (see there).
 */
export async function HomeDashboards({ lang }: { lang: Locale }) {
  const t = (await getDictionary(lang)).dash;

  return (
    <Section id="dashboards" labelledBy="dashboards-title" compact className={cn(HOME_SECTION_Y, "overflow-x-clip")}>
      <Container>
        <Reveal className="flex justify-center">
          <span aria-hidden="true" className={cn(styles.visual, "a-rise")} style={{ animationDelay: "60ms" }}>
            <CommittedPicture>
              <Image src={DASHBOARDS_ICON} alt="" width={104} height={104} className={styles.icon} />
            </CommittedPicture>
          </span>
        </Reveal>
        {/* No margin under the header: the stage's own room for the glow is the gap. */}
        <SectionHeader
          index="02"
          eyebrow={t.eyebrow}
          title={t.title}
          titleId="dashboards-title"
          compact
          className="mt-3 mb-0 sm:mb-0"
        >
          <p className="t-eyebrow mt-4 text-accent">{t.notice}</p>
        </SectionHeader>
        <Reveal>
          <Showcase t={showcaseExtra[lang]} />
        </Reveal>
        <div className="mt-6 flex justify-center sm:mt-8">
          <LinkArrow href={localePath(lang, "/services/dashboards")}>{pagesExtra[lang].home.dashboardsService}</LinkArrow>
        </div>
      </Container>
    </Section>
  );
}
