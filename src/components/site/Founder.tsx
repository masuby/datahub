import Image from "next/image";
import { BarChart3, Workflow, Bot } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { AnimatedDots } from "@/components/ui/AnimatedDots";

/**
 * Founder / about block.
 *
 * A buyer in Dar es Salaam is deciding whether to trust an unfamiliar website
 * with their operational data. A face and a name do more for that decision than
 * another paragraph of capability copy — so the portrait leads, and the three
 * capabilities sit beside it rather than being buried in prose.
 */

const capabilities = [
  {
    icon: BarChart3,
    title: "Reporting Platform",
    desc: "Live dashboards and scheduled reports, built around the numbers your team actually decides on.",
  },
  {
    icon: Workflow,
    title: "Automations",
    desc: "The repetitive spreadsheet work replaced by pipelines that run themselves, correctly, every time.",
  },
  {
    icon: Bot,
    title: "AI Agent Design",
    desc: "Agents that read your data, summarise what changed, and act on it without being asked twice.",
  },
];

export function Founder() {
  return (
    <section
      id="about"
      className="relative overflow-hidden scroll-mt-20 border-t border-border py-24"
    >
      <AnimatedDots className="pointer-events-none absolute inset-0 -z-10 h-full w-full" />
      <Container>
        <Reveal className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            Who builds it
          </p>
          <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            The engineer behind every system
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
          {/* Portrait */}
          <Reveal className="flex flex-col items-center text-center">
            <div className="rounded-full accent-gradient p-[3px] shadow-2xl shadow-black/40">
              <div className="overflow-hidden rounded-full bg-surface-2">
                <Image
                  src="/daniel-masubi.png"
                  alt="Daniel Clement Masubi, founder of DataHub"
                  width={640}
                  height={640}
                  sizes="(max-width: 640px) 176px, 224px"
                  className="h-44 w-44 object-cover object-top sm:h-56 sm:w-56"
                />
              </div>
            </div>

            <h3 className="mt-7 text-2xl font-semibold tracking-tight">
              Daniel Clement Masubi
            </h3>
            <p className="mt-1.5 text-sm font-semibold uppercase tracking-wider text-gradient">
              Data Engineer
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              You deal with the engineer directly — not an account manager.
            </p>
          </Reveal>

          {/* What he builds */}
          <div className="grid gap-y-9">
            {capabilities.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.08}>
                <div className="relative pl-5">
                  <span className="absolute left-0 top-1 h-[calc(100%-0.5rem)] w-[3px] rounded-full accent-gradient" />
                  <c.icon className="h-6 w-6 text-accent-2" strokeWidth={1.5} />
                  <h3 className="mt-3 text-lg font-semibold">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {c.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
