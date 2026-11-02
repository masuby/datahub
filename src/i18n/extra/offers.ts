import "server-only";
import { defineDict } from "../dict";

/**
 * The packages and training pages (owner, 2 Nov 2026): fixed prices,
 * confirmed by Daniel, the same as the printed price sheet
 * (marketing/sales/offer-sheet.html). Change a price in both places.
 *
 * - `nav`, `menu`, `footer` — the two pages' labels in the header, the phone
 *   menu and the footer.
 * - `meta` — each page's title and description.
 * - `packages` — /packages: the four packages, then the training in brief.
 *   `prefill` is the first line of the contact form's message when a visitor
 *   chooses a package (system/prefill): the package and its price, and an
 *   opening for them to finish.
 * - `training` — /training: the two formats, the two days, who it is for,
 *   what you take home, what you need, the trainer. The next open class has
 *   no date yet (`openNext`); set it here when it does.
 */
export const offersExtra = defineDict({
  en: {
    nav: { packages: "Packages", training: "Training" },
    menu: { packages: "Packages and prices", training: "Training" },
    footer: { packages: "Packages and prices", training: "Training" },
    meta: {
      packages: {
        title: "Packages and prices",
        description:
          "Fixed prices for report automation, dashboards, websites with management systems, lender dashboards and team training in Tanzania. Pay half to start.",
      },
      training: {
        title: "Training",
        description:
          "Two days, hands-on: from Excel to automated reports and dashboards. In-house for your team, or in an open class in Dar es Salaam.",
      },
    },
    packages: {
      eyebrow: "Packages",
      title: "Fixed prices. Start small.",
      lead: "Pay half to begin and the rest when we deliver. A 15-minute call confirms what you need; the price comes in writing within 48 hours.",
      stepsLabel: "How a package runs",
      steps: ["15-minute call", "Fixed quote in 48 hours", "50% to start", "We deliver, then the balance"],
      cta: "Start with this package",
      items: [
        {
          key: "report-autopilot",
          name: "Report Autopilot",
          promise: "The report someone rebuilds every week, now built for you automatically.",
          priceLead: "",
          price: "TZS 1,200,000",
          priceNote: "fixed price",
          time: "10 working days",
          includes: [
            "One weekly or monthly report: Excel, PowerPoint or PDF",
            "Built from the files or system you already use",
            "Sent on schedule by email or WhatsApp",
            "30 days of support after handover",
          ],
          care: "Optional care: TZS 150,000 a month",
          prefill: "We'd like to start with Report Autopilot (TZS 1,200,000). The report we build by hand is: ",
        },
        {
          key: "dashboard-starter",
          name: "Dashboard Starter",
          promise: "One screen for the numbers you decide on.",
          priceLead: "",
          price: "TZS 2,500,000",
          priceNote: "fixed price",
          time: "3 weeks",
          includes: [
            "Up to 8 key figures, by branch, product or officer",
            "From Excel, Google Sheets or your database",
            "Refreshes itself; up to 10 users",
            "A training session for your team",
          ],
          care: "Optional care: TZS 250,000 a month",
          prefill: "We'd like to start with Dashboard Starter (TZS 2,500,000). The figures we track are: ",
        },
        {
          key: "website-system",
          name: "Website + Management System",
          promise: "A professional website and the system that runs your office.",
          priceLead: "From",
          price: "TZS 1,500,000",
          priceNote: "each management module from TZS 1,500,000",
          time: "From 2 weeks",
          includes: [
            "A website in English and Kiswahili, made for phones, with WhatsApp and Google",
            "Modules: staff and attendance, jobs and tasks, quotations and invoices, stock, customers",
            "Hosting, backups and updates on the care plan",
          ],
          care: "Care plan: TZS 250,000 a month",
          prefill: "We'd like a website and a management system. Our business: ",
        },
        {
          key: "lender-pack",
          name: "Lender Pack",
          promise: "For microfinance lenders and SACCOs.",
          priceLead: "",
          price: "TZS 1,800,000",
          priceNote: "the pilot, on one branch or product",
          time: "Pilot: 3 weeks",
          includes: [
            "Portfolio and collections dashboard: arrears and PAR by branch and officer",
            "Disbursement against target, every morning",
            "Automated reactivation and refinance lists for your SMS campaigns",
          ],
          care: "Roll-out quoted after the pilot",
          prefill: "We'd like the Lender Pack pilot (TZS 1,800,000). We are a [microfinance lender / SACCO] with about [number] branches.",
        },
      ],
      training: {
        name: "Team Training",
        promise: "From Excel to automated reports and dashboards, in two days.",
        prices: "In-house, up to 15 staff: TZS 2,500,000 · Open class: TZS 150,000 per person",
        link: "See the training",
      },
      notes:
        "Prices in Tanzanian shillings. Bigger or custom work is quoted after a 15-minute call. Your data stays yours.",
    },
    training: {
      eyebrow: "Training",
      title: "From Excel to automated reports and dashboards, in two days.",
      lead: "Hands-on training for analysts, accountants, and finance and operations teams: on your own data, in English or Kiswahili.",
      formatsLabel: "Two ways to take it",
      formats: [
        {
          key: "in-house",
          name: "In-house, for your team",
          price: "TZS 2,500,000",
          priceNote: "up to 15 staff",
          lines: ["At your office, on your own data", "On dates that suit your team", "A certificate for every participant"],
          cta: "Book for your team",
          prefill: "We'd like the two-day training in-house for about [number] staff. Preferred dates: ",
        },
        {
          key: "open",
          name: "Open class",
          price: "TZS 150,000",
          priceNote: "per person",
          lines: ["In Dar es Salaam, 15 seats", "Bring a laptop with Excel", "A certificate for every participant"],
          cta: "Reserve a seat",
          prefill: "I'd like a seat in the next open class. My organisation: ",
        },
      ],
      openNext: "Next open class: dates announced soon. Reserve a seat and you will hear first.",
      daysTitle: "What you will learn",
      days: [
        {
          name: "First day: data that cleans itself",
          items: [
            "Combine and clean files with Power Query",
            "Pivot tables that answer real questions",
            "The formulas that matter: XLOOKUP, SUMIFS, IF",
            "A report that refreshes with one click",
          ],
        },
        {
          name: "Second day: dashboards and automation",
          items: [
            "Design a management dashboard people actually read",
            "Build it in Excel or Power BI",
            "Send a report automatically, on schedule",
            "One source of truth: habits that stop errors",
          ],
        },
      ],
      forTitle: "Who it is for",
      forText:
        "Analysts, accountants, finance and operations staff, loan officers and supervisors, monitoring and evaluation officers: anyone who spends Monday morning in Excel.",
      takeTitle: "What you take home",
      takeItems: [
        "The templates and exercises",
        "The dashboard you built, on your data",
        "A certificate of completion",
        "30 days of questions by WhatsApp",
      ],
      needTitle: "What you need",
      needText: "A laptop with Excel 2016 or newer (Microsoft 365 is best). No coding.",
      trainerTitle: "Your trainer",
      trainerText: "Builds the data pipelines, reports and dashboards our clients use every day, and teaches what he builds.",
      trainerLink: "Meet the team",
    },
  },
  sw: {
    nav: { packages: "Vifurushi", training: "Mafunzo" },
    menu: { packages: "Vifurushi na bei", training: "Mafunzo" },
    footer: { packages: "Vifurushi na bei", training: "Mafunzo" },
    meta: {
      packages: {
        title: "Vifurushi na bei",
        description:
          "Bei maalum za ripoti otomatiki, dashibodi, tovuti na mifumo ya usimamizi, dashibodi za taasisi za mikopo na mafunzo kwa timu nchini Tanzania. Lipa nusu kuanza.",
      },
      training: {
        title: "Mafunzo",
        description:
          "Siku mbili kwa vitendo: kutoka Excel hadi ripoti za otomatiki na dashibodi. Ndani ya kampuni yako, au darasa la wazi jijini Dar es Salaam.",
      },
    },
    packages: {
      eyebrow: "Vifurushi",
      title: "Bei maalum. Anza kidogo.",
      lead: "Lipa nusu kuanza na iliyobaki tukikabidhi. Mazungumzo ya dakika 15 yanathibitisha unachohitaji; bei inakuja kwa maandishi ndani ya saa 48.",
      stepsLabel: "Jinsi kifurushi kinavyokwenda",
      steps: ["Mazungumzo ya dakika 15", "Bei kamili ndani ya saa 48", "50% kuanza", "Tunakabidhi, kisha salio"],
      cta: "Anza na kifurushi hiki",
      items: [
        {
          key: "report-autopilot",
          name: "Ripoti Otomatiki",
          promise: "Ile ripoti inayotengenezwa kwa mkono kila wiki, sasa inajitengeneza yenyewe.",
          priceLead: "",
          price: "TZS 1,200,000",
          priceNote: "bei maalum",
          time: "Siku 10 za kazi",
          includes: [
            "Ripoti moja ya kila wiki au mwezi: Excel, PowerPoint au PDF",
            "Kutoka kwenye mafaili au mfumo mnaotumia sasa",
            "Inatumwa kwa ratiba kwa barua pepe au WhatsApp",
            "Msaada wa siku 30 baada ya kukabidhi",
          ],
          care: "Uangalizi (hiari): TZS 150,000 kwa mwezi",
          prefill: "Tungependa kuanza na Ripoti Otomatiki (TZS 1,200,000). Ripoti tunayoitengeneza kwa mkono ni: ",
        },
        {
          key: "dashboard-starter",
          name: "Dashibodi ya Kuanzia",
          promise: "Skrini moja kwa takwimu mnazofanyia maamuzi.",
          priceLead: "",
          price: "TZS 2,500,000",
          priceNote: "bei maalum",
          time: "Wiki 3",
          includes: [
            "Hadi viashiria 8, kwa tawi, bidhaa au afisa",
            "Kutoka Excel, Google Sheets au hifadhidata yenu",
            "Inajisasisha yenyewe; hadi watumiaji 10",
            "Mafunzo kwa timu yenu",
          ],
          care: "Uangalizi (hiari): TZS 250,000 kwa mwezi",
          prefill: "Tungependa kuanza na Dashibodi ya Kuanzia (TZS 2,500,000). Takwimu tunazofuatilia ni: ",
        },
        {
          key: "website-system",
          name: "Tovuti + Mfumo wa Usimamizi",
          promise: "Tovuti ya kitaalamu na mfumo unaoendesha ofisi yako.",
          priceLead: "Kuanzia",
          price: "TZS 1,500,000",
          priceNote: "kila moduli ya usimamizi kuanzia TZS 1,500,000",
          time: "Kuanzia wiki 2",
          includes: [
            "Tovuti ya Kiingereza na Kiswahili, inayofaa simu, yenye WhatsApp na Google",
            "Moduli: wafanyakazi na mahudhurio, kazi, nukuu za bei na ankara, stoo, wateja",
            "Hosting, nakala rudufu na masasisho kwenye mpango wa uangalizi",
          ],
          care: "Mpango wa uangalizi: TZS 250,000 kwa mwezi",
          prefill: "Tungependa tovuti na mfumo wa usimamizi. Biashara yetu ni: ",
        },
        {
          key: "lender-pack",
          name: "Kifurushi cha Taasisi za Mikopo",
          promise: "Kwa taasisi za mikopo midogo na SACCOS.",
          priceLead: "",
          price: "TZS 1,800,000",
          priceNote: "majaribio, kwenye tawi au bidhaa moja",
          time: "Majaribio: wiki 3",
          includes: [
            "Dashibodi ya mikopo na makusanyo: malimbikizo na PAR kwa tawi na afisa",
            "Utoaji wa mikopo dhidi ya lengo, kila asubuhi",
            "Orodha za otomatiki za wateja wa kurejea na kukopa tena kwa kampeni za SMS",
          ],
          care: "Bei ya kusambaza baada ya majaribio",
          prefill: "Tungependa majaribio ya Kifurushi cha Taasisi za Mikopo (TZS 1,800,000). Sisi ni [taasisi ya mikopo midogo / SACCOS] yenye matawi takriban [idadi].",
        },
      ],
      training: {
        name: "Mafunzo kwa Timu",
        promise: "Kutoka Excel hadi ripoti za otomatiki na dashibodi, kwa siku mbili.",
        prices: "Ndani ya kampuni, hadi watu 15: TZS 2,500,000 · Darasa la wazi: TZS 150,000 kwa mtu",
        link: "Angalia mafunzo",
      },
      notes:
        "Bei ni kwa shilingi za Kitanzania. Kazi kubwa zaidi au maalum hupewa bei baada ya mazungumzo ya dakika 15. Data yako inabaki kuwa yako.",
    },
    training: {
      eyebrow: "Mafunzo",
      title: "Kutoka Excel hadi ripoti za otomatiki na dashibodi, kwa siku mbili.",
      lead: "Mafunzo kwa vitendo kwa wachambuzi, wahasibu, na timu za fedha na uendeshaji: kwa kutumia data yenu, kwa Kiingereza au Kiswahili.",
      formatsLabel: "Njia mbili za kushiriki",
      formats: [
        {
          key: "in-house",
          name: "Ndani ya kampuni yako",
          price: "TZS 2,500,000",
          priceNote: "hadi watu 15",
          lines: ["Ofisini kwenu, kwa data yenu", "Kwa tarehe zinazofaa timu yenu", "Cheti kwa kila mshiriki"],
          cta: "Weka nafasi kwa timu yako",
          prefill: "Tungependa mafunzo ya siku mbili ndani ya kampuni kwa wafanyakazi takriban [idadi]. Tarehe tunazopendelea: ",
        },
        {
          key: "open",
          name: "Darasa la wazi",
          price: "TZS 150,000",
          priceNote: "kwa mtu",
          lines: ["Dar es Salaam, nafasi 15", "Njoo na kompyuta yenye Excel", "Cheti kwa kila mshiriki"],
          cta: "Weka nafasi yako",
          prefill: "Ningependa nafasi kwenye darasa la wazi lijalo. Taasisi yangu: ",
        },
      ],
      openNext: "Darasa la wazi lijalo: tarehe zitatangazwa hivi karibuni. Weka nafasi yako na utajua wa kwanza.",
      daysTitle: "Utakachojifunza",
      days: [
        {
          name: "Siku ya kwanza: data inayojisafisha",
          items: [
            "Kuunganisha na kusafisha mafaili kwa Power Query",
            "Pivot tables zinazojibu maswali halisi",
            "Fomula muhimu: XLOOKUP, SUMIFS, IF",
            "Ripoti inayojisasisha kwa kubofya mara moja",
          ],
        },
        {
          name: "Siku ya pili: dashibodi na otomatiki",
          items: [
            "Kubuni dashibodi ya uongozi inayosomeka kweli",
            "Kuijenga kwa Excel au Power BI",
            "Kutuma ripoti yenyewe, kwa ratiba",
            "Chanzo kimoja cha ukweli: tabia zinazozuia makosa",
          ],
        },
      ],
      forTitle: "Ni kwa ajili ya nani",
      forText:
        "Wachambuzi, wahasibu, wafanyakazi wa fedha na uendeshaji, maafisa mikopo na wasimamizi, maafisa ufuatiliaji na tathmini: yeyote anayeanza Jumatatu asubuhi kwenye Excel.",
      takeTitle: "Unachoondoka nacho",
      takeItems: [
        "Violezo na mazoezi yote",
        "Dashibodi uliyojenga, kwa data yako",
        "Cheti cha kuhitimu",
        "Siku 30 za maswali kwa WhatsApp",
      ],
      needTitle: "Unachohitaji",
      needText: "Kompyuta yenye Excel 2016 au mpya zaidi (Microsoft 365 ni bora). Hakuna uandishi wa code.",
      trainerTitle: "Mkufunzi wako",
      trainerText: "Anajenga mifumo ya data, ripoti na dashibodi ambazo wateja wetu wanazitumia kila siku, na anafundisha anachojenga.",
      trainerLink: "Ifahamu timu",
    },
  },
});
