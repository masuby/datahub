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
- `meta.home.description` → Dashboards, reporting automation and AI agents for organisations in Tanzania, built in Dar es Salaam.
- `meta.home.ogTitle` → DataHub — Data Analytics & Dashboards in Tanzania
- `meta.home.ogDescription` → Dashboards, reporting automation and AI agents in Tanzania. From Data to Decisions.
- `meta.privacy.title` → Privacy notice
- `meta.privacy.description` → What this website collects, why, and how to have it deleted.
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
- `a11y.today` → Today:
- `a11y.withDataHub` → With DataHub:

## brand

- `brand.homeLink` → DataHub, home
- `brand.tagline` → From Data to Decisions

## nav (header, desktop)

- `nav.label` → Main
- `nav.services` → Services
- `nav.process` → Process
- `nav.security` → Security
- `nav.team` → Team
- `nav.faq` → FAQ

## header

- `header.cta` → Start a conversation
- `header.menuOpen` → Menu
- `header.menuClose` → Close
- `header.menuLabel` → Site menu

## menu (mobile sheet, numbered 01–07)

- `menu.items[0]` → Services
- `menu.items[1]` → Your numbers
- `menu.items[2]` → How we work
- `menu.items[3]` → Security
- `menu.items[4]` → Team
- `menu.items[5]` → Questions
- `menu.items[6]` → Contact
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
- `hero.ctaSecondary` → See a live sample

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
- `services.items.automation.index` → 01.2
- `services.items.automation.title` → Reporting automation
- `services.items.automation.tagline` → Hours of manual work, done in seconds
- `services.items.automation.description` → Your weekly Excel and PowerPoint reports, generated for you.
- `services.items.aiAgents.index` → 01.3
- `services.items.aiAgents.title` → AI agents
- `services.items.aiAgents.tagline` → Reads your data, drafts the next step
- `services.items.aiAgents.description` → Agents that watch your data, summarise what changed and wait for a person to approve.

Deliverable labels under each row are read from `services.ts` (`deliverables[].title`) and are not repeated here.

---

## dash (sample data: the home page's showcase and the service pages' sample bands)

### Shared

- `dash.eyebrow` → Sample dashboard
- `dash.title` → See what Monday morning could look like.
- `dash.notice` → Sample data — we never publish client dashboards
- `dash.stamp` → SAMPLE DATA
- `dash.footnote` → Every name and number here is invented.
- `dash.credit` → Source: DataHub sample data · TZS · {period}
- `dash.figPrefix` → Fig.
- `dash.showTable` → View as table
- `dash.read.listLabel` → What this chart tells you
- `dash.read.decisionPrefix` → Decision:
- `dash.status.onTarget` → On target
- `dash.status.watch` → Watch
- `dash.status.breach` → Breach
- `dash.status.done` → Done
- `dash.status.sent` → Sent
- `dash.status.awaiting` → Awaiting approval
- `dash.status.queued` → Queued for review
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

### Overview figures (the dashboards service page; "What changed" on the AI agents page)

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
- `dash.views.overview.figures.revenue.summary` → Revenue was below the TZS 2.18 bn monthly target until September (TZS 2.30 bn).
- `dash.views.overview.figures.branches.number` → 02.2
- `dash.views.overview.figures.branches.title` → Branches, % of revenue target
- `dash.views.overview.figures.branches.axis` → % of target
- `dash.views.overview.figures.branches.readout` → {branch} · {pct}% of target
- `dash.views.overview.figures.branches.summary` → Only Kariakoo is above target, at 104%.
- `dash.views.overview.changed.label` → What changed this week
- `dash.views.overview.changed.byline` → Written by the reporting agent · sample
- `dash.views.overview.changed.items[0]` → Mbeya PAR30 rose 0.8 points to 7.2%, mostly from two loan officers.
- `dash.views.overview.changed.items[1]` → Dodoma disbursements are 18% below plan, mostly in group loans.
- `dash.views.overview.changed.items[2]` → September’s TZS 2.30 bn is the year’s first month above target.
- `dash.views.overview.read[0].figure` → revenue
- `dash.views.overview.read[0].anchor` → Sep
- `dash.views.overview.read[0].shows` → September is the first month above target.
- `dash.views.overview.read[0].decision` → Leadership can adjust the fourth-quarter plan now.
- `dash.views.overview.read[1].figure` → branches
- `dash.views.overview.read[1].anchor` → Mbeya
- `dash.views.overview.read[1].shows` → Mbeya is lowest, at 84% of target.
- `dash.views.overview.read[1].decision` → Regional managers know where to go first.

### Operations figures (the automation and AI agents service pages)

- `dash.views.operations.entity` → Sample lender’s reporting system
- `dash.views.operations.period` → September 2026 · schedule for a sample Monday
- `dash.views.operations.creditPeriod` → Sep 2026
- `dash.views.operations.kpis[0].label` → Reports delivered automatically
- `dash.views.operations.kpis[0].context` → In September
- `dash.views.operations.kpis[1].label` → Median generation time
- `dash.views.operations.kpis[1].context` → Last 14 runs
- `dash.views.operations.kpis[2].label` → Staff hours returned
- `dash.views.operations.kpis[2].context` → Estimate, against manual work
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
- `dash.views.operations.figures.schedule.summary` → Five jobs run from 05:30 to 18:30.
- `dash.views.operations.figures.runs.number` → 02.11
- `dash.views.operations.figures.runs.title` → Generation time, last 14 runs
- `dash.views.operations.figures.runs.axis` → seconds
- `dash.views.operations.figures.runs.readout` → Run {n} · {value} s
- `dash.views.operations.figures.runs.slowLabel` → Slow run
- `dash.views.operations.figures.runs.summary` → Most runs took 35–41 seconds.
- `dash.views.operations.log.title` → Agent log
- `dash.views.operations.log.caption` → The agent drafts. A person approves anything that leaves the building.
- `dash.views.operations.log.items[0].time` → 05:30
- `dash.views.operations.log.items[0].text` → Daily PAR report sent to 14 branch managers.
- `dash.views.operations.log.items[0].status` → sent
- `dash.views.operations.log.items[1].time` → 05:58
- `dash.views.operations.log.items[1].text` → Monday board pack sent to 9 recipients.
- `dash.views.operations.log.items[1].status` → sent
- `dash.views.operations.log.items[2].time` → 07:02
- `dash.views.operations.log.items[2].text` → PAR30 above the 5.0% limit in Mbeya (7.2%) and Dodoma (5.4%). Note drafted for the Head of Credit.
- `dash.views.operations.log.items[2].status` → awaiting
- `dash.views.operations.log.items[3].time` → 07:09
- `dash.views.operations.log.items[3].text` → The Head of Credit approved the note; sent to both branch managers.
- `dash.views.operations.log.items[3].status` → sent
- `dash.views.operations.log.items[4].time` → 07:15
- `dash.views.operations.log.items[4].text` → 41 arrears reminders drafted for loan officers to review.
- `dash.views.operations.log.items[4].status` → queued
- `dash.views.operations.read[0].figure` → schedule
- `dash.views.operations.read[0].anchor` → 05:30
- `dash.views.operations.read[0].shows` → The PAR report reaches 14 managers at 05:30, before branches open.
- `dash.views.operations.read[0].decision` → Managers start the day with yesterday’s numbers.
- `dash.views.operations.read[1].figure` → runs
- `dash.views.operations.read[1].anchor` → 7
- `dash.views.operations.read[1].shows` → One run took 61 seconds against a median of 38.
- `dash.views.operations.read[1].decision` → A slow run shows before it becomes a late report.
- `dash.views.operations.read[2].figure` → log
- `dash.views.operations.read[2].anchor` → 07:02
- `dash.views.operations.read[2].shows` → The agent drafted the note; a person approved it seven minutes later.
- `dash.views.operations.read[2].decision` → You choose which steps stay with a person.

---

## estimator (02, advanced feature B)

- `estimator.eyebrow` → 02 — Your numbers
- `estimator.title` → Where do the hours go?
- `estimator.lead` → Enter one report’s numbers to see what it costs your team.
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

## process (03)

- `process.eyebrow` → 03 — How we work
- `process.title` → How a project runs.
- `process.lead` → Every system differs; the way we build it does not.
- `process.receivePrefix` → You receive:
- `process.steps[0].index` → 03.1
- `process.steps[0].title` → Discover
- `process.steps[0].description` → We learn your workflow and find the manual work.
- `process.steps[0].receive` → the figures that matter, and an honest view on whether to build.
- `process.steps[1].index` → 03.2
- `process.steps[1].title` → Design
- `process.steps[1].description` → We plan the system around how you work.
- `process.steps[1].receive` → a plan you approve before we build.
- `process.steps[2].index` → 03.3
- `process.steps[2].title` → Build
- `process.steps[2].description` → We build it securely, in formats your team already uses.
- `process.steps[2].receive` → a working system, ready to use.
- `process.steps[3].index` → 03.4
- `process.steps[3].title` → Support
- `process.steps[3].description` → We train your team and adapt the system as needs change.
- `process.steps[3].receive` → training, and changes when you need them.
- `process.closing` → Something useful reaches your team early, not all at the end.

---

## security (04)

- `security.title` → From manual and scattered to automated and clear.
- `security.ledger.todayHeading` → Today
- `security.ledger.withHeading` → With DataHub
- `security.ledger.rows[0].today` → Reports take hours or days
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
- `security.data.items[2].definition` → The server checks every input before use.
- `security.data.items[3].term` → Hardened endpoints
- `security.data.items[3].definition` → Interfaces accept only what they need.
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

## team (05)

- `team.eyebrow` → 05 — Team
- `team.title` → The people you will work with.
- `team.lead` → Here is who does what on your project.
- `team.members.cto.index` → 05.1
- `team.members.cto.name` → Daniel C. Masubi
- `team.members.cto.role` → Chief Technology Officer
- `team.members.cto.bio` → Builds the systems, from pipelines to agents, and owns your data’s security.
- `team.members.cto.alt` → Daniel C. Masubi, Chief Technology Officer, DataHub
- `team.members.operations.index` → 05.2
- `team.members.operations.name` → Kanuda L. Sasi
- `team.members.operations.role` → Head of Operations
- `team.members.operations.bio` → Runs delivery, from scoping to support, so what was agreed is what arrives.
- `team.members.operations.alt` → Kanuda L. Sasi, Head of Operations, DataHub
- `team.members.marketing.index` → 05.3
- `team.members.marketing.name` → Yohana K. Mussa
- `team.members.marketing.role` → Head of Marketing
- `team.members.marketing.bio` → Usually your first contact: scopes the problem you actually have and keeps you informed.
- `team.members.marketing.alt` → Yohana K. Mussa, Head of Marketing, DataHub

---

## faq (06)

- `faq.eyebrow` → 06 — Questions
- `faq.title` → What people ask before they start.
- `faq.aside` → Not answered here?
- `faq.asideWhatsapp` → Ask us on WhatsApp
- `faq.asideEmail` → Email us
- `faq.indexPrefix` → Q
- `faq.items[0].q` → What does DataHub do?
- `faq.items[0].a` → We build dashboards, automated reports and AI agents for organisations in Tanzania.
- `faq.items[1].q` → Where are you based?
- `faq.items[1].a` → Dar es Salaam. We work across Tanzania and beyond, mostly remotely, on site when needed.
- `faq.items[2].q` → How much does a dashboard cost?
- `faq.items[2].a` → It depends on the work, so we scope it before quoting. The first conversation is free.
- `faq.items[3].q` → Is our data safe?
- `faq.items[3].a` → Yes. Each person sees only what their role allows, and your data is never shared or resold.
- `faq.items[4].q` → How long does a project take?
- `faq.items[4].a` → Weeks for one dashboard or report; longer for several departments.

---

## contact (07)

- `contact.eyebrow` → 07 — Contact
- `contact.title` → Start with one report.
- `contact.lead` → Tell us what you work with today and what you want instead.
- `contact.lines.whatsapp.label` → WhatsApp
- `contact.lines.whatsapp.action` → Message us on WhatsApp
- `contact.lines.email.label` → Email
- `contact.lines.location.label` → Based in
- `contact.lines.location.value` → Dar es Salaam, Tanzania
- `contact.lines.location.note` → Working with organisations across Tanzania
- `contact.next.title` → What happens next
- `contact.next.steps[0]` → We reply to set up a short conversation.
- `contact.next.steps[1]` → Together we agree what is worth building.
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
- `footer.legal` → © {year} DataHub

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
