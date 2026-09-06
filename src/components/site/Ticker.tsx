/**
 * Scrolling capability strip under the hero. Pure CSS marquee; the list is
 * rendered twice so the loop is seamless. Everything listed is something the
 * business actually does or uses — this is a statement, not decoration.
 */

const items = [
  "Executive dashboards",
  "Automated reporting",
  "Excel & PowerPoint exports",
  "Scheduled delivery",
  "Loan portfolio analytics",
  "PostgreSQL",
  "Python pipelines",
  "Role-based access",
  "AI agents",
  "Data engineering",
  "Built in Dar es Salaam",
];

export function Ticker() {
  const row = (
    <ul className="flex shrink-0 items-center gap-10 pr-10 font-mono text-[13px] uppercase tracking-[0.18em] text-muted-2">
      {items.map((t) => (
        <li key={t} className="flex items-center gap-10 whitespace-nowrap">
          {t}
          <span className="h-1 w-1 rounded-full bg-accent/60" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="ticker-mask overflow-hidden border-y border-border/70 py-4" aria-label="Capabilities">
      <div className="marquee flex w-max">
        {row}
        <div aria-hidden="true" className="flex shrink-0">
          {row}
        </div>
      </div>
    </div>
  );
}
