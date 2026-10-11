# DataHub copy deck: Kiswahili (sw)

Source for `src/i18n/dictionaries/sw.ts`. Must have exactly the same keys as `en.ts` (a key-parity test enforces it).

Conventions:
- One line per key: `key` → value. Arrays use `[0]`, `[1]`… Objects in arrays use `[0].field`.
- `{name}` is an interpolation slot. Never concatenate translated fragments in code; use the slots.
- Typography: real apostrophes (’) and dashes (—, –) as written; the ellipsis is one character (…).
- Identifier values (`figure`, `status`, `index`, `number`, `anchor`) are kept exactly as in English because code matches on them, even where an anchor looks like a visible label (`90+ days`). `deck2ts.py` does not sync them; check after every regeneration.
- Money is written "TZS bilioni 2.30"; durations are written "saa 14", "dakika 4", "sekunde 38".
- Second person is singular (wewe / yako / timu yako), as in Tanzanian business correspondence addressed to one reader. This holds in the body copy of `services.sw.ts` too, and in answers to questions asked as "we" ("Timu yetu…?" is answered with "timu yako").
- Fewer words (iteration 2, §D): follow the English deck's limits (headlines up to about eight words, leads one sentence, body paragraphs at most two sentences, FAQ answers at most two short sentences). Rewrite to match the meaning of the English, not its word order.

---

## meta

- `meta.siteName` → DataHub
- `meta.titleTemplate` → %s · DataHub
- `meta.home.title` → DataHub — Uchambuzi wa Data na Dashibodi Tanzania
- `meta.home.description` → Dashibodi, otomatiki ya ripoti na mawakala wa AI kwa taasisi za Tanzania, vinavyojengwa Dar es Salaam.
- `meta.home.ogTitle` → DataHub — Uchambuzi wa Data na Dashibodi Tanzania
- `meta.home.ogDescription` → Dashibodi, otomatiki ya ripoti na mawakala wa AI Tanzania. Kutoka Data hadi Maamuzi.
- `meta.privacy.title` → Taarifa ya faragha
- `meta.privacy.description` → Kile tovuti hii inachokusanya, kwa nini, na jinsi ya kuomba kifutwe.
- `meta.notFound.title` → Ukurasa haupatikani
- `meta.keywords[0]` → uchambuzi wa data Tanzania
- `meta.keywords[1]` → dashibodi za biashara
- `meta.keywords[2]` → otomatiki ya ripoti
- `meta.keywords[3]` → takwimu za biashara
- `meta.keywords[4]` → mawakala wa AI
- `meta.keywords[5]` → mtengenezaji wa dashibodi Dar es Salaam
- `meta.keywords[6]` → programu maalum Tanzania

## a11y (shared accessibility strings)

- `a11y.skip` → Ruka hadi maudhui
- `a11y.opensNewTab` → (inafunguka kwenye kichupo kipya)
- `a11y.external` → kiungo cha nje
- `a11y.sampleFigure` → Chati ya mfano. Takwimu zote ni za kubuni.
- `a11y.chartKeys` → Tumia vitufe vya mishale ya kushoto na kulia kusogea kwenye data.
- `a11y.today` → Leo:
- `a11y.withDataHub` → Ukiwa na DataHub:

## brand

- `brand.homeLink` → DataHub, ukurasa wa mwanzo
- `brand.tagline` → Kutoka Data hadi Maamuzi

## nav (header, desktop)

- `nav.label` → Menyu kuu
- `nav.services` → Huduma
- `nav.dashboards` → Dashibodi
- `nav.process` → Mchakato
- `nav.security` → Usalama
- `nav.team` → Timu
- `nav.faq` → Maswali

## header

- `header.cta` → Anza mazungumzo
- `header.menuOpen` → Menyu
- `header.menuClose` → Funga
- `header.menuLabel` → Menyu ya tovuti
- `header.progressLabel` → Maendeleo ya kusoma

## menu (mobile sheet, numbered 01–08)

- `menu.items[0]` → Huduma
- `menu.items[1]` → Dashibodi za mfano
- `menu.items[2]` → Hesabu zako
- `menu.items[3]` → Jinsi tunavyofanya kazi
- `menu.items[4]` → Usalama
- `menu.items[5]` → Timu
- `menu.items[6]` → Maswali
- `menu.items[7]` → Mawasiliano
- `menu.whatsapp` → Tutumie ujumbe WhatsApp
- `menu.preferences` → Mipangilio

## theme

- `theme.toggle.toDark` → Tumia mandhari ya giza
- `theme.toggle.toLight` → Tumia mandhari ya mwanga
- `theme.settings.legend` → Mandhari
- `theme.settings.system` → Mfumo
- `theme.settings.light` → Mwanga
- `theme.settings.dark` → Giza

## lang

- `lang.legend` → Lugha
- `lang.en.short` → EN
- `lang.sw.short` → SW
- `lang.en.name` → English
- `lang.sw.name` → Kiswahili
- `lang.en.switchLabel` → Soma ukurasa huu kwa Kiingereza
- `lang.sw.switchLabel` → Soma ukurasa huu kwa Kiswahili

## langHint

The suggestion is shown in the target language on purpose, so these values are identical to `en`.

- `langHint.toSw` → Ukurasa huu unapatikana kwa Kiswahili
- `langHint.toSwLink` → Soma kwa Kiswahili →
- `langHint.toEn` → This page is available in English
- `langHint.toEnLink` → Read in English →
- `langHint.dismiss` → Funga

## motion

- `motion.pause` → Simamisha mwendo
- `motion.resume` → Rejesha mwendo
- `motion.legend` → Mwendo
- `motion.on` → Washa
- `motion.off` → Zima

---

## hero (00)

- `hero.ctaPrimary` → Anza mazungumzo
- `hero.ctaSecondary` → Tazama dashibodi za mfano

## serviceIndex (hero bottom links)

- `serviceIndex.label` → Huduma zetu
- `serviceIndex.items[0].index` → 01.1
- `serviceIndex.items[0].label` → Dashibodi na BI
- `serviceIndex.items[1].index` → 01.2
- `serviceIndex.items[1].label` → Otomatiki ya ripoti
- `serviceIndex.items[2].index` → 01.3
- `serviceIndex.items[2].label` → Mawakala wa AI

---

## services (01)

- `services.eyebrow` → 01 — Tunachofanya
- `services.title` → Njia tatu za kugeuza data kuwa maamuzi.
- `services.lead` → Kila moja inaanzia kwenye kazi ambayo timu yako hufanya kwa mkono.
- `services.readMore` → Soma zaidi
- `services.items.dashboards.index` → 01.1
- `services.items.dashboards.title` → Dashibodi na takwimu za biashara (BI)
- `services.items.dashboards.tagline` → Sehemu moja ya kufanyia maamuzi
- `services.items.dashboards.description` → Takwimu za sasa dhidi ya lengo, kwa kila tawi, idara au afisa.
- `services.items.dashboards.glyphLabel` → Mstari unaopanda kuelekea alama ya lengo
- `services.items.automation.index` → 01.2
- `services.items.automation.title` → Otomatiki ya ripoti
- `services.items.automation.tagline` → Kazi ya saa nyingi, kwa sekunde
- `services.items.automation.description` → Ripoti zako za kila wiki za Excel na PowerPoint, zinajitengeneza zenyewe.
- `services.items.automation.glyphLabel` → Mistari mitatu inayoungana kuwa mmoja
- `services.items.aiAgents.index` → 01.3
- `services.items.aiAgents.title` → Mawakala wa AI
- `services.items.aiAgents.tagline` → Husoma data, huandaa hatua ijayo
- `services.items.aiAgents.description` → Mawakala wanaofuatilia data yako, kufupisha kilichobadilika na kusubiri mtu aidhinishe.
- `services.items.aiAgents.glyphLabel` → Nukta tatu zilizounganishwa, moja ikiwa na alama ya kuidhinishwa

Deliverable labels under each row are read from `services.ts` (`deliverables[].title`) and are not repeated here.

---

## dash (02, sample dashboards)

### Shared

- `dash.eyebrow` → 02 — Dashibodi za mfano
- `dash.title` → Jumatatu yako inaweza kuonekana hivi.
- `dash.lead` → Mionekano minne, iliyojengwa kama tunavyojenga kwa wateja.
- `dash.notice` → Data ya mfano — hatuchapishi dashibodi za wateja
- `dash.stamp` → DATA YA MFANO
- `dash.footnote` → Majina na namba zote hapa ni za kubuni.
- `dash.credit` → Chanzo: data ya mfano ya DataHub · TZS · {period}
- `dash.figPrefix` → Kielelezo
- `dash.tablistLabel` → Mionekano ya dashibodi za mfano
- `dash.showTable` → Tazama kama jedwali
- `dash.readHint` → Inaonyesha lengo la kila chati na uamuzi inaousaidia.
- `dash.read.on` → Eleza mwonekano huu
- `dash.read.off` → Ficha maelezo
- `dash.read.listLabel` → Chati hii inakuambia nini
- `dash.read.markerLabel` → Maelezo {n}
- `dash.read.decisionPrefix` → Uamuzi:
- `dash.readout.idle` → Sogeza juu ya chati ili kusoma thamani
- `dash.status.onTarget` → Imefikia lengo
- `dash.status.watch` → Angalizo
- `dash.status.breach` → Imevuka kikomo
- `dash.status.done` → Imekamilika
- `dash.status.sent` → Imetumwa
- `dash.status.awaiting` → Inasubiri idhini
- `dash.status.queued` → Inasubiri kukaguliwa
- `dash.units.bn` → bilioni
- `dash.units.mn` → milioni
- `dash.units.hours` → h
- `dash.units.seconds` → s
- `dash.units.minutes` → dk
- `dash.units.percent` → %
- `dash.months[0]` → Jan
- `dash.months[1]` → Feb
- `dash.months[2]` → Mac
- `dash.months[3]` → Apr
- `dash.months[4]` → Mei
- `dash.months[5]` → Jun
- `dash.months[6]` → Jul
- `dash.months[7]` → Ago
- `dash.months[8]` → Sep
- `dash.months[9]` → Okt
- `dash.months[10]` → Nov
- `dash.months[11]` → Des
- `dash.table.month` → Mwezi
- `dash.table.value` → Thamani
- `dash.table.target` → Lengo

### View 1: overview

- `dash.views.overview.index` → 02.1
- `dash.views.overview.tab` → Muhtasari kwa uongozi
- `dash.views.overview.tabDescription` → Mwezi mzima kwenye skrini moja, kwa ajili ya uongozi.
- `dash.views.overview.entity` → Mkopeshaji wa mfano (mikopo midogo)
- `dash.views.overview.period` → Jan–Sep 2026
- `dash.views.overview.creditPeriod` → Jan–Sep 2026
- `dash.views.overview.kpis[0].label` → Mapato tangu mwanzo wa mwaka
- `dash.views.overview.kpis[0].context` → 94% ya lengo la TZS bilioni 19.6
- `dash.views.overview.kpis[1].label` → Ufanisi wa makusanyo
- `dash.views.overview.kpis[1].context` → Lengo 95.0%
- `dash.views.overview.kpis[2].label` → Wakopaji hai
- `dash.views.overview.kpis[2].context` → +6.1% tangu mwisho wa Juni
- `dash.views.overview.kpis[3].label` → Uwiano wa gharama kwa mapato
- `dash.views.overview.kpis[3].context` → Kiwango cha juu 60.0%
- `dash.views.overview.figures.revenue.number` → 02.1
- `dash.views.overview.figures.revenue.title` → Mapato dhidi ya lengo, kwa mwezi
- `dash.views.overview.figures.revenue.axis` → TZS bilioni
- `dash.views.overview.figures.revenue.seriesActual` → Mapato
- `dash.views.overview.figures.revenue.seriesTarget` → Lengo
- `dash.views.overview.figures.revenue.readout` → {month} · TZS bilioni {value} · {pct}% ya lengo
- `dash.views.overview.figures.revenue.summary` → Mapato yalikuwa chini ya lengo la mwezi la TZS bilioni 2.18 hadi Septemba (TZS bilioni 2.30).
- `dash.views.overview.figures.branches.number` → 02.2
- `dash.views.overview.figures.branches.title` → Matawi, % ya lengo la mapato
- `dash.views.overview.figures.branches.axis` → % ya lengo
- `dash.views.overview.figures.branches.readout` → {branch} · {pct}% ya lengo
- `dash.views.overview.figures.branches.summary` → Kariakoo pekee iko juu ya lengo, kwa 104%.
- `dash.views.overview.figures.exceptions.number` → 02.3
- `dash.views.overview.figures.exceptions.title` → Yasiyo ya kawaida
- `dash.views.overview.figures.exceptions.items[0]` → Mbeya PAR30 7.2% (kikomo 5.0%)
- `dash.views.overview.figures.exceptions.items[1]` → Dodoma PAR30 5.4% (kikomo 5.0%)
- `dash.views.overview.figures.exceptions.items[2]` → Mikopo iliyotolewa Dodoma iko 18% chini ya mpango
- `dash.views.overview.figures.exceptions.items[3]` → Ripoti ya bodi imetengenezwa saa 05:58, imetumwa kwa wapokeaji 9
- `dash.views.overview.figures.exceptions.summary` → Matawi mawili yamevuka kikomo cha PAR30, moja liko nyuma ya mpango, na ripoti ya bodi ilitumwa kwa wakati.
- `dash.views.overview.changed.label` → Kilichobadilika wiki hii
- `dash.views.overview.changed.byline` → Imeandikwa na wakala wa ripoti · mfano
- `dash.views.overview.changed.items[0]` → PAR30 ya Mbeya imepanda kwa pointi 0.8 hadi 7.2%, hasa kutokana na maafisa mikopo wawili.
- `dash.views.overview.changed.items[1]` → Mikopo iliyotolewa Dodoma iko 18% chini ya mpango, hasa mikopo ya vikundi.
- `dash.views.overview.changed.items[2]` → Septemba, kwa TZS bilioni 2.30, ni mwezi wa kwanza mwaka huu kuvuka lengo.
- `dash.views.overview.read[0].figure` → revenue
- `dash.views.overview.read[0].anchor` → Sep
- `dash.views.overview.read[0].shows` → Septemba ni mwezi wa kwanza kuvuka lengo.
- `dash.views.overview.read[0].decision` → Uongozi unaweza kurekebisha mpango wa robo ya nne sasa.
- `dash.views.overview.read[1].figure` → branches
- `dash.views.overview.read[1].anchor` → Mbeya
- `dash.views.overview.read[1].shows` → Mbeya iko chini zaidi, kwa 84% ya lengo.
- `dash.views.overview.read[1].decision` → Mameneja wa kanda wanajua waanzie wapi.
- `dash.views.overview.read[2].figure` → exceptions
- `dash.views.overview.read[2].anchor` → 0
- `dash.views.overview.read[2].shows` → Matawi mawili yamevuka kikomo cha PAR30 cha 5%.
- `dash.views.overview.read[2].decision` → Mkuu wa Mikopo anaona ukiukaji asubuhi ileile.

### View 2: loans

- `dash.views.loans.index` → 02.2
- `dash.views.loans.tab` → Jalada la mikopo
- `dash.views.loans.tabDescription` → Malimbikizo, umri wa madeni na maafisa, kwa timu ya mikopo.
- `dash.views.loans.entity` → Mkopeshaji wa mfano (mikopo midogo)
- `dash.views.loans.period` → Kufikia 30 Sep 2026
- `dash.views.loans.creditPeriod` → Sep 2026
- `dash.views.loans.kpis[0].label` → Jumla ya jalada la mikopo
- `dash.views.loans.kpis[0].context` → +2.1% tangu Agosti
- `dash.views.loans.kpis[1].label` → PAR30
- `dash.views.loans.kpis[1].context` → Kikomo 5.0%
- `dash.views.loans.kpis[2].label` → Mikopo chechefu (siku 90+)
- `dash.views.loans.kpis[2].context` → Sehemu ya jalada
- `dash.views.loans.kpis[3].label` → Mikopo iliyotolewa Septemba
- `dash.views.loans.kpis[3].context` → Mpango TZS bilioni 6.1
- `dash.views.loans.figures.par.number` → 02.4
- `dash.views.loans.figures.par.title` → PAR30, miezi 12 iliyopita
- `dash.views.loans.figures.par.axis` → % ya jalada
- `dash.views.loans.figures.par.limit` → Kikomo 5.0%
- `dash.views.loans.figures.par.readout` → {month} · PAR30 {value}%
- `dash.views.loans.figures.par.summary` → PAR30 ilizidi kikomo cha 5% kuanzia Mei hadi Julai.
- `dash.views.loans.figures.ageing.number` → 02.5
- `dash.views.loans.figures.ageing.title` → Umri wa madeni katika jalada
- `dash.views.loans.figures.ageing.buckets[0]` → Hayajachelewa
- `dash.views.loans.figures.ageing.buckets[1]` → Siku 1–30
- `dash.views.loans.figures.ageing.buckets[2]` → Siku 31–60
- `dash.views.loans.figures.ageing.buckets[3]` → Siku 61–90
- `dash.views.loans.figures.ageing.buckets[4]` → Siku 90+
- `dash.views.loans.figures.ageing.summary` → 91.2% ya jalada haijachelewa.
- `dash.views.loans.figures.mix.number` → 02.6
- `dash.views.loans.figures.mix.title` → Jalada kwa aina ya mkopo
- `dash.views.loans.figures.mix.products[0]` → Mikopo ya vikundi
- `dash.views.loans.figures.mix.products[1]` → Biashara ndogo na za kati
- `dash.views.loans.figures.mix.products[2]` → Mishahara
- `dash.views.loans.figures.mix.products[3]` → Kilimo
- `dash.views.loans.figures.mix.summary` → Mikopo ya vikundi ndiyo bidhaa kubwa zaidi: TZS bilioni 21.8 kati ya TZS bilioni 64.2.
- `dash.views.loans.figures.flows.number` → 02.7
- `dash.views.loans.figures.flows.title` → Mikopo iliyotolewa na marejesho, Apr–Sep
- `dash.views.loans.figures.flows.axis` → TZS bilioni
- `dash.views.loans.figures.flows.seriesDisbursed` → Mikopo iliyotolewa
- `dash.views.loans.figures.flows.seriesRepaid` → Marejesho
- `dash.views.loans.figures.flows.readout` → {month} · mikopo iliyotolewa TZS bilioni {a} · marejesho TZS bilioni {b}
- `dash.views.loans.figures.flows.summary` → Mikopo iliyotolewa ilikuwa TZS bilioni 5.2–5.9 kwa mwezi.
- `dash.views.loans.officers.title` → Maafisa mikopo
- `dash.views.loans.officers.caption` → Maafisa wanaonyeshwa kwa namba ya utambulisho pekee.
- `dash.views.loans.officers.columns.code` → Afisa
- `dash.views.loans.officers.columns.branch` → Tawi
- `dash.views.loans.officers.columns.portfolio` → Jalada
- `dash.views.loans.officers.columns.par` → PAR30
- `dash.views.loans.officers.columns.trend` → Miezi 12
- `dash.views.loans.read[0].figure` → par
- `dash.views.loans.read[0].anchor` → Jul
- `dash.views.loans.read[0].shows` → PAR30 ilifikia kilele cha 5.4% Julai.
- `dash.views.loans.read[0].decision` → Ukiukaji unaripotiwa siku ileile, hivyo makusanyo yanaanza mapema.
- `dash.views.loans.read[1].figure` → ageing
- `dash.views.loans.read[1].anchor` → 90+ days
- `dash.views.loans.read[1].shows` → 1.5% imechelewa zaidi ya siku 90.
- `dash.views.loans.read[1].decision` → Idara za fedha na mikopo zinajadili tengo la hasara kwa namba ileile.
- `dash.views.loans.read[2].figure` → officers
- `dash.views.loans.read[2].anchor` → LO-047
- `dash.views.loans.read[2].shows` → Maafisa wawili wamevuka kikomo.
- `dash.views.loans.read[2].decision` → Ufuatiliaji unaelekezwa kwenye majalada mawili, si tawi zima.
- `dash.views.loans.read[3].figure` → flows
- `dash.views.loans.read[3].anchor` → Jul
- `dash.views.loans.read[3].shows` → Julai, marejesho yalizidi mikopo iliyotolewa kwa mara ya kwanza.
- `dash.views.loans.read[3].decision` → Idara ya hazina inapanga fedha kwa kufuata mwenendo, si makadirio ya mwezi uliopita.

### View 3: sales

- `dash.views.sales.index` → 02.3
- `dash.views.sales.tab` → Mauzo kwa mkoa
- `dash.views.sales.tabDescription` → Mauzo yanatoka wapi na yanakua wapi.
- `dash.views.sales.entity` → Msambazaji wa mfano (bidhaa za walaji)
- `dash.views.sales.period` → Robo ya 3, 2026 (Jul–Sep)
- `dash.views.sales.creditPeriod` → Robo ya 3, 2026
- `dash.views.sales.kpis[0].label` → Mauzo, robo ya 3
- `dash.views.sales.kpis[0].context` → +11.3% ukilinganisha na robo ya 3, 2025
- `dash.views.sales.kpis[1].label` → Maduka hai
- `dash.views.sales.kpis[1].context` → Yaliyoagiza katika robo ya 3
- `dash.views.sales.kpis[2].label` → Wastani wa oda
- `dash.views.sales.kpis[2].context` → Kwa kila oda ya duka
- `dash.views.sales.kpis[3].label` → Mikoa iliyovuka mpango
- `dash.views.sales.kpis[3].value` → 6 kati ya 10
- `dash.views.sales.kpis[3].context` → Mpango wa robo ya 3
- `dash.views.sales.figures.map.number` → 02.8
- `dash.views.sales.figures.map.title` → Mauzo kwa mkoa
- `dash.views.sales.figures.map.legendTitle` → Ukuaji ukilinganisha na robo ya 3, 2025
- `dash.views.sales.figures.map.legend[0]` → hadi 6%
- `dash.views.sales.figures.map.legend[1]` → 7–9%
- `dash.views.sales.figures.map.legend[2]` → 10–13%
- `dash.views.sales.figures.map.legend[3]` → 14–17%
- `dash.views.sales.figures.map.legend[4]` → 18% au zaidi
- `dash.views.sales.figures.map.ringNote` → Ukubwa wa duara unaonyesha mauzo.
- `dash.views.sales.figures.map.summary` → Dar es Salaam ina mauzo makubwa zaidi; Dodoma, Mwanza na Arusha zilikua kwa kasi zaidi.
- `dash.views.sales.figures.ranked.number` → 02.9
- `dash.views.sales.figures.ranked.title` → Mikoa kwa mpangilio wa mauzo
- `dash.views.sales.figures.ranked.columns.region` → Mkoa
- `dash.views.sales.figures.ranked.columns.sales` → Mauzo
- `dash.views.sales.figures.ranked.columns.share` → Sehemu
- `dash.views.sales.figures.ranked.columns.growth` → Ukuaji
- `dash.views.sales.figures.ranked.other` → Mikoa mingine
- `dash.views.sales.figures.ranked.readout` → {region} · TZS bilioni {value} · {share}% ya mauzo · ukuaji {growth}%
- `dash.views.sales.figures.ranked.summary` → Dar es Salaam ni 30.6% ya mauzo.
- `dash.views.sales.read[0].figure` → map
- `dash.views.sales.read[0].anchor` → Dodoma
- `dash.views.sales.read[0].shows` → Dodoma ilikua kwa kasi zaidi: 21% ukilinganisha na mwaka jana.
- `dash.views.sales.read[0].decision` → Jaribu kuhamishia bidhaa na wauzaji kwenye ukanda wa kati.
- `dash.views.sales.read[1].figure` → ranked
- `dash.views.sales.read[1].anchor` → Dar es Salaam
- `dash.views.sales.read[1].shows` → Dar es Salaam ilikua kwa 8%, chini ya wastani wa jumla wa 11.3%.
- `dash.views.sales.read[1].decision` → Fuatilia mkoa mkubwa zaidi kwa hisa ya soko, si kwa wingi wa mauzo.
- `dash.views.sales.read[2].figure` → ranked
- `dash.views.sales.read[2].anchor` → Tanga
- `dash.views.sales.read[2].shows` → Tanga ilikua kwa 4%, mkoa uliokua polepole zaidi.
- `dash.views.sales.read[2].decision` → Kagua ufikiaji wa maduka kabla ya kuweka malengo ya robo ijayo.

### View 4: operations

- `dash.views.operations.index` → 02.4
- `dash.views.operations.tab` → Otomatiki na uendeshaji
- `dash.views.operations.tabDescription` → Ripoti zinazojiendesha zenyewe, na kumbukumbu za wakala.
- `dash.views.operations.entity` → Mfumo wa ripoti wa mkopeshaji wa mfano
- `dash.views.operations.period` → Septemba 2026 · ratiba ya Jumatatu ya mfano
- `dash.views.operations.creditPeriod` → Sep 2026
- `dash.views.operations.kpis[0].label` → Ripoti zilizowasilishwa kiotomatiki
- `dash.views.operations.kpis[0].context` → Mwezi Septemba
- `dash.views.operations.kpis[1].label` → Muda wa kati (median) wa kutengeneza ripoti
- `dash.views.operations.kpis[1].context` → Mizunguko 14 ya mwisho
- `dash.views.operations.kpis[2].label` → Saa za wafanyakazi zilizookolewa
- `dash.views.operations.kpis[2].context` → Makadirio, dhidi ya kazi ya mkono
- `dash.views.operations.kpis[3].label` → Mizunguko iliyoshindwa
- `dash.views.operations.kpis[3].context` → Yote miwili ilirudiwa asubuhi ileile
- `dash.views.operations.figures.schedule.number` → 02.10
- `dash.views.operations.figures.schedule.title` → Ratiba ya Jumatatu
- `dash.views.operations.figures.schedule.lanes[0]` → Ripoti
- `dash.views.operations.figures.schedule.lanes[1]` → Tahadhari
- `dash.views.operations.figures.schedule.lanes[2]` → Wakala
- `dash.views.operations.figures.schedule.items[0]` → 05:30 Ripoti ya PAR ya kila siku → mameneja 14 wa matawi
- `dash.views.operations.figures.schedule.items[1]` → 05:58 Ripoti ya bodi (Jumatatu) → wapokeaji 9
- `dash.views.operations.figures.schedule.items[2]` → 07:00 Yasiyo ya kawaida kwenye makusanyo → wakala anaandaa rasimu za ufuatiliaji
- `dash.views.operations.figures.schedule.items[3]` → 12:00 Hali ya fedha taslimu
- `dash.views.operations.figures.schedule.items[4]` → 18:30 Kufunga hesabu za siku
- `dash.views.operations.figures.schedule.timeAxis` → Saa za Afrika Mashariki
- `dash.views.operations.figures.schedule.summary` → Kazi tano zinaendeshwa kuanzia 05:30 hadi 18:30.
- `dash.views.operations.figures.runs.number` → 02.11
- `dash.views.operations.figures.runs.title` → Muda wa kutengeneza, mizunguko 14 ya mwisho
- `dash.views.operations.figures.runs.axis` → sekunde
- `dash.views.operations.figures.runs.readout` → Mzunguko {n} · sekunde {value}
- `dash.views.operations.figures.runs.slowLabel` → Mzunguko wa polepole
- `dash.views.operations.figures.runs.summary` → Mizunguko mingi ilichukua sekunde 35–41.
- `dash.views.operations.figures.pack.number` → 02.12
- `dash.views.operations.figures.pack.title` → Ripoti ya menejimenti ya kila mwezi
- `dash.views.operations.figures.pack.before` → Kwa mkono
- `dash.views.operations.figures.pack.after` → Kiotomatiki
- `dash.views.operations.figures.pack.beforeValue` → saa 14
- `dash.views.operations.figures.pack.afterValue` → dakika 4
- `dash.views.operations.figures.pack.summary` → Ripoti ya kila mwezi: saa 14 kwa mkono, dakika 4 kiotomatiki.
- `dash.views.operations.log.title` → Kumbukumbu za wakala
- `dash.views.operations.log.caption` → Wakala anaandaa rasimu. Mtu anaidhinisha chochote kinachotoka nje ya taasisi.
- `dash.views.operations.log.items[0].time` → 05:30
- `dash.views.operations.log.items[0].text` → Ripoti ya PAR ya kila siku imetumwa kwa mameneja 14 wa matawi.
- `dash.views.operations.log.items[0].status` → sent
- `dash.views.operations.log.items[1].time` → 05:58
- `dash.views.operations.log.items[1].text` → Ripoti ya bodi ya Jumatatu imetumwa kwa wapokeaji 9.
- `dash.views.operations.log.items[1].status` → sent
- `dash.views.operations.log.items[2].time` → 07:02
- `dash.views.operations.log.items[2].text` → PAR30 imevuka kikomo cha 5.0% Mbeya (7.2%) na Dodoma (5.4%). Rasimu ya ujumbe imeandaliwa kwa Mkuu wa Mikopo.
- `dash.views.operations.log.items[2].status` → awaiting
- `dash.views.operations.log.items[3].time` → 07:09
- `dash.views.operations.log.items[3].text` → Mkuu wa Mikopo ameidhinisha ujumbe; umetumwa kwa mameneja wa matawi yote mawili.
- `dash.views.operations.log.items[3].status` → sent
- `dash.views.operations.log.items[4].time` → 07:15
- `dash.views.operations.log.items[4].text` → Rasimu za vikumbusho 41 vya malimbikizo zinasubiri kukaguliwa na maafisa mikopo.
- `dash.views.operations.log.items[4].status` → queued
- `dash.views.operations.read[0].figure` → schedule
- `dash.views.operations.read[0].anchor` → 05:30
- `dash.views.operations.read[0].shows` → Ripoti ya PAR inawafikia mameneja 14 saa 05:30, kabla matawi hayajafunguliwa.
- `dash.views.operations.read[0].decision` → Mameneja wanaanza siku wakiwa na namba za jana.
- `dash.views.operations.read[1].figure` → runs
- `dash.views.operations.read[1].anchor` → 7
- `dash.views.operations.read[1].shows` → Mzunguko mmoja ulichukua sekunde 61, wakati muda wa kati ni sekunde 38.
- `dash.views.operations.read[1].decision` → Mzunguko wa polepole unaonekana kabla haujawa ripoti iliyochelewa.
- `dash.views.operations.read[2].figure` → log
- `dash.views.operations.read[2].anchor` → 07:02
- `dash.views.operations.read[2].shows` → Wakala aliandaa rasimu ya ujumbe; mtu aliuidhinisha dakika saba baadaye.
- `dash.views.operations.read[2].decision` → Unachagua hatua zipi zibaki mikononi mwa mtu.
- `dash.views.operations.read[3].figure` → pack
- `dash.views.operations.read[3].anchor` → after
- `dash.views.operations.read[3].shows` → Kutoka saa 14 hadi dakika 4.
- `dash.views.operations.read[3].decision` → Wachambuzi wanafafanua namba badala ya kuzinakili.

---

## estimator (03, advanced feature B)

Word order differs from English: Kiswahili puts the noun before the number ("ripoti 3", "watu 2", "saa 4"). The slot order of `sentence[]` is unchanged; `{personWord}` moves into `sentence[4]` so it lands before `{people}`.

- `estimator.eyebrow` → 03 — Hesabu zako
- `estimator.title` → Saa za kazi zinakwenda wapi?
- `estimator.lead` → Weka namba za ripoti moja uone inavyoigharimu timu yako.
- `estimator.sentence[0]` → Tunaandaa ripoti␠
- `estimator.sentence[1]` → {count}
- `estimator.sentence[2]` → ␠kila␠
- `estimator.sentence[3]` → {period}
- `estimator.sentence[4]` → . Kila moja inaandaliwa na {personWord}␠
- `estimator.sentence[5]` → {people}
- `estimator.sentence[6]` → ␠kwa takriban saa␠
- `estimator.sentence[7]` → {hours}
- `estimator.sentence[8]` → .
- `estimator.personWord.one` → mtu
- `estimator.personWord.other` → watu
- `estimator.reportWord.one` → ripoti
- `estimator.reportWord.other` → ripoti
- `estimator.hourWord.one` → saa
- `estimator.hourWord.other` → saa
- `estimator.periods.day` → siku ya kazi
- `estimator.periods.week` → wiki
- `estimator.periods.month` → mwezi
- `estimator.periodUnits.day` → siku za kazi
- `estimator.periodUnits.week` → wiki
- `estimator.periodUnits.month` → miezi
- `estimator.labels.count` → Idadi ya ripoti
- `estimator.labels.period` → Mara ngapi
- `estimator.labels.people` → Watu wanaohusika kwenye kila ripoti
- `estimator.labels.hours` → Saa ambazo kila mtu hutumia kwa ripoti moja
- `estimator.stepper.decrease` → Punguza {label}
- `estimator.stepper.increase` → Ongeza {label}
- `estimator.salary.label` → Wastani wa mshahara wa mwezi wa wanaohusika (si lazima)
- `estimator.salary.placeholder` → mf. 1,500,000
- `estimator.salary.unit` → TZS
- `estimator.salary.help` → Inaonyesha gharama kwa shilingi. Taarifa hii inabaki kwenye kifaa chako.
- `estimator.result.label` → Makadirio yako
- `estimator.result.hours` → ≈ saa {hours} kwa mwaka
- `estimator.result.days` → siku {days} za kazi
- `estimator.result.cost` → ≈ TZS {amount} kwa mwaka, gharama ya muda wa wafanyakazi
- `estimator.formula.hours` → ripoti {count} × {periodUnit} {periods} × {personWord} {people} × saa {hours} = saa {total} kwa mwaka · saa 8 = siku 1 ya kazi
- `estimator.formula.cost` → TZS {salary} ÷ saa 176 kwa mwezi = TZS {hourly} kwa saa
- `estimator.formula.assumptions` → Tunachukulia siku 240 za kazi, wiki 48 za kazi au miezi 12 kwa mwaka.
- `estimator.note` → Ni makadirio, si nukuu ya bei. Hakuna kinachotumwa usipotuma ujumbe.
- `estimator.addToMessage` → Ongeza hii kwenye ujumbe wangu
- `estimator.added` → Imeongezwa kwenye ujumbe wako. Jaza jina lako ili kuutuma.
- `estimator.messageTemplate` → Tunaandaa ripoti {count} kila {period}. Kila moja inaandaliwa na {personWord} {people} kwa takriban saa {hours}, yaani takriban saa {hoursPerYear} kwa mwaka.
- `estimator.error.range` → Tumia namba kati ya {min} na {max}.

---

## process (04)

- `process.eyebrow` → 04 — Tunavyofanya kazi
- `process.title` → Jinsi mradi unavyoendeshwa.
- `process.lead` → Kila mfumo ni tofauti; njia yetu ya kuujenga haibadiliki.
- `process.receivePrefix` → Unapokea:
- `process.steps[0].index` → 04.1
- `process.steps[0].title` → Kuchunguza
- `process.steps[0].description` → Tunaelewa mtiririko wako wa kazi na kubaini kazi ya mkono.
- `process.steps[0].receive` → takwimu muhimu, na tathmini ya wazi kama mfumo unastahili kujengwa.
- `process.steps[1].index` → 04.2
- `process.steps[1].title` → Kusanifu
- `process.steps[1].description` → Tunapanga mfumo kulingana na jinsi unavyofanya kazi.
- `process.steps[1].receive` → mpango unaouidhinisha kabla hatujaanza kujenga.
- `process.steps[2].index` → 04.3
- `process.steps[2].title` → Kujenga
- `process.steps[2].description` → Tunaujenga kwa usalama, katika miundo ambayo timu yako tayari inaitumia.
- `process.steps[2].receive` → mfumo unaofanya kazi, tayari kutumika.
- `process.steps[3].index` → 04.4
- `process.steps[3].title` → Kusaidia
- `process.steps[3].description` → Tunaifundisha timu yako na kurekebisha mfumo kadri mahitaji yanavyobadilika.
- `process.steps[3].receive` → mafunzo, na mabadiliko unapoyahitaji.
- `process.closing` → Kitu chenye manufaa kinaifikia timu yako mapema, si kila kitu mwishoni.

---

## security (05)

- `security.title` → Kutoka kazi ya mkono iliyotawanyika hadi mfumo wa kiotomatiki ulio wazi.
- `security.ledger.todayHeading` → Leo
- `security.ledger.withHeading` → Ukiwa na DataHub
- `security.ledger.rows[0].today` → Ripoti huchukua saa au siku
- `security.ledger.rows[0].with` → Ripoti zinatengenezwa kwa sekunde
- `security.ledger.rows[1].today` → Watu tofauti wanapata namba tofauti
- `security.ledger.rows[1].with` → Jibu moja kwa wote
- `security.ledger.rows[2].today` → Mafaili yametawanyika kwenye barua pepe na folda
- `security.ledger.rows[2].with` → Sehemu moja, kwenye kivinjari chochote
- `security.ledger.rows[3].today` → Ripoti hupangwa na kutumwa kwa barua pepe kwa mkono
- `security.ledger.rows[3].with` → Zinawasilishwa kwa ratiba
- `security.ledger.rows[4].today` → Hakuna picha ya sasa ya utendaji
- `security.ledger.rows[4].with` → Takwimu za sasa kwa mtazamo mmoja
- `security.data.title` → Data yako inabaki kuwa yako.
- `security.data.body` → Katika kila mfumo tunaoujenga, usalama unaanza na mstari wa kwanza wa msimbo.
- `security.data.items[0].term` → Ufikiaji kwa nafasi ya kazi
- `security.data.items[0].definition` → Kila mtu anaona tu kile ambacho nafasi yake ya kazi inaruhusu.
- `security.data.items[1].term` → Taarifa za kuingia zilizosimbwa
- `security.data.items[1].definition` → Nywila na siri za kuunganisha mifumo zinahifadhiwa zikiwa zimesimbwa.
- `security.data.items[2].term` → Maingizo yanayohakikiwa
- `security.data.items[2].definition` → Seva inakagua kila kinachoingizwa kabla ya kutumika.
- `security.data.items[3].term` → Miingiliano iliyoimarishwa
- `security.data.items[3].definition` → Miingiliano inakubali tu kile inachohitaji.
- `security.data.items[4].term` → Mawakala wenye mipaka
- `security.data.items[4].definition` → Wakala wa AI hapati ufikiaji zaidi ya mtu anayemfanyia kazi.
- `security.data.items[5].term` → Haishirikishwi kamwe
- `security.data.items[5].definition` → Data yako haishirikishwi wala kuuzwa kamwe.
- `security.proof.title` → Ushahidi kwenye ukurasa huu
- `security.proof.lead` → Madai kuhusu tovuti hii unayoweza kuhakiki mwenyewe.
- `security.proof.lines[0]` → Skripti: zetu pekee. Msimbo mpya wa usalama kwa kila ziara unazuia skripti zilizopachikwa zisiendeshwe.
- `security.proof.lines[1]` → Vifuatiliaji na programu za takwimu za makampuni mengine: hakuna.
- `security.proof.lines[2]` → Fonti na picha: zinatolewa kutoka datahub.co.tz.
- `security.proof.lines[3]` → Vidakuzi (cookies): hakuna. Chaguo zako zinabaki kwenye kivinjari chako.
- `security.proof.lines[4]` → Fomu ya mawasiliano: inakaguliwa kwenye seva yetu, inaruhusu jumbe chache tu kwa kila anwani ya mtandao, na inachuja barua taka za kiotomatiki.
- `security.proof.showPolicy` → Onyesha sera kamili
- `security.proof.policyNote` → Kichwa cha Content-Security-Policy cha ukurasa huu, msimbo wa kila ziara ukiwa umefichwa.
- `security.proof.check` → Kagua mwenyewe vichwa vyetu vya usalama

---

## team (06)

- `team.eyebrow` → 06 — Timu
- `team.title` → Watu utakaofanya nao kazi.
- `team.lead` → Hivi ndivyo tunavyogawana kazi kwenye mradi wako.
- `team.members.cto.index` → 06.1
- `team.members.cto.name` → Daniel C. Masubi
- `team.members.cto.role` → Afisa Mkuu wa Teknolojia
- `team.members.cto.bio` → Anajenga mifumo, kuanzia mitiririko ya data hadi mawakala, na anawajibika kwa usalama wa data yako.
- `team.members.cto.alt` → Daniel C. Masubi, Afisa Mkuu wa Teknolojia, DataHub
- `team.members.operations.index` → 06.2
- `team.members.operations.name` → Kanuda L. Sasi
- `team.members.operations.role` → Mkuu wa Uendeshaji
- `team.members.operations.bio` → Anasimamia utekelezaji, kuanzia wigo wa kazi hadi msaada, ili kilichokubaliwa ndicho kifike.
- `team.members.operations.alt` → Kanuda L. Sasi, Mkuu wa Uendeshaji, DataHub
- `team.members.marketing.index` → 06.3
- `team.members.marketing.name` → Yohana K. Mussa
- `team.members.marketing.role` → Mkuu wa Masoko
- `team.members.marketing.bio` → Mara nyingi ndiye utakayezungumza naye kwanza: anabainisha tatizo lako halisi na anakujulisha maendeleo.
- `team.members.marketing.alt` → Yohana K. Mussa, Mkuu wa Masoko, DataHub

---

## faq (07)

- `faq.eyebrow` → 07 — Maswali
- `faq.title` → Maswali ambayo watu huuliza kabla ya kuanza.
- `faq.aside` → Hujapata jibu hapa?
- `faq.asideWhatsapp` → Tuulize kupitia WhatsApp
- `faq.asideEmail` → Tutumie barua pepe
- `faq.indexPrefix` → S
- `faq.items[0].q` → DataHub inafanya nini?
- `faq.items[0].a` → Tunajenga dashibodi, ripoti za kiotomatiki na mawakala wa AI kwa taasisi za Tanzania.
- `faq.items[1].q` → Mnapatikana wapi?
- `faq.items[1].a` → Dar es Salaam. Tunafanya kazi kote Tanzania na nje ya nchi, mara nyingi kwa mbali, na ofisini kwako inapohitajika.
- `faq.items[2].q` → Dashibodi inagharimu kiasi gani?
- `faq.items[2].a` → Inategemea kazi, kwa hiyo tunapanga wigo kabla ya kutaja bei. Mazungumzo ya kwanza ni bure.
- `faq.items[3].q` → Je, data yetu iko salama?
- `faq.items[3].a` → Ndiyo. Kila mtu anaona tu kile ambacho nafasi yake ya kazi inaruhusu, na data yako haishirikishwi wala kuuzwa kamwe.
- `faq.items[4].q` → Mradi unachukua muda gani?
- `faq.items[4].a` → Wiki kadhaa kwa dashibodi au ripoti moja; zaidi kwa mfumo wa idara kadhaa.

---

## contact (08)

- `contact.eyebrow` → 08 — Mawasiliano
- `contact.title` → Anza na ripoti moja.
- `contact.lead` → Tueleze unachotumia sasa na unachotaka badala yake.
- `contact.lines.whatsapp.label` → WhatsApp
- `contact.lines.whatsapp.action` → Tutumie ujumbe WhatsApp
- `contact.lines.email.label` → Barua pepe
- `contact.lines.location.label` → Mahali tulipo
- `contact.lines.location.value` → Dar es Salaam, Tanzania
- `contact.lines.location.note` → Tunafanya kazi na taasisi kote Tanzania
- `contact.next.title` → Kinachofuata
- `contact.next.steps[0]` → Tunakujibu ili kupanga mazungumzo mafupi.
- `contact.next.steps[1]` → Tunakubaliana pamoja kinachostahili kujengwa.
- `contact.next.steps[2]` → Unapokea wigo wa kazi kwa maandishi kabla kazi yoyote haijaanza.
- `contact.privacy` → Tunatumia taarifa zako kukujibu tu.
- `contact.privacyLink` → Soma taarifa yetu ya faragha

## form

- `form.label` → Fomu ya mawasiliano
- `form.optional` → si lazima
- `form.fields.name.label` → Jina
- `form.fields.name.placeholder` → Jina lako kamili
- `form.fields.phone.label` → Simu / WhatsApp
- `form.fields.phone.placeholder` → +255 7XX XXX XXX
- `form.fields.email.label` → Barua pepe
- `form.fields.email.placeholder` → jina@taasisi.co.tz
- `form.fields.company.label` → Taasisi
- `form.fields.company.placeholder` → Jina la taasisi
- `form.fields.service.legend` → Unavutiwa na
- `form.fields.service.options.dashboards` → Dashibodi na takwimu za biashara (BI)
- `form.fields.service.options.automation` → Otomatiki ya ripoti
- `form.fields.service.options.customSoftware` → Mawakala wa AI na programu maalum
- `form.fields.service.options.other` → Bado sina uhakika
- `form.fields.message.label` → Ujumbe
- `form.fields.message.placeholder` → Kwa mfano: ripoti yetu ya kila wiki ya matawi huchukua siku mbili kuandaliwa.
- `form.fields.message.counter` → Herufi {count} kati ya 4,000
- `form.honeypot` → Acha sehemu hii wazi
- `form.errors.name.required` → Tafadhali andika jina lako.
- `form.errors.name.tooShort` → Tafadhali andika angalau herufi 2.
- `form.errors.name.tooLong` → Tafadhali jina lisizidi herufi 100.
- `form.errors.email.required` → Tafadhali andika anwani yako ya barua pepe.
- `form.errors.email.invalid` → Tafadhali andika anwani sahihi ya barua pepe, kwa mfano jina@taasisi.co.tz.
- `form.errors.email.tooLong` → Tafadhali anwani ya barua pepe isizidi herufi 160.
- `form.errors.phone.invalid` → Tafadhali tumia tarakimu, nafasi, +, - au mabano pekee.
- `form.errors.phone.tooLong` → Tafadhali namba isizidi herufi 30.
- `form.errors.company.tooLong` → Tafadhali jina la taasisi lisizidi herufi 140.
- `form.errors.service.invalid` → Tafadhali chagua mojawapo ya machaguo.
- `form.errors.message.required` → Tafadhali tueleze unachohitaji.
- `form.errors.message.tooShort` → Tafadhali andika angalau herufi 10.
- `form.errors.message.tooLong` → Tafadhali ujumbe wako usizidi herufi 4,000.
- `form.submit` → Tuma ujumbe
- `form.sending` → Inatuma…
- `form.status.checkFields` → Tafadhali kagua sehemu zilizowekwa alama.
- `form.status.rateLimited` → Jumbe nyingi mno kutoka kwenye muunganisho huu. Tafadhali subiri dakika chache, au tutumie ujumbe WhatsApp.
- `form.status.invalid` → Hatukuweza kusoma ujumbe wako. Tafadhali jaribu tena.
- `form.status.server` → Ujumbe wako haukufika. Tafadhali jaribu tena, au tutumie ujumbe WhatsApp.
- `form.status.network` → Hakuna muunganisho. Kagua intaneti yako kisha ujaribu tena.
- `form.status.loading` → Inapakia… au tutumie WhatsApp kwa {number}.
- `form.status.loadingNoNumber` → Inapakia… au tuandikie kwa {email}.
- `form.success.title` → Asante.
- `form.success.body` → Ujumbe wako umetufikia, na tutakujibu.
- `form.success.again` → Tuma ujumbe mwingine
- `form.whatsappAlt` → Unapendelea WhatsApp? Tutumie ujumbe kwa {number}.
- `form.whatsappAltNoNumber` → Unapendelea barua pepe? Tuandikie kwa {email}.

## rail (mobile action rail)

- `rail.label` → Mawasiliano ya haraka
- `rail.whatsapp` → WhatsApp
- `rail.cta` → Anza mazungumzo

---

## footer

- `footer.tagline.line1Before` → Kutoka␠
- `footer.tagline.line1Accent` → Data
- `footer.tagline.line2` → hadi Maamuzi
- `footer.about` → Dashibodi, otomatiki ya ripoti na mawakala wa AI kwa taasisi za Tanzania.
- `footer.columns.services` → Huduma
- `footer.columns.company` → Kampuni
- `footer.columns.contact` → Mawasiliano
- `footer.columns.preferences` → Mipangilio
- `footer.services[0]` → Dashibodi na takwimu za biashara (BI)
- `footer.services[1]` → Otomatiki ya ripoti
- `footer.services[2]` → Mawakala wa AI
- `footer.company[0]` → Jinsi tunavyofanya kazi
- `footer.company[1]` → Usalama
- `footer.company[2]` → Timu
- `footer.company[3]` → Maswali
- `footer.company[4]` → Taarifa ya faragha
- `footer.contact.whatsapp` → WhatsApp {number}
- `footer.contact.email` → {email}
- `footer.contact.location` → Dar es Salaam, Tanzania
- `footer.legal` → © {year} DataHub · Dashibodi kwenye tovuti hii zinatumia data ya mfano.
- `footer.backToTop` → Rudi juu

---

## servicePage (chrome for /services/[slug]; body copy stays in services.ts)

- `servicePage.breadcrumbLabel` → Njia ya ukurasa
- `servicePage.home` → Mwanzo
- `servicePage.cta` → Anza mazungumzo
- `servicePage.allServices` → Tazama huduma zote
- `servicePage.signals.eyebrow` → 01 — Tatizo
- `servicePage.signals.title` → Dalili kwamba unaihitaji
- `servicePage.deliverables.eyebrow` → 02 — Matokeo
- `servicePage.deliverables.title` → Utakachopata
- `servicePage.sample.eyebrow` → 03 — Mfano
- `servicePage.sample.title` → Ione kwenye mfano
- `servicePage.sample.lead` → Chati kutoka dashibodi zetu za mfano, na uamuzi ambao kila moja inausaidia.
- `servicePage.faq.eyebrow` → 04 — Maswali
- `servicePage.faq.title` → Maswali kuhusu {service}
- `servicePage.others.eyebrow` → 05 — Huduma zaidi
- `servicePage.others.title` → Pia kutoka DataHub

---

## privacy (/privacy)

Facts only. The owner must confirm before launch; do not add a retention period, storage location or named officer unless supplied.

- `privacy.title` → Taarifa ya faragha
- `privacy.updated` → Ilisasishwa mwisho {date}
- `privacy.intro` → Kile DataHub inachokusanya kupitia tovuti hii, na kwa nini. Imeandikwa kwa kuzingatia Sheria ya Ulinzi wa Taarifa Binafsi ya Tanzania, 2022.
- `privacy.sections[0].title` → Tunachokusanya
- `privacy.sections[0].body` → Kile tu unachoandika kwenye fomu ya mawasiliano: jina lako, barua pepe, simu, taasisi, huduma unayovutiwa nayo na ujumbe wako. Ikiwa umefika kupitia mojawapo ya machapisho yetu, tunahifadhi pia lebo ya kampeni iliyo kwenye kiungo (kwa mfano “whatsapp”).
- `privacy.sections[1].title` → Tusichokusanya
- `privacy.sections[1].body` → Hakuna vidakuzi (cookies), programu za takwimu wala vifuatiliaji vya matangazo. Chaguo lako la mandhari na lugha linabaki kwenye kivinjari chako.
- `privacy.sections[2].title` → Muunganisho wako
- `privacy.sections[2].body` → Ili kuzuia barua taka za kiotomatiki, tunaweka kikomo cha jumbe ambazo muunganisho mmoja unaweza kutuma. Kwa ajili hiyo tunahifadhi anwani yako ya IP katika hali iliyofichwa (hashed), si anwani yenyewe.
- `privacy.sections[3].title` → Kwa nini tunazitumia
- `privacy.sections[3].body` → Kukujibu. Hatuuzi, hatukodishi wala hatushirikishi taarifa zako.
- `privacy.sections[4].title` → Chaguo zako
- `privacy.sections[4].body` → Ili kuona, kurekebisha au kufuta taarifa tulizo nazo kukuhusu, tuandikie {email}.
- `privacy.sections[5].title` → Mawasiliano
- `privacy.sections[5].body` → DataHub, Dar es Salaam, Tanzania. {email}

## notFound (404)

- `notFound.eyebrow` → 404
- `notFound.title` → Ukurasa huu haupo.
- `notFound.body` → Huenda kiungo ni cha zamani au kimeandikwa vibaya.
- `notFound.home` → Nenda ukurasa wa mwanzo
- `notFound.contact` → Au tuambie ulichokuwa unatafuta

---

## alt and accessible names (images and graphics)

- `alt.og` → DataHub — Kutoka Data hadi Maamuzi. Dashibodi, otomatiki ya ripoti na mawakala wa AI Tanzania.
- `alt.figurePrefix` → Chati ya mfano:

Decorative graphics (the hero silk and mark, the footer plate, the service glyphs, the WhatsApp and theme icons) are `aria-hidden` and carry no alt text. Team portraits take their alt text from `team.members.*.alt`.

---

## Notes for implementers (not rendered)

- `estimator.sentence[4]` contains the `{personWord}` slot (English has it in `sentence[6]`). The renderer must interpolate slots in every text fragment, not only in `sentence[6]`.
- `dash.units.hours` / `seconds` / `minutes` stay as compact symbols (h, s, dk) because they are appended after the number on chart axes and ticks. Prose and readouts spell the unit before the number ("saa 14", "sekunde 38").
- `dash.units.bn` / `mn` render as "2.30 bilioni" when appended; readouts already write "TZS bilioni {value}".
- `dash.views.loans.read[1].anchor` stays "90+ days" although the visible bucket reads "Siku 90+": `Loans.tsx` places the note by matching anchors against its English `AGEING_KEYS`.
- Identifier values kept in English: every `*.figure`, `*.anchor`, `*.index` and `*.number`, and the agent log's `*.status`.
- No machine translation at runtime. Kanuda and Yohana review every string before launch.
