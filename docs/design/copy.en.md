# DataHub copy deck: English (en)

Source for `src/i18n/dictionaries/en.ts`. `sw.ts` must have exactly the same keys (a key-parity test enforces it).

Conventions:
- One line per key: `key` → value. Arrays use `[0]`, `[1]`… Objects in arrays use `[0].field`.
- `{name}` is an interpolation slot. Never concatenate translated fragments in code; use the slots.
- Typography: real apostrophes (’) and dashes (—, –) as written; the ellipsis is one character (…).
- No exclamation marks. No hype words. No invented facts. Numbers inside `dash.*` are sample data and are always shown under a "sample" label.
- Service page body copy lives in `src/lib/services.ts` (English) and `src/lib/services.sw.ts` (Kiswahili), not in this deck. Only home-page summaries and page chrome are here.
- Fewer words (iteration 2, §D): headlines up to about eight words, leads one sentence, body paragraphs at most two sentences, FAQ answers at most two short sentences, no claim repeated across sections or pages.

---

## meta

- `meta.siteName` → DataHub
- `meta.titleTemplate` → %s · DataHub
- `meta.home.title` → DataHub — Data Analytics & Dashboards in Tanzania
- `meta.home.description` → Custom dashboards, reporting automation and AI agents for organisations in Tanzania. Built in Dar es Salaam by the DataHub team.
- `meta.home.ogTitle` → DataHub — Data Analytics & Dashboards in Tanzania
- `meta.home.ogDescription` → Dashboards, reporting automation and AI agents for organisations in Tanzania. From Data to Decisions.
- `meta.privacy.title` → Privacy notice
- `meta.privacy.description` → What DataHub collects through this website, why, and how to ask for it to be deleted.
- `meta.notFound.title` → Page not found
- `meta.keywords[0]` → data analytics Tanzania
- `meta.keywords[1]` → business dashboards
- `meta.keywords[2]` → reporting automation
- `meta.keywords[3]` → business intelligence
- `meta.keywords[4]` → AI agents
- `meta.keywords[5]` → dashboard developer Dar es Salaam
- `meta.keywords[6]` → custom software Tanzania

## a11y (shared accessibility strings)

- `a11y.skip` → Skip to content
- `a11y.opensNewTab` → (opens in a new tab)
- `a11y.external` → external link
- `a11y.sampleFigure` → Sample chart. All figures are invented.
- `a11y.chartKeys` → Use the left and right arrow keys to move through the data.
- `a11y.today` → Today:
- `a11y.withDataHub` → With DataHub:

## brand

- `brand.homeLink` → DataHub, home
- `brand.tagline` → From Data to Decisions

## nav (header, desktop)

- `nav.label` → Main
- `nav.services` → Services
- `nav.dashboards` → Dashboards
- `nav.process` → Process
- `nav.security` → Security
- `nav.team` → Team
- `nav.faq` → FAQ

## header

- `header.cta` → Start a conversation
- `header.menuOpen` → Menu
- `header.menuClose` → Close
- `header.menuLabel` → Site menu
- `header.progressLabel` → Reading progress

## menu (mobile sheet, numbered 01–08)

- `menu.items[0]` → Services
- `menu.items[1]` → Sample dashboards
- `menu.items[2]` → Your numbers
- `menu.items[3]` → How we work
- `menu.items[4]` → Security
- `menu.items[5]` → Team
- `menu.items[6]` → Questions
- `menu.items[7]` → Contact
- `menu.whatsapp` → Message us on WhatsApp
- `menu.preferences` → Preferences

## theme

- `theme.toggle.toDark` → Switch to dark theme
- `theme.toggle.toLight` → Switch to light theme
- `theme.settings.legend` → Theme
- `theme.settings.system` → System
- `theme.settings.light` → Light
- `theme.settings.dark` → Dark

## lang

- `lang.legend` → Language
- `lang.en.short` → EN
- `lang.sw.short` → SW
- `lang.en.name` → English
- `lang.sw.name` → Kiswahili
- `lang.en.switchLabel` → Read this page in English
- `lang.sw.switchLabel` → Read this page in Kiswahili

## langHint

The suggestion is shown in the target language on purpose.

- `langHint.toSw` → Ukurasa huu unapatikana kwa Kiswahili
- `langHint.toSwLink` → Soma kwa Kiswahili →
- `langHint.toEn` → This page is available in English
- `langHint.toEnLink` → Read in English →
- `langHint.dismiss` → Dismiss

## motion

- `motion.pause` → Pause motion
- `motion.resume` → Resume motion
- `motion.legend` → Motion
- `motion.on` → On
- `motion.off` → Off

---

## hero (00)

- `hero.ctaPrimary` → Start a conversation
- `hero.ctaSecondary` → See sample dashboards

## serviceIndex (hero bottom links)

- `serviceIndex.label` → Our services
- `serviceIndex.items[0].index` → 01.1
- `serviceIndex.items[0].label` → Dashboards & BI
- `serviceIndex.items[1].index` → 01.2
- `serviceIndex.items[1].label` → Reporting automation
- `serviceIndex.items[2].index` → 01.3
- `serviceIndex.items[2].label` → AI agents

---

## services (01)

- `services.eyebrow` → 01 — What we do
- `services.title` → Three ways we turn data into decisions.
- `services.lead` → Each starts from work your team already does by hand.
- `services.readMore` → Read more
- `services.items.dashboards.index` → 01.1
- `services.items.dashboards.title` → Dashboards & business intelligence
- `services.items.dashboards.tagline` → One place your team decides from
- `services.items.dashboards.description` → Current figures against target, by branch, department or officer.
- `services.items.dashboards.glyphLabel` → A line rising towards a target mark
- `services.items.automation.index` → 01.2
- `services.items.automation.title` → Reporting automation
- `services.items.automation.tagline` → Hours of manual work, done in seconds
- `services.items.automation.description` → The Excel and PowerPoint reports your team rebuilds every week, generated for you.
- `services.items.automation.glyphLabel` → Three lines merging into one
- `services.items.aiAgents.index` → 01.3
- `services.items.aiAgents.title` → AI agents
- `services.items.aiAgents.tagline` → Software that reads, then drafts the next step
- `services.items.aiAgents.description` → Agents that watch your data, summarise what changed and draft the next step for a person to approve.
- `services.items.aiAgents.glyphLabel` → Three connected points, one marked for approval

Deliverable labels under each row are read from `services.ts` (`deliverables[].title`) and are not repeated here.

---

## dash (02, sample dashboards)

### Shared

- `dash.eyebrow` → 02 — Sample dashboards
- `dash.title` → See what Monday morning could look like.
- `dash.lead` → Four views, built the way we build for clients.
- `dash.notice` → Sample data — we never publish client dashboards
- `dash.stamp` → SAMPLE DATA
- `dash.footnote` → Every name and number here is invented.
- `dash.credit` → Source: DataHub sample data · TZS · {period}
- `dash.figPrefix` → Fig.
- `dash.tablistLabel` → Sample dashboard views
- `dash.showTable` → View as table
- `dash.readHint` → Shows what each chart is for, and the decision it supports.
- `dash.read.on` → Explain this view
- `dash.read.off` → Hide explanations
- `dash.read.listLabel` → What this chart tells you
- `dash.read.markerLabel` → Explanation {n}
- `dash.read.decisionPrefix` → Decision:
- `dash.readout.idle` → Move across the chart to read values
- `dash.status.onTarget` → On target
- `dash.status.watch` → Watch
- `dash.status.breach` → Breach
- `dash.status.done` → Done
- `dash.status.sent` → Sent
- `dash.status.awaiting` → Awaiting approval
- `dash.status.queued` → Queued for review
- `dash.units.bn` → bn
- `dash.units.mn` → mn
- `dash.units.hours` → h
- `dash.units.seconds` → s
- `dash.units.minutes` → min
- `dash.units.percent` → %
- `dash.months[0]` → Jan
- `dash.months[1]` → Feb
- `dash.months[2]` → Mar
- `dash.months[3]` → Apr
- `dash.months[4]` → May
- `dash.months[5]` → Jun
- `dash.months[6]` → Jul
- `dash.months[7]` → Aug
- `dash.months[8]` → Sep
- `dash.months[9]` → Oct
- `dash.months[10]` → Nov
- `dash.months[11]` → Dec
- `dash.table.month` → Month
- `dash.table.value` → Value
- `dash.table.target` → Target

### View 1: overview

- `dash.views.overview.index` → 02.1
- `dash.views.overview.tab` → Executive overview
- `dash.views.overview.tabDescription` → The month on one screen, for leadership.
- `dash.views.overview.entity` → Sample lender (microfinance)
- `dash.views.overview.period` → Jan–Sep 2026
- `dash.views.overview.creditPeriod` → Jan–Sep 2026
- `dash.views.overview.kpis[0].label` → Revenue, year to date
- `dash.views.overview.kpis[0].context` → 94% of TZS 19.6 bn target
- `dash.views.overview.kpis[1].label` → Collection efficiency
- `dash.views.overview.kpis[1].context` → Target 95.0%
- `dash.views.overview.kpis[2].label` → Active borrowers
- `dash.views.overview.kpis[2].context` → +6.1% since end of June
- `dash.views.overview.kpis[3].label` → Cost-to-income
- `dash.views.overview.kpis[3].context` → Ceiling 60.0%
- `dash.views.overview.figures.revenue.number` → 02.1
- `dash.views.overview.figures.revenue.title` → Revenue against target, by month
- `dash.views.overview.figures.revenue.axis` → TZS bn
- `dash.views.overview.figures.revenue.seriesActual` → Revenue
- `dash.views.overview.figures.revenue.seriesTarget` → Target
- `dash.views.overview.figures.revenue.readout` → {month} · TZS {value} bn · {pct}% of target
- `dash.views.overview.figures.revenue.summary` → Revenue stayed below the TZS 2.18 bn monthly target until September, when it reached TZS 2.30 bn.
- `dash.views.overview.figures.branches.number` → 02.2
- `dash.views.overview.figures.branches.title` → Branches, % of revenue target
- `dash.views.overview.figures.branches.axis` → % of target
- `dash.views.overview.figures.branches.readout` → {branch} · {pct}% of target
- `dash.views.overview.figures.branches.summary` → Only Kariakoo is above target (104%); Dodoma (88%) and Mbeya (84%) are below 90%.
- `dash.views.overview.figures.exceptions.number` → 02.3
- `dash.views.overview.figures.exceptions.title` → Exceptions
- `dash.views.overview.figures.exceptions.items[0]` → Mbeya PAR30 7.2% (limit 5.0%)
- `dash.views.overview.figures.exceptions.items[1]` → Dodoma PAR30 5.4% (limit 5.0%)
- `dash.views.overview.figures.exceptions.items[2]` → Dodoma disbursements 18% below plan
- `dash.views.overview.figures.exceptions.items[3]` → Board pack generated 05:58, sent to 9 recipients
- `dash.views.overview.figures.exceptions.summary` → Two PAR30 breaches, one branch behind on disbursements, and the board pack on time.
- `dash.views.overview.changed.label` → What changed this week
- `dash.views.overview.changed.byline` → Written by the reporting agent · sample
- `dash.views.overview.changed.items[0]` → Mbeya PAR30 rose 0.8 points to 7.2%, mostly from two loan officers.
- `dash.views.overview.changed.items[1]` → Dodoma disbursements are 18% below plan for September, mostly in group loans.
- `dash.views.overview.changed.items[2]` → September revenue of TZS 2.30 bn is the first month above target this year.
- `dash.views.overview.read[0].figure` → revenue
- `dash.views.overview.read[0].anchor` → Sep
- `dash.views.overview.read[0].shows` → September is the first month above target.
- `dash.views.overview.read[0].decision` → Leadership can adjust the fourth-quarter plan now.
- `dash.views.overview.read[1].figure` → branches
- `dash.views.overview.read[1].anchor` → Mbeya
- `dash.views.overview.read[1].shows` → Mbeya is the lowest branch, at 84% of target.
- `dash.views.overview.read[1].decision` → Regional managers know which branch to visit first.
- `dash.views.overview.read[2].figure` → exceptions
- `dash.views.overview.read[2].anchor` → 0
- `dash.views.overview.read[2].shows` → Two branches are above the 5% PAR30 limit.
- `dash.views.overview.read[2].decision` → The Head of Credit sees a breach the morning it happens.

### View 2: loans

- `dash.views.loans.index` → 02.2
- `dash.views.loans.tab` → Loan portfolio
- `dash.views.loans.tabDescription` → Arrears, ageing and officers, for the credit team.
- `dash.views.loans.entity` → Sample lender (microfinance)
- `dash.views.loans.period` → As at 30 Sep 2026
- `dash.views.loans.creditPeriod` → Sep 2026
- `dash.views.loans.kpis[0].label` → Gross loan portfolio
- `dash.views.loans.kpis[0].context` → +2.1% since August
- `dash.views.loans.kpis[1].label` → PAR30
- `dash.views.loans.kpis[1].context` → Limit 5.0%
- `dash.views.loans.kpis[2].label` → Non-performing (90+ days)
- `dash.views.loans.kpis[2].context` → Share of portfolio
- `dash.views.loans.kpis[3].label` → Disbursed in September
- `dash.views.loans.kpis[3].context` → Plan TZS 6.1 bn
- `dash.views.loans.figures.par.number` → 02.4
- `dash.views.loans.figures.par.title` → PAR30, last 12 months
- `dash.views.loans.figures.par.axis` → % of portfolio
- `dash.views.loans.figures.par.limit` → Limit 5.0%
- `dash.views.loans.figures.par.readout` → {month} · PAR30 {value}%
- `dash.views.loans.figures.par.summary` → PAR30 was above the 5% limit from May to July, peaking at 5.4%, and was 4.6% in September.
- `dash.views.loans.figures.ageing.number` → 02.5
- `dash.views.loans.figures.ageing.title` → Ageing of the portfolio
- `dash.views.loans.figures.ageing.buckets[0]` → Current
- `dash.views.loans.figures.ageing.buckets[1]` → 1–30 days
- `dash.views.loans.figures.ageing.buckets[2]` → 31–60 days
- `dash.views.loans.figures.ageing.buckets[3]` → 61–90 days
- `dash.views.loans.figures.ageing.buckets[4]` → 90+ days
- `dash.views.loans.figures.ageing.summary` → 91.2% of the portfolio is current; 4.6% is over 30 days overdue and 1.5% over 90.
- `dash.views.loans.figures.mix.number` → 02.6
- `dash.views.loans.figures.mix.title` → Portfolio by product
- `dash.views.loans.figures.mix.products[0]` → Group loans
- `dash.views.loans.figures.mix.products[1]` → SME
- `dash.views.loans.figures.mix.products[2]` → Salary
- `dash.views.loans.figures.mix.products[3]` → Agriculture
- `dash.views.loans.figures.mix.summary` → Group loans are the largest product: TZS 21.8 bn of TZS 64.2 bn.
- `dash.views.loans.figures.flows.number` → 02.7
- `dash.views.loans.figures.flows.title` → Disbursed and repaid, April to September
- `dash.views.loans.figures.flows.axis` → TZS bn
- `dash.views.loans.figures.flows.seriesDisbursed` → Disbursed
- `dash.views.loans.figures.flows.seriesRepaid` → Repaid
- `dash.views.loans.figures.flows.readout` → {month} · disbursed TZS {a} bn · repaid TZS {b} bn
- `dash.views.loans.figures.flows.summary` → Disbursements ran at TZS 5.2–5.9 bn a month; repayments were higher in July and August.
- `dash.views.loans.officers.title` → Loan officers
- `dash.views.loans.officers.caption` → Officers are shown by code only.
- `dash.views.loans.officers.columns.code` → Officer
- `dash.views.loans.officers.columns.branch` → Branch
- `dash.views.loans.officers.columns.portfolio` → Portfolio
- `dash.views.loans.officers.columns.par` → PAR30
- `dash.views.loans.officers.columns.trend` → 12 months
- `dash.views.loans.read[0].figure` → par
- `dash.views.loans.read[0].anchor` → Jul
- `dash.views.loans.read[0].shows` → PAR30 peaked at 5.4% in July.
- `dash.views.loans.read[0].decision` → Crossing the limit is flagged the same day, so collections start before month-end.
- `dash.views.loans.read[1].figure` → ageing
- `dash.views.loans.read[1].anchor` → 90+ days
- `dash.views.loans.read[1].shows` → 1.5% of the portfolio is more than 90 days overdue.
- `dash.views.loans.read[1].decision` → Finance and credit discuss provisions from the same number.
- `dash.views.loans.read[2].figure` → officers
- `dash.views.loans.read[2].anchor` → LO-047
- `dash.views.loans.read[2].shows` → Two officers are above the limit.
- `dash.views.loans.read[2].decision` → Follow-up goes to two portfolios, not the whole branch.
- `dash.views.loans.read[3].figure` → flows
- `dash.views.loans.read[3].anchor` → Jul
- `dash.views.loans.read[3].shows` → In July, repayments overtook disbursements for the first time.
- `dash.views.loans.read[3].decision` → Treasury plans cash from the trend, not last month’s estimate.

### View 3: sales

- `dash.views.sales.index` → 02.3
- `dash.views.sales.tab` → Sales by region
- `dash.views.sales.tabDescription` → Where sales come from and where they grow.
- `dash.views.sales.entity` → Sample distributor (consumer goods)
- `dash.views.sales.period` → Q3 2026 (Jul–Sep)
- `dash.views.sales.creditPeriod` → Q3 2026
- `dash.views.sales.kpis[0].label` → Sales, Q3
- `dash.views.sales.kpis[0].context` → +11.3% on Q3 2025
- `dash.views.sales.kpis[1].label` → Active outlets
- `dash.views.sales.kpis[1].context` → Ordered at least once in Q3
- `dash.views.sales.kpis[2].label` → Average order
- `dash.views.sales.kpis[2].context` → Per outlet order
- `dash.views.sales.kpis[3].label` → Regions above plan
- `dash.views.sales.kpis[3].value` → 6 of 10
- `dash.views.sales.kpis[3].context` → Q3 plan
- `dash.views.sales.figures.map.number` → 02.8
- `dash.views.sales.figures.map.title` → Sales by region
- `dash.views.sales.figures.map.legendTitle` → Growth on Q3 2025
- `dash.views.sales.figures.map.legend[0]` → up to 6%
- `dash.views.sales.figures.map.legend[1]` → 7–9%
- `dash.views.sales.figures.map.legend[2]` → 10–13%
- `dash.views.sales.figures.map.legend[3]` → 14–17%
- `dash.views.sales.figures.map.legend[4]` → 18% or more
- `dash.views.sales.figures.map.ringNote` → Circle size shows sales.
- `dash.views.sales.figures.map.summary` → Dar es Salaam has the largest sales; Dodoma, Mwanza and Arusha grew fastest. No borders are drawn.
- `dash.views.sales.figures.ranked.number` → 02.9
- `dash.views.sales.figures.ranked.title` → Regions ranked by sales
- `dash.views.sales.figures.ranked.columns.region` → Region
- `dash.views.sales.figures.ranked.columns.sales` → Sales
- `dash.views.sales.figures.ranked.columns.share` → Share
- `dash.views.sales.figures.ranked.columns.growth` → Growth
- `dash.views.sales.figures.ranked.other` → Other regions
- `dash.views.sales.figures.ranked.readout` → {region} · TZS {value} bn · {share}% of sales · {growth}% growth
- `dash.views.sales.figures.ranked.summary` → Dar es Salaam is 30.6% of sales; Dodoma grew fastest (21%), Tanga slowest (4%).
- `dash.views.sales.read[0].figure` → map
- `dash.views.sales.read[0].anchor` → Dodoma
- `dash.views.sales.read[0].shows` → Dodoma grew fastest, 21% on the same quarter last year.
- `dash.views.sales.read[0].decision` → Test moving stock and field staff towards the central corridor.
- `dash.views.sales.read[1].figure` → ranked
- `dash.views.sales.read[1].anchor` → Dar es Salaam
- `dash.views.sales.read[1].shows` → Dar es Salaam grew 8%, below the overall 11.3%.
- `dash.views.sales.read[1].decision` → Watch the largest region for market share, not volume.
- `dash.views.sales.read[2].figure` → ranked
- `dash.views.sales.read[2].anchor` → Tanga
- `dash.views.sales.read[2].shows` → Tanga grew 4%, the slowest region.
- `dash.views.sales.read[2].decision` → Check outlet coverage before next quarter’s targets are set.

### View 4: operations

- `dash.views.operations.index` → 02.4
- `dash.views.operations.tab` → Automation & operations
- `dash.views.operations.tabDescription` → The reports that run themselves, and what the agent did.
- `dash.views.operations.entity` → Sample lender’s reporting system
- `dash.views.operations.period` → September 2026 · schedule for a sample Monday
- `dash.views.operations.creditPeriod` → Sep 2026
- `dash.views.operations.kpis[0].label` → Reports delivered automatically
- `dash.views.operations.kpis[0].context` → In September
- `dash.views.operations.kpis[1].label` → Median generation time
- `dash.views.operations.kpis[1].context` → Last 14 runs
- `dash.views.operations.kpis[2].label` → Staff hours returned
- `dash.views.operations.kpis[2].context` → Estimate, against doing it by hand
- `dash.views.operations.kpis[3].label` → Failed runs
- `dash.views.operations.kpis[3].context` → Both re-run the same morning
- `dash.views.operations.figures.schedule.number` → 02.10
- `dash.views.operations.figures.schedule.title` → Monday schedule
- `dash.views.operations.figures.schedule.lanes[0]` → Reports
- `dash.views.operations.figures.schedule.lanes[1]` → Alerts
- `dash.views.operations.figures.schedule.lanes[2]` → Agent
- `dash.views.operations.figures.schedule.items[0]` → 05:30 Daily PAR report → 14 branch managers
- `dash.views.operations.figures.schedule.items[1]` → 05:58 Board pack (Mondays) → 9 recipients
- `dash.views.operations.figures.schedule.items[2]` → 07:00 Collections exceptions → agent drafts follow-ups
- `dash.views.operations.figures.schedule.items[3]` → 12:00 Cash position
- `dash.views.operations.figures.schedule.items[4]` → 18:30 Daily close
- `dash.views.operations.figures.schedule.timeAxis` → East Africa Time
- `dash.views.operations.figures.schedule.summary` → Five jobs run between 05:30 and 18:30, starting with the daily PAR report.
- `dash.views.operations.figures.runs.number` → 02.11
- `dash.views.operations.figures.runs.title` → Generation time, last 14 runs
- `dash.views.operations.figures.runs.axis` → seconds
- `dash.views.operations.figures.runs.readout` → Run {n} · {value} s
- `dash.views.operations.figures.runs.slowLabel` → Slow run
- `dash.views.operations.figures.runs.summary` → Runs took 35–41 seconds (median 38), except run 7 at 61.
- `dash.views.operations.figures.pack.number` → 02.12
- `dash.views.operations.figures.pack.title` → Monthly management pack
- `dash.views.operations.figures.pack.before` → By hand
- `dash.views.operations.figures.pack.after` → Automated
- `dash.views.operations.figures.pack.beforeValue` → 14 h
- `dash.views.operations.figures.pack.afterValue` → 4 min
- `dash.views.operations.figures.pack.summary` → The monthly pack: 14 hours by hand, 4 minutes automated.
- `dash.views.operations.log.title` → Agent log
- `dash.views.operations.log.caption` → The agent drafts. A person approves anything that leaves the building.
- `dash.views.operations.log.items[0].time` → 05:30
- `dash.views.operations.log.items[0].text` → Daily PAR report generated and sent to 14 branch managers.
- `dash.views.operations.log.items[0].status` → sent
- `dash.views.operations.log.items[1].time` → 05:58
- `dash.views.operations.log.items[1].text` → Monday board pack generated and sent to 9 recipients.
- `dash.views.operations.log.items[1].status` → sent
- `dash.views.operations.log.items[2].time` → 07:02
- `dash.views.operations.log.items[2].text` → PAR30 is above the 5.0% limit in 2 branches: Mbeya 7.2%, Dodoma 5.4%. Follow-up note drafted for the Head of Credit.
- `dash.views.operations.log.items[2].status` → awaiting
- `dash.views.operations.log.items[3].time` → 07:09
- `dash.views.operations.log.items[3].text` → Note approved by the Head of Credit and sent to both branch managers.
- `dash.views.operations.log.items[3].status` → sent
- `dash.views.operations.log.items[4].time` → 07:15
- `dash.views.operations.log.items[4].text` → 41 reminders drafted for borrowers in arrears, waiting for loan officers to review.
- `dash.views.operations.log.items[4].status` → queued
- `dash.views.operations.read[0].figure` → schedule
- `dash.views.operations.read[0].anchor` → 05:30
- `dash.views.operations.read[0].shows` → The PAR report reaches 14 managers at 05:30, before branches open.
- `dash.views.operations.read[0].decision` → Managers start the day with yesterday’s numbers.
- `dash.views.operations.read[1].figure` → runs
- `dash.views.operations.read[1].anchor` → 7
- `dash.views.operations.read[1].shows` → One run took 61 seconds against a median of 38.
- `dash.views.operations.read[1].decision` → A slow run is visible before it becomes a late report.
- `dash.views.operations.read[2].figure` → log
- `dash.views.operations.read[2].anchor` → 07:02
- `dash.views.operations.read[2].shows` → The agent drafted the note. A person approved it seven minutes later.
- `dash.views.operations.read[2].decision` → You choose which steps stay with a person.
- `dash.views.operations.read[3].figure` → pack
- `dash.views.operations.read[3].anchor` → after
- `dash.views.operations.read[3].shows` → From 14 hours to 4 minutes.
- `dash.views.operations.read[3].decision` → The analyst’s time goes to explaining the numbers, not copying them.

---

## estimator (03, advanced feature B)

- `estimator.eyebrow` → 03 — Your numbers
- `estimator.title` → Where do the hours go?
- `estimator.lead` → Enter your numbers for one report to see what it costs your team.
- `estimator.sentence[0]` → We prepare␠
- `estimator.sentence[1]` → {count}
- `estimator.sentence[2]` → ␠{reportWord} every␠
- `estimator.sentence[3]` → {period}
- `estimator.sentence[4]` → . Each one takes␠
- `estimator.sentence[5]` → {people}
- `estimator.sentence[6]` → ␠{personWord} about␠
- `estimator.sentence[7]` → {hours}
- `estimator.sentence[8]` → ␠{hourWord}.
- `estimator.personWord.one` → person
- `estimator.personWord.other` → people
- `estimator.reportWord.one` → report
- `estimator.reportWord.other` → reports
- `estimator.hourWord.one` → hour
- `estimator.hourWord.other` → hours
- `estimator.periods.day` → working day
- `estimator.periods.week` → week
- `estimator.periods.month` → month
- `estimator.periodUnits.day` → working days
- `estimator.periodUnits.week` → weeks
- `estimator.periodUnits.month` → months
- `estimator.labels.count` → Number of reports
- `estimator.labels.period` → How often
- `estimator.labels.people` → People involved in each report
- `estimator.labels.hours` → Hours each person spends on one report
- `estimator.stepper.decrease` → Decrease {label}
- `estimator.stepper.increase` → Increase {label}
- `estimator.salary.label` → Average monthly salary of those involved (optional)
- `estimator.salary.placeholder` → e.g. 1,500,000
- `estimator.salary.unit` → TZS
- `estimator.salary.help` → Adds a cost in shillings. It stays on your device.
- `estimator.result.label` → Your estimate
- `estimator.result.hours` → ≈ {hours} hours a year
- `estimator.result.days` → {days} working days
- `estimator.result.cost` → ≈ TZS {amount} a year in staff time
- `estimator.formula.hours` → {count} {reportWord} × {periods} {periodUnit} × {people} {personWord} × {hours} h = {total} h a year · 8 h = 1 working day
- `estimator.formula.cost` → TZS {salary} ÷ 176 h a month = TZS {hourly} per hour
- `estimator.formula.assumptions` → Assumes 240 working days, 48 working weeks or 12 months a year.
- `estimator.note` → An estimate, not a quote. Nothing is sent unless you send a message.
- `estimator.addToMessage` → Add this to my message
- `estimator.added` → Added to your message. Fill in your name to send it.
- `estimator.messageTemplate` → We prepare {count} {reportWord} every {period}. Each one takes {people} {personWord} about {hours} {hourWord}, roughly {hoursPerYear} hours a year.
- `estimator.error.range` → Use a number between {min} and {max}.

---

## process (04)

- `process.eyebrow` → 04 — How we work
- `process.title` → How a project runs.
- `process.lead` → Every system is different. The way we get there is not.
- `process.receivePrefix` → You receive:
- `process.steps[0].index` → 04.1
- `process.steps[0].title` → Discover
- `process.steps[0].description` → We learn your workflow and find the manual work.
- `process.steps[0].receive` → a list of the figures that matter, and an honest view on whether to build.
- `process.steps[1].index` → 04.2
- `process.steps[1].title` → Design
- `process.steps[1].description` → We plan the dashboards, automations and data flow around how you work.
- `process.steps[1].receive` → a plan you approve before we build.
- `process.steps[2].index` → 04.3
- `process.steps[2].title` → Build
- `process.steps[2].description` → We build it securely, in the formats your team already uses.
- `process.steps[2].receive` → a working system, ready to use.
- `process.steps[3].index` → 04.4
- `process.steps[3].title` → Support
- `process.steps[3].description` → We train your team and adapt the system as your needs change.
- `process.steps[3].receive` → training, and changes when you need them.
- `process.closing` → Something useful reaches your team early, not all at the end.

---

## security (05)

- `security.title` → From manual and scattered to automated and clear.
- `security.ledger.todayHeading` → Today
- `security.ledger.withHeading` → With DataHub
- `security.ledger.rows[0].today` → Reports take hours or days to prepare
- `security.ledger.rows[0].with` → Reports generated in seconds
- `security.ledger.rows[1].today` → Different people get different numbers
- `security.ledger.rows[1].with` → One answer for everyone
- `security.ledger.rows[2].today` → Files scattered across emails and folders
- `security.ledger.rows[2].with` → One place, in any browser
- `security.ledger.rows[3].today` → Reports formatted and emailed by hand
- `security.ledger.rows[3].with` → Delivered on schedule
- `security.ledger.rows[4].today` → No current view of performance
- `security.ledger.rows[4].with` → Current figures at a glance
- `security.data.title` → Your data stays yours.
- `security.data.body` → In every system we build, security starts with the first line of code.
- `security.data.items[0].term` → Access by role
- `security.data.items[0].definition` → People see only what their role allows.
- `security.data.items[1].term` → Encrypted credentials
- `security.data.items[1].definition` → Passwords and connection secrets are stored encrypted.
- `security.data.items[2].term` → Validated inputs
- `security.data.items[2].definition` → The server checks every input before it is used.
- `security.data.items[3].term` → Hardened endpoints
- `security.data.items[3].definition` → Interfaces accept only what they need and refuse the rest.
- `security.data.items[4].term` → Agents with limits
- `security.data.items[4].definition` → An AI agent gets no more access than the person it works for.
- `security.data.items[5].term` → Never shared
- `security.data.items[5].definition` → Your data is never shared or resold.
- `security.proof.title` → Proof on this page
- `security.proof.lead` → Claims about this website you can check yourself.
- `security.proof.lines[0]` → Scripts: only our own. A new security code on each visit stops injected scripts from running.
- `security.proof.lines[1]` → Trackers and analytics from other companies: none.
- `security.proof.lines[2]` → Fonts and images: served from datahub.co.tz.
- `security.proof.lines[3]` → Cookies: none. Your preferences stay in your own browser.
- `security.proof.lines[4]` → Contact form: checked on our server, limited to a few messages per network address, and filtered for automated spam.
- `security.proof.showPolicy` → Show the exact policy
- `security.proof.policyNote` → The Content-Security-Policy header for this page, with the per-visit code hidden.
- `security.proof.check` → Check our security headers yourself

---

## team (06)

- `team.eyebrow` → 06 — Team
- `team.title` → The people you will work with.
- `team.lead` → Here is who does what on your project.
- `team.members.cto.index` → 06.1
- `team.members.cto.name` → Daniel C. Masubi
- `team.members.cto.role` → Chief Technology Officer
- `team.members.cto.bio` → Designs and builds the systems: pipelines, dashboards, report automation and agents. Owns how your data is secured.
- `team.members.cto.alt` → Daniel C. Masubi, Chief Technology Officer, DataHub
- `team.members.operations.index` → 06.2
- `team.members.operations.name` → Kanuda L. Sasi
- `team.members.operations.role` → Head of Operations
- `team.members.operations.bio` → Runs delivery: scoping, timelines, training and support. Makes sure what was agreed is what arrives.
- `team.members.operations.alt` → Kanuda L. Sasi, Head of Operations, DataHub
- `team.members.marketing.index` → 06.3
- `team.members.marketing.name` → Yohana K. Mussa
- `team.members.marketing.role` → Head of Marketing
- `team.members.marketing.bio` → Usually your first conversation with DataHub. Makes sure we scope the problem you actually have, and keeps you informed.
- `team.members.marketing.alt` → Yohana K. Mussa, Head of Marketing, DataHub

---

## faq (07)

- `faq.eyebrow` → 07 — Questions
- `faq.title` → What people ask before they start.
- `faq.aside` → Not answered here?
- `faq.asideWhatsapp` → Ask us on WhatsApp
- `faq.asideEmail` → Email us
- `faq.indexPrefix` → Q
- `faq.items[0].q` → What does DataHub do?
- `faq.items[0].a` → We build dashboards, automated reports and AI agents for organisations in Tanzania.
- `faq.items[1].q` → Where are you based, and do you work outside Dar es Salaam?
- `faq.items[1].a` → Dar es Salaam. We work across Tanzania and beyond, mostly remotely, and on site when needed.
- `faq.items[2].q` → How much does a dashboard cost?
- `faq.items[2].a` → It depends on the work, so we scope it with you before quoting. The first conversation costs nothing.
- `faq.items[3].q` → Is our data safe?
- `faq.items[3].a` → Yes. Each person sees only what their role allows, and your data is never shared or resold.
- `faq.items[4].q` → How long does a project take?
- `faq.items[4].a` → Usually weeks for one dashboard or report, longer for a platform across several departments.

---

## contact (08)

- `contact.eyebrow` → 08 — Contact
- `contact.title` → Start with one report.
- `contact.lead` → Tell us what you work with today and what you would like to see instead.
- `contact.lines.whatsapp.label` → WhatsApp
- `contact.lines.whatsapp.action` → Message us on WhatsApp
- `contact.lines.email.label` → Email
- `contact.lines.location.label` → Based in
- `contact.lines.location.value` → Dar es Salaam, Tanzania
- `contact.lines.location.note` → Working with organisations across Tanzania
- `contact.next.title` → What happens next
- `contact.next.steps[0]` → We reply to set up a short conversation.
- `contact.next.steps[1]` → We look at the work with you and agree what is worth building.
- `contact.next.steps[2]` → You get a written scope before any work starts.
- `contact.privacy` → We use your details only to reply to you.
- `contact.privacyLink` → Read our privacy notice

## form

- `form.label` → Contact form
- `form.optional` → optional
- `form.fields.name.label` → Name
- `form.fields.name.placeholder` → Your full name
- `form.fields.phone.label` → Phone / WhatsApp
- `form.fields.phone.placeholder` → +255 7XX XXX XXX
- `form.fields.email.label` → Email
- `form.fields.email.placeholder` → you@organisation.co.tz
- `form.fields.company.label` → Organisation
- `form.fields.company.placeholder` → Organisation name
- `form.fields.service.legend` → Interested in
- `form.fields.service.options.dashboards` → Dashboards & business intelligence
- `form.fields.service.options.automation` → Reporting automation
- `form.fields.service.options.customSoftware` → AI agents & custom software
- `form.fields.service.options.other` → Not sure yet
- `form.fields.message.label` → Message
- `form.fields.message.placeholder` → For example: our weekly branch report takes two days to build.
- `form.fields.message.counter` → {count} of 4,000 characters
- `form.honeypot` → Leave this field empty
- `form.errors.name.required` → Please enter your name.
- `form.errors.name.tooShort` → Please enter at least 2 characters.
- `form.errors.name.tooLong` → Please keep your name under 100 characters.
- `form.errors.email.required` → Please enter your email address.
- `form.errors.email.invalid` → Please enter a valid email address, for example name@organisation.co.tz.
- `form.errors.email.tooLong` → Please keep your email address under 160 characters.
- `form.errors.phone.invalid` → Please use only digits, spaces, +, - or brackets.
- `form.errors.phone.tooLong` → Please keep the number under 30 characters.
- `form.errors.company.tooLong` → Please keep the organisation name under 140 characters.
- `form.errors.service.invalid` → Please choose one of the options.
- `form.errors.message.required` → Please tell us what you need.
- `form.errors.message.tooShort` → Please write at least 10 characters.
- `form.errors.message.tooLong` → Please keep your message under 4,000 characters.
- `form.submit` → Send message
- `form.sending` → Sending…
- `form.status.checkFields` → Please check the marked fields.
- `form.status.rateLimited` → Too many messages from this connection. Please wait a few minutes, or message us on WhatsApp.
- `form.status.invalid` → Your message could not be read. Please try again.
- `form.status.server` → Your message did not go through. Please try again, or message us on WhatsApp.
- `form.status.network` → No connection. Check your internet and try again.
- `form.status.loading` → Loading… or WhatsApp us on {number}.
- `form.status.loadingNoNumber` → Loading… or write to {email}.
- `form.success.title` → Thank you.
- `form.success.body` → Your message reached us, and we will reply.
- `form.success.again` → Send another message
- `form.whatsappAlt` → Prefer WhatsApp? Message us on {number}.
- `form.whatsappAltNoNumber` → Prefer email? Write to {email}.

## rail (mobile action rail)

- `rail.label` → Quick contact
- `rail.whatsapp` → WhatsApp
- `rail.cta` → Start a conversation

---

## footer

- `footer.tagline.line1Before` → From␠
- `footer.tagline.line1Accent` → Data
- `footer.tagline.line2` → to Decisions
- `footer.about` → Dashboards, reporting automation and AI agents for organisations in Tanzania.
- `footer.columns.services` → Services
- `footer.columns.company` → Company
- `footer.columns.contact` → Contact
- `footer.columns.preferences` → Preferences
- `footer.services[0]` → Dashboards & business intelligence
- `footer.services[1]` → Reporting automation
- `footer.services[2]` → AI agents
- `footer.company[0]` → How we work
- `footer.company[1]` → Security
- `footer.company[2]` → Team
- `footer.company[3]` → Questions
- `footer.company[4]` → Privacy notice
- `footer.contact.whatsapp` → WhatsApp {number}
- `footer.contact.email` → {email}
- `footer.contact.location` → Dar es Salaam, Tanzania
- `footer.legal` → © {year} DataHub · Dashboards on this site use sample data.
- `footer.backToTop` → Back to top

---

## servicePage (chrome for /services/[slug]; body copy stays in services.ts)

- `servicePage.breadcrumbLabel` → Breadcrumb
- `servicePage.home` → Home
- `servicePage.cta` → Start a conversation
- `servicePage.allServices` → See all services
- `servicePage.signals.eyebrow` → 01 — The problem
- `servicePage.signals.title` → Signs you need this
- `servicePage.deliverables.eyebrow` → 02 — Deliverables
- `servicePage.deliverables.title` → What you get
- `servicePage.sample.eyebrow` → 03 — Sample
- `servicePage.sample.title` → See it in a sample
- `servicePage.sample.lead` → Charts from our sample dashboards, with the decision each one supports.
- `servicePage.faq.eyebrow` → 04 — Questions
- `servicePage.faq.title` → Questions about {service}
- `servicePage.others.eyebrow` → 05 — More services
- `servicePage.others.title` → Also from DataHub

---

## privacy (/privacy)

Facts only. The owner must confirm before launch; do not add a retention period, storage location or named officer unless supplied.

- `privacy.title` → Privacy notice
- `privacy.updated` → Last updated {date}
- `privacy.intro` → What DataHub collects through this website, and why. Written with Tanzania’s Personal Data Protection Act, 2022 in mind.
- `privacy.sections[0].title` → What we collect
- `privacy.sections[0].body` → Only what you type into the contact form: your name, email, phone, organisation, the service you are interested in and your message. If you came from one of our posts, we also record the link’s campaign tag (for example “whatsapp”).
- `privacy.sections[1].title` → What we do not collect
- `privacy.sections[1].body` → No cookies, analytics or advertising trackers. Your theme and language choices stay in your browser.
- `privacy.sections[2].title` → Your connection
- `privacy.sections[2].body` → To stop automated spam, we limit how many messages one connection can send. For this we keep a scrambled (hashed) form of your IP address, not the address itself.
- `privacy.sections[3].title` → Why we use it
- `privacy.sections[3].body` → To reply to you. We do not sell, rent or share your details.
- `privacy.sections[4].title` → Your choices
- `privacy.sections[4].body` → To see, correct or delete what we hold about you, write to {email}.
- `privacy.sections[5].title` → Contact
- `privacy.sections[5].body` → DataHub, Dar es Salaam, Tanzania. {email}

## notFound (404)

- `notFound.eyebrow` → 404
- `notFound.title` → This page does not exist.
- `notFound.body` → The link may be old or mistyped.
- `notFound.home` → Go to the home page
- `notFound.contact` → Or tell us what you were looking for

---

## alt and accessible names (images and graphics)

- `alt.og` → DataHub — From Data to Decisions. Dashboards, reporting automation and AI agents in Tanzania.
- `alt.figurePrefix` → Sample chart:

Decorative graphics (the hero silk and mark, the footer plate, the service glyphs, the WhatsApp and theme icons) are `aria-hidden` and carry no alt text. Team portraits take their alt text from `team.members.*.alt`.

---

## Notes for the Kiswahili translator (not rendered)

- Tagline: "Kutoka Data hadi Maamuzi". Hero H1: "Kutoka data / hadi maamuzi." Sub line: "Dashibodi, otomatiki ya ripoti na mawakala wa AI kwa taasisi za Tanzania."
- Terms to keep consistent: sample data = data ya mfano; dashboard = dashibodi; loan portfolio = jalada la mikopo; non-performing loans = mikopo chechefu; group loans = mikopo ya vikundi; SME = biashara ndogo na za kati; salary loans = mikopo ya mishahara; agriculture = kilimo; disbursed = iliyotolewa; collections = makusanyo; branch = tawi; loan officer = afisa mikopo; target = lengo; limit = kikomo; PAR30 stays PAR30.
- Months: Jan Feb Mac Apr Mei Jun Jul Ago Sep Okt Nov Des. Money: "TZS bilioni 18.4", "TZS milioni 418". Hours: "saa 288".
- Roles: Afisa Mkuu wa Teknolojia; Mkuu wa Uendeshaji; Mkuu wa Masoko.
- Required notice: "Data ya mfano — hatuchapishi dashibodi za wateja".
- Keep uppercase eyebrow labels to three words; add `&shy;` hints in words longer than 12 letters used at display sizes.
- No machine translation at runtime. Kanuda and Yohana review every string before launch.
