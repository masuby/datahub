import { localePath, type Locale } from "@/i18n/config";
import { pagesExtra } from "@/i18n/extra/pages";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { ArtCredit } from "./ArtCredit";
import { REASON_ICON, TEAM_AVATARS } from "./home-art";
import { HOME_SECTION_Y, HomeOpener, HomeTiles, type Tile } from "./HomeTiles";

/**
 * The reasons in chapter order, each with the page it links to and that
 * page's chapter number (as in the menu), so the row reads 04 · 05 · 06.
 */
const REASONS = [
  { key: "process", path: "/process", index: "04" },
  { key: "security", path: "/security", index: "05" },
  { key: "team", path: "/team", index: "06" },
] as const;

/**
 * Home · three short reasons in one row, each a link to the page that backs
 * it up: a clear process → /process, security first → /security, a team in
 * Dar es Salaam → /team. Each carries the chapter number of that page.
 *
 * The same tiles as "What we do" (iteration-3 §C): a notepad for the
 * process, a shield for security and, for the team, the three real
 * portraits as overlapping avatars, in the /team order. Under the last
 * row of tiles, the 3D icons' credit and licence (ArtCredit).
 */
export function HomeReasons({ lang }: { lang: Locale }) {
  const r = pagesExtra[lang].home.reasons;

  const tiles: Tile[] = REASONS.map(({ key, path, index }) => ({
    key,
    href: localePath(lang, path),
    index,
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
