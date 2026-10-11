import { localePath, type Locale } from "@/i18n/config";
import { pagesExtra } from "@/i18n/extra/pages";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { ArtCredit } from "./ArtCredit";
import { REASON_ICON, TEAM_AVATARS } from "./home-art";
import { HOME_SECTION_Y, HomeOpener, HomeTiles, type Tile } from "./HomeTiles";

/** The reasons in chapter order, each with the page it links to. */
const REASONS = [
  { key: "process", path: "/process" },
  { key: "security", path: "/security" },
  { key: "team", path: "/team" },
] as const;

/**
 * Home · three short reasons in one row, each a link to the page that backs
 * it up: a clear process → /process, security first → /security, a team in
 * Dar es Salaam → /team. No index: the pages' chapter numbers (03–05) would
 * follow 01 with no 02 on this page (02 is the estimator on /services), and
 * the showcase between them carries none either.
 *
 * The same centred tiles as "What we do" (iteration-5 §B, §D): the owner's
 * notepad for the process, the shield for security and, for the team, the
 * three real portraits as overlapping avatars, in the /team order. Under
 * the last row of tiles, the credits and licences of the open-source work
 * the home page uses (ArtCredit).
 */
export function HomeReasons({ lang }: { lang: Locale }) {
  const r = pagesExtra[lang].home.reasons;

  const tiles: Tile[] = REASONS.map(({ key, path }) => ({
    key,
    href: localePath(lang, path),
    title: r.items[key].title,
    line: r.items[key].body,
    ...(key === "team" ? { avatars: TEAM_AVATARS } : { icon: REASON_ICON[key] }),
  }));

  return (
    <Section id="why" labelledBy="why-title" compact className={HOME_SECTION_Y}>
      <Container>
        <Reveal>
          <HomeOpener id="why-title">{r.title}</HomeOpener>
          <HomeTiles tiles={tiles} />
          <ArtCredit lang={lang} className="mt-2 sm:mt-6" />
        </Reveal>
      </Container>
    </Section>
  );
}
