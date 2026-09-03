import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

/**
 * FAQ.
 *
 * Does two jobs. For visitors it answers the objections that otherwise end a
 * conversation before it starts — price, location, whether their existing
 * spreadsheets can be salvaged. For search it adds the only substantial body of
 * indexable text on an otherwise short marketing page, phrased the way people
 * in Tanzania actually type queries, and backs it with FAQPage structured data.
 *
 * The answers here are the single source of truth: `page.tsx` builds the JSON-LD
 * from this same array, so the markup can never drift from what is rendered.
 */

export const FAQ_ITEMS = [
  {
    q: "What does DataHub do?",
    a: "DataHub builds custom dashboards, automated reporting systems and business intelligence tools for organisations in Tanzania. We take the numbers already scattered across your spreadsheets, systems and branches, and turn them into one place your team can make decisions from.",
  },
  {
    q: "Where are you based, and do you work outside Dar es Salaam?",
    a: "We are based in Dar es Salaam, Tanzania, and work with organisations across the country and beyond. Most of the work is done remotely, with on-site sessions where scoping or training needs them.",
  },
  {
    q: "Can you automate the reports we currently build in Excel?",
    a: "Yes — that is the most common place we start. If your team spends hours each week copying between spreadsheets, formatting and emailing the same report, that whole process can usually be replaced by a system that generates it in seconds and delivers it automatically.",
  },
  {
    q: "How much does a dashboard or reporting system cost?",
    a: "It depends on what you need, and anyone quoting before understanding your workflow is guessing. Tell us which report or process costs your team the most time and we will scope it with you — the first conversation costs nothing, and if it is not worth building we will say so.",
  },
  {
    q: "Do you use tools like Power BI, or do you build custom platforms?",
    a: "Both, chosen to fit the problem. Off-the-shelf business intelligence tools are a good fit when your data is already clean and the questions are standard. When your workflow, approval chain or report formats are specific to how your organisation runs, a custom platform fits better and costs less to live with.",
  },
  {
    q: "Is our data safe?",
    a: "Security is designed in, not bolted on. Systems are built with encrypted credentials, role-based access so people only see what their role allows, validated inputs and hardened endpoints. Your data stays yours — it is never shared or resold.",
  },
  {
    q: "How long does a project take?",
    a: "A focused dashboard or a single automated report is typically a matter of weeks. A full reporting platform covering several departments takes longer. We scope in stages so something useful reaches your team early rather than at the very end.",
  },
  {
    q: "Do you also build AI agents?",
    a: "Yes. Beyond dashboards, we design agents that read your operational data, summarise what changed, and act on it — chasing follow-ups, flagging exceptions, or drafting the reports somebody currently writes by hand.",
  },
];

export function Faq() {
  return (
    <section
      id="faq"
      className="scroll-mt-20 border-t border-border py-24"
    >
      <Container>
        <Reveal className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            Questions
          </p>
          <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            What people ask before they start
          </h2>
        </Reveal>

        <div className="mx-auto mt-12 max-w-3xl divide-y divide-border border-t border-border">
          {FAQ_ITEMS.map((item, i) => (
            <Reveal key={item.q} delay={Math.min(i, 4) * 0.05}>
              {/* Native <details> so answers are in the DOM for crawlers and
                  keyboard-accessible without any JavaScript. */}
              <details className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-medium text-foreground marker:hidden [&::-webkit-details-marker]:hidden">
                  <h3 className="text-base sm:text-lg">{item.q}</h3>
                  <span
                    aria-hidden="true"
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-border text-muted transition group-open:rotate-45 group-open:border-accent/50 group-open:text-accent"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
                  {item.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
