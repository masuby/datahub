import Link from "next/link";
import { localePath, type Locale } from "@/i18n/config";
import { pagesExtra } from "@/i18n/extra/pages";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Rule } from "@/components/ui/Rule";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

/**
 * The reasons in chapter order, each with the page it links to and that
 * page's chapter number (as in the menu), so the row reads 04 · 05 · 06.
 */
const REASONS = [
  { key: "process", path: "/process", index: "04" },
  { key: "security", path: "/security", index: "05" },
  { key: "team", path: "/team", index: "06" },
] as const;

const ARROW_MOVE =
  "inline-block transition-transform duration-[280ms] ease-[var(--ease-silk)] group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5";

/**
 * Home · three short reasons in one row, each a link to the page that backs
 * it up: a clear process → /process, security first → /security, a team in
 * Dar es Salaam → /team. Each carries the chapter number of that page.
 *
 * An R2 opener and a small heading, then three columns (cols 1–4, 5–8,
 * 9–12) divided by vertical hairlines, as in the hero's service index;
 * below 1024px they stack with hairlines between, each on two lines: the
 * number, title and arrow, then the line under the title (the wrapper of
 * number and arrow steps aside with `display: contents`). Hover/focus: the
 * thread underlines the title, the number turns accent, the arrow moves 6px.
 */
export function HomeReasons({ lang }: { lang: Locale }) {
  const r = pagesExtra[lang].home.reasons;

  return (
    <Section id="why" labelledBy="why-title" compact>
      <Container>
        <Reveal>
          <Rule variant="section" animate />
          <h2 id="why-title" className="t-eyebrow mt-5 a-rise lg:mt-6" style={{ animationDelay: "120ms" }}>
            {r.title}
          </h2>
          <ul role="list" className="mt-4 grid list-none grid-cols-1 p-0 lg:mt-8 lg:grid-cols-12" style={{ columnGap: "var(--col-gap)" }}>
            {REASONS.map(({ key, path, index }, i) => (
              <li
                key={key}
                className={cn(
                  "relative lg:col-span-4",
                  i > 0 &&
                    "lg:before:absolute lg:before:inset-y-0 lg:before:left-[calc(var(--col-gap)/-2)] lg:before:w-px lg:before:bg-rule lg:before:content-['']",
                )}
              >
                {i > 0 && <Rule className="lg:hidden" />}
                <Link
                  href={localePath(lang, path)}
                  className="group relative grid h-full grid-cols-[auto_minmax(0,1fr)_auto] items-baseline py-3.5 text-fg lg:flex lg:flex-col lg:items-stretch lg:py-2 lg:pr-6"
                  style={{ columnGap: "var(--col-gap)" }}
                >
                  <span className="contents lg:flex lg:items-baseline lg:justify-between lg:gap-4">
                    <span className="t-eyebrow col-start-1 row-start-1 transition-colors duration-[160ms] group-hover:text-accent group-focus-visible:text-accent">
                      {index}
                    </span>
                    <span aria-hidden="true" className={`${ARROW_MOVE} col-start-3 row-start-1 font-sans text-lg leading-none`}>
                      →
                    </span>
                  </span>
                  <h3 className="t-title col-start-2 row-start-1 lg:mt-3">
                    <span className="link-thread pb-0.5 group-hover:[background-size:100%_2px] group-focus-visible:[background-size:100%_2px]">
                      {r.items[key].title}
                    </span>
                  </h3>
                  <p className="t-small col-span-2 col-start-2 row-start-2 mt-1 font-normal text-muted lg:mt-2">{r.items[key].body}</p>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </Section>
  );
}
