# DataHub copy deck: Kiswahili (sw)

Source for `src/i18n/dictionaries/sw.ts`. Must have exactly the same keys as `en.ts` (a key-parity test enforces it).

Conventions:
- One line per key: `key` → value. Arrays use `[0]`, `[1]`… Objects in arrays use `[0].field`.
- `{name}` is an interpolation slot. Never concatenate translated fragments in code; use the slots.
- Typography: real apostrophes (’) and dashes (—, –) as written; the ellipsis is one character (…).
- Identifier values (`figure`, `status`, `index`, `number`, the `after` anchor) are kept as in English because code matches on them. Anchors that point at a visible label are written to match the Kiswahili label.
- Money is written "TZS bilioni 2.30"; durations are written "saa 14", "dakika 4", "sekunde 38".
- Second person is singular (wewe / yako / timu yako), as in Tanzanian business correspondence addressed to one reader.

---

## meta

- `meta.siteName` → DataHub
- `meta.titleTemplate` → %s · DataHub
- `meta.home.title` → DataHub — Uchambuzi wa Data na Dashibodi Tanzania
- `meta.home.description` → Dashibodi maalum, otomatiki ya ripoti na mawakala wa AI kwa taasisi za Tanzania. Vyote vinajengwa Dar es Salaam na timu ya DataHub.
- `meta.home.ogTitle` → DataHub — Uchambuzi wa Data na Dashibodi Tanzania
- `meta.home.ogDescription` → Dashibodi, otomatiki ya ripoti na mawakala wa AI kwa taasisi za Tanzania. Kutoka Data hadi Maamuzi.
- `meta.home.ogImageAlt` → DataHub — Kutoka Data hadi Maamuzi. Dashibodi, otomatiki ya ripoti na mawakala wa AI Tanzania.
- `meta.privacy.title` → Taarifa ya faragha
- `meta.privacy.description` → DataHub inakusanya nini kupitia tovuti hii, kwa nini, na jinsi ya kuomba taarifa zako zifutwe.
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

- `brand.name` → DataHub
- `brand.logoAlt` → DataHub
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

- `hero.eyebrow` → DataHub · Ushauri wa data · Dar es Salaam
- `hero.title.line1` → Kutoka data
- `hero.title.line2Before` → hadi␠ (the word "hadi" followed by one space)
- `hero.title.accent` → maamuzi.
- `hero.title.sub` → Dashibodi, otomatiki ya ripoti na mawakala wa AI kwa taasisi za Tanzania.
- `hero.lead` → Tunachukua takwimu zilizotawanyika kwenye mifumo, majedwali ya Excel na matawi yako, na kujenga sehemu moja ambapo timu yako hufanya maamuzi. Kwa benki, taasisi za mikopo midogo, vyombo vya habari na biashara zinazokua.
- `hero.ctaPrimary` → Anza mazungumzo
- `hero.ctaSecondary` → Tazama dashibodi za mfano
- `hero.markLabel` → Nembo ya DataHub: herufi D iliyo wazi yenye mkono ndani yake.

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
- `services.lead` → Kila moja inaanzia kwenye kazi ambayo timu yako tayari inaifanya kwa mkono.
- `services.readMore` → Soma zaidi
- `services.items.dashboards.index` → 01.1
- `services.items.dashboards.title` → Dashibodi na takwimu za biashara (BI)
- `services.items.dashboards.tagline` → Sehemu moja ya kufanyia maamuzi
- `services.items.dashboards.description` → Takwimu za sasa kutoka kwenye mifumo yako, zikipimwa dhidi ya lengo na kuchambuliwa kwa kila tawi, idara au afisa. Unaweza kuzisoma kwenye simu kabla ya kikao.
- `services.items.dashboards.glyphLabel` → Mstari unaopanda kuelekea alama ya lengo
- `services.items.automation.index` → 01.2
- `services.items.automation.title` → Otomatiki ya ripoti
- `services.items.automation.tagline` → Kazi ya saa nyingi kwa mkono, inakamilika kwa sekunde
- `services.items.automation.description` → Ripoti za kila wiki za Excel na PowerPoint ambazo timu yako huziandaa upya kwa mkono, zinatengenezwa kwa muundo uleule na kuwasilishwa kwa ratiba.
- `services.items.automation.glyphLabel` → Mistari mitatu inayoungana kuwa mmoja
- `services.items.aiAgents.index` → 01.3
- `services.items.aiAgents.title` → Mawakala wa AI
- `services.items.aiAgents.tagline` → Programu inayosoma, kuamua na kutenda
- `services.items.aiAgents.description` → Mawakala wanaofuatilia data yako, kufupisha kilichobadilika na kuandaa rasimu ya hatua inayofuata ili mtu aiidhinishe.
- `services.items.aiAgents.glyphLabel` → Nukta tatu zilizounganishwa, moja ikiwa na alama ya kuidhinishwa

Deliverable labels under each row are read from `services.ts` (`deliverables[].title`) and are not repeated here.

---

## dash (02, sample dashboards)

### Shared

- `dash.eyebrow` → 02 — Dashibodi za mfano
- `dash.title` → Tazama Jumatatu asubuhi yako inavyoweza kuwa.
- `dash.lead` → Mionekano minne ya mfano, iliyojengwa kama tunavyojenga kwa wateja. Majina na namba zote ndani yake ni za kubuni.
- `dash.notice` → Data ya mfano — hatuchapishi dashibodi za wateja
- `dash.stamp` → DATA YA MFANO
- `dash.footnote` → Data ya mfano — hatuchapishi dashibodi za wateja. Dashibodi halisi zina taarifa za watu, kwa hiyo zinabaki kwa taasisi zinazozimiliki.
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
- `dash.views.overview.figures.revenue.summary` → Mapato ya kila mwezi yalibaki chini ya lengo la TZS bilioni 2.18 kuanzia Januari hadi Agosti, na yakalivuka mwezi Septemba yakifikia TZS bilioni 2.30. Data ya mfano.
- `dash.views.overview.figures.branches.number` → 02.2
- `dash.views.overview.figures.branches.title` → Matawi, % ya lengo la mapato
- `dash.views.overview.figures.branches.axis` → % ya lengo
- `dash.views.overview.figures.branches.readout` → {branch} · {pct}% ya lengo
- `dash.views.overview.figures.branches.summary` → Kariakoo ndilo tawi pekee lililo juu ya lengo, kwa 104%. Matawi ya Dodoma (88%) na Mbeya (84%) yako chini ya 90%. Data ya mfano.
- `dash.views.overview.figures.exceptions.number` → 02.3
- `dash.views.overview.figures.exceptions.title` → Yasiyo ya kawaida
- `dash.views.overview.figures.exceptions.items[0]` → Mbeya PAR30 7.2% (kikomo 5.0%)
- `dash.views.overview.figures.exceptions.items[1]` → Dodoma PAR30 5.4% (kikomo 5.0%)
- `dash.views.overview.figures.exceptions.items[2]` → Mikopo iliyotolewa Dodoma iko 18% chini ya mpango
- `dash.views.overview.figures.exceptions.items[3]` → Ripoti ya bodi imetengenezwa saa 05:58, imetumwa kwa wapokeaji 9
- `dash.views.overview.figures.exceptions.summary` → Matawi mawili yamevuka kikomo cha PAR30, tawi moja liko nyuma ya mpango wake wa utoaji mikopo, na ripoti ya bodi ilitumwa kwa wakati. Data ya mfano.
- `dash.views.overview.changed.label` → Kilichobadilika wiki hii
- `dash.views.overview.changed.byline` → Imeandikwa na wakala wa ripoti · mfano
- `dash.views.overview.changed.items[0]` → PAR30 ya Mbeya imepanda kwa pointi 0.8 hadi 7.2%. Maafisa mikopo wawili wanachangia sehemu kubwa ya ongezeko hilo.
- `dash.views.overview.changed.items[1]` → Mikopo iliyotolewa Dodoma iko 18% chini ya mpango wa Septemba, hasa kwenye mikopo ya vikundi.
- `dash.views.overview.changed.items[2]` → Septemba, kwa mapato ya TZS bilioni 2.30, ni mwezi wa kwanza mwaka huu kuvuka lengo.
- `dash.views.overview.read[0].figure` → revenue
- `dash.views.overview.read[0].anchor` → Sep
- `dash.views.overview.read[0].shows` → Septemba ndio mwezi pekee mwaka huu uliovuka lengo la mwezi.
- `dash.views.overview.read[0].decision` → Uongozi unaona pengo la tangu mwanzo wa mwaka likipungua na kuamua kama mpango wa robo ya nne ubadilishwe, bila kusubiri ripoti ya mwisho wa mwezi.
- `dash.views.overview.read[1].figure` → branches
- `dash.views.overview.read[1].anchor` → Mbeya
- `dash.views.overview.read[1].shows` → Mbeya iko kwenye 84% ya lengo, kiwango cha chini zaidi kati ya matawi manane.
- `dash.views.overview.read[1].decision` → Mameneja wa kanda wanajua ni tawi gani wanapaswa kulitembelea kwanza.
- `dash.views.overview.read[2].figure` → exceptions
- `dash.views.overview.read[2].anchor` → 0
- `dash.views.overview.read[2].shows` → Matawi mawili yamevuka kikomo cha PAR30 cha 5%.
- `dash.views.overview.read[2].decision` → Mkuu wa Mikopo anaona ukiukaji asubuhi ileile unapotokea, si mwisho wa mwezi.

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
- `dash.views.loans.figures.par.summary` → PAR30 ilipanda kutoka 3.8% Oktoba hadi kilele cha 5.4% Julai, ikiwa juu ya kikomo cha 5% kuanzia Mei hadi Julai, na ikashuka tena hadi 4.6% Septemba. Data ya mfano.
- `dash.views.loans.figures.ageing.number` → 02.5
- `dash.views.loans.figures.ageing.title` → Umri wa madeni katika jalada
- `dash.views.loans.figures.ageing.buckets[0]` → Hayajachelewa
- `dash.views.loans.figures.ageing.buckets[1]` → Siku 1–30
- `dash.views.loans.figures.ageing.buckets[2]` → Siku 31–60
- `dash.views.loans.figures.ageing.buckets[3]` → Siku 61–90
- `dash.views.loans.figures.ageing.buckets[4]` → Siku 90+
- `dash.views.loans.figures.ageing.summary` → 91.2% ya jalada haijachelewa. Mikopo iliyochelewa zaidi ya siku 30 ni 4.6%, na 1.5% imechelewa zaidi ya siku 90. Data ya mfano.
- `dash.views.loans.figures.mix.number` → 02.6
- `dash.views.loans.figures.mix.title` → Jalada kwa aina ya mkopo
- `dash.views.loans.figures.mix.products[0]` → Mikopo ya vikundi
- `dash.views.loans.figures.mix.products[1]` → Biashara ndogo na za kati
- `dash.views.loans.figures.mix.products[2]` → Mishahara
- `dash.views.loans.figures.mix.products[3]` → Kilimo
- `dash.views.loans.figures.mix.summary` → Mikopo ya vikundi ndiyo bidhaa kubwa zaidi, TZS bilioni 21.8 kati ya TZS bilioni 64.2, ikifuatiwa na mikopo ya biashara ndogo na za kati, ya mishahara na ya kilimo. Data ya mfano.
- `dash.views.loans.figures.flows.number` → 02.7
- `dash.views.loans.figures.flows.title` → Mikopo iliyotolewa na marejesho, Aprili hadi Septemba
- `dash.views.loans.figures.flows.axis` → TZS bilioni
- `dash.views.loans.figures.flows.seriesDisbursed` → Mikopo iliyotolewa
- `dash.views.loans.figures.flows.seriesRepaid` → Marejesho
- `dash.views.loans.figures.flows.readout` → {month} · mikopo iliyotolewa TZS bilioni {a} · marejesho TZS bilioni {b}
- `dash.views.loans.figures.flows.summary` → Mikopo iliyotolewa ilikuwa kati ya TZS bilioni 5.2 na 5.9 kwa mwezi. Marejesho yalizidi mikopo iliyotolewa mwezi Julai na Agosti. Data ya mfano.
- `dash.views.loans.officers.title` → Maafisa mikopo
- `dash.views.loans.officers.caption` → Maafisa wanaonyeshwa kwa namba ya utambulisho pekee. Data ya mfano.
- `dash.views.loans.officers.columns.code` → Afisa
- `dash.views.loans.officers.columns.branch` → Tawi
- `dash.views.loans.officers.columns.portfolio` → Jalada
- `dash.views.loans.officers.columns.par` → PAR30
- `dash.views.loans.officers.columns.trend` → Miezi 12
- `dash.views.loans.read[0].figure` → par
- `dash.views.loans.read[0].anchor` → Jul
- `dash.views.loans.read[0].shows` → PAR30 ilivuka kikomo cha 5% mwezi Mei na kufikia kilele cha 5.4% Julai.
- `dash.views.loans.read[0].decision` → Kuvuka kikomo kunaripotiwa siku ileile kunapotokea, kwa hiyo kazi ya makusanyo inaanza kabla ya kufunga hesabu za mwezi.
- `dash.views.loans.read[1].figure` → ageing
- `dash.views.loans.read[1].anchor` → Siku 90+
- `dash.views.loans.read[1].shows` → 1.5% ya jalada imechelewa zaidi ya siku 90.
- `dash.views.loans.read[1].decision` → Idara za fedha na mikopo zinajadili tengo la hasara kwa kutumia namba ileile.
- `dash.views.loans.read[2].figure` → officers
- `dash.views.loans.read[2].anchor` → LO-047
- `dash.views.loans.read[2].shows` → Maafisa wawili wamevuka kikomo, katika matawi yaleyale yaliyoonyeshwa kwenye muhtasari.
- `dash.views.loans.read[2].decision` → Ufuatiliaji unaelekezwa kwenye majalada mahususi badala ya tawi zima.
- `dash.views.loans.read[3].figure` → flows
- `dash.views.loans.read[3].anchor` → Jul
- `dash.views.loans.read[3].shows` → Mwezi Julai, marejesho yalizidi mikopo iliyotolewa kwa mara ya kwanza katika kipindi kinachoonyeshwa.
- `dash.views.loans.read[3].decision` → Idara ya hazina inapanga fedha kwa kufuata mwenendo badala ya makadirio ya mwezi uliopita.

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
- `dash.views.sales.kpis[1].context` → Yaliyoagiza angalau mara moja katika robo ya 3
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
- `dash.views.sales.figures.map.summary` → Dar es Salaam ina mauzo makubwa zaidi. Dodoma, Mwanza na Arusha zilikua kwa kasi zaidi. Ramani inaonyesha ardhi pekee, bila kuchora mipaka. Data ya mfano.
- `dash.views.sales.figures.ranked.number` → 02.9
- `dash.views.sales.figures.ranked.title` → Mikoa kwa mpangilio wa mauzo
- `dash.views.sales.figures.ranked.columns.region` → Mkoa
- `dash.views.sales.figures.ranked.columns.sales` → Mauzo
- `dash.views.sales.figures.ranked.columns.share` → Sehemu
- `dash.views.sales.figures.ranked.columns.growth` → Ukuaji
- `dash.views.sales.figures.ranked.other` → Mikoa mingine
- `dash.views.sales.figures.ranked.readout` → {region} · TZS bilioni {value} · {share}% ya mauzo · ukuaji {growth}%
- `dash.views.sales.figures.ranked.summary` → Dar es Salaam ni 30.6% ya mauzo na ilikua kwa 8%. Dodoma ilikua kwa kasi zaidi, 21%; Tanga ilikua polepole zaidi, 4%. Data ya mfano.
- `dash.views.sales.read[0].figure` → map
- `dash.views.sales.read[0].anchor` → Dodoma
- `dash.views.sales.read[0].shows` → Dodoma ilikua kwa kasi zaidi, 21% ukilinganisha na robo hiyohiyo mwaka jana.
- `dash.views.sales.read[0].decision` → Uongozi wa mauzo unaweza kujaribu kuelekeza bidhaa na wauzaji wanaotembelea maduka kwenye ukanda wa kati.
- `dash.views.sales.read[1].figure` → ranked
- `dash.views.sales.read[1].anchor` → Dar es Salaam
- `dash.views.sales.read[1].shows` → Dar es Salaam ni karibu theluthi moja ya mauzo lakini ilikua kwa 8%, chini ya wastani wa jumla wa 11.3%.
- `dash.views.sales.read[1].decision` → Mkoa mkubwa zaidi ndio wa kufuatilia kwa hisa ya soko, si kwa wingi wa mauzo.
- `dash.views.sales.read[2].figure` → ranked
- `dash.views.sales.read[2].anchor` → Tanga
- `dash.views.sales.read[2].shows` → Tanga ilikua kwa 4%, mkoa uliokua polepole zaidi.
- `dash.views.sales.read[2].decision` → Kagua ufikiaji wa maduka huko kabla malengo ya robo ijayo hayajawekwa.

### View 4: operations

- `dash.views.operations.index` → 02.4
- `dash.views.operations.tab` → Otomatiki na uendeshaji
- `dash.views.operations.tabDescription` → Ripoti zinazojiendesha zenyewe, na kile wakala alichofanya.
- `dash.views.operations.entity` → Mfumo wa ripoti wa mkopeshaji wa mfano
- `dash.views.operations.period` → Septemba 2026 · ratiba ya Jumatatu ya mfano
- `dash.views.operations.creditPeriod` → Sep 2026
- `dash.views.operations.kpis[0].label` → Ripoti zilizowasilishwa kiotomatiki
- `dash.views.operations.kpis[0].context` → Mwezi Septemba
- `dash.views.operations.kpis[1].label` → Muda wa kati (median) wa kutengeneza ripoti
- `dash.views.operations.kpis[1].context` → Mizunguko 14 ya mwisho
- `dash.views.operations.kpis[2].label` → Saa za wafanyakazi zilizookolewa
- `dash.views.operations.kpis[2].context` → Makadirio, ukilinganisha na kuandaa kwa mkono
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
- `dash.views.operations.figures.schedule.summary` → Kazi tano zilizopangwa zinaendeshwa kati ya 05:30 na 18:30, zikianza na ripoti ya PAR ya kila siku kabla matawi hayajafunguliwa. Data ya mfano.
- `dash.views.operations.figures.runs.number` → 02.11
- `dash.views.operations.figures.runs.title` → Muda wa kutengeneza, mizunguko 14 ya mwisho
- `dash.views.operations.figures.runs.axis` → sekunde
- `dash.views.operations.figures.runs.readout` → Mzunguko {n} · sekunde {value}
- `dash.views.operations.figures.runs.slowLabel` → Mzunguko wa polepole
- `dash.views.operations.figures.runs.summary` → Mizunguko ilichukua sekunde 35 hadi 41, isipokuwa mzunguko wa 7 uliochukua sekunde 61. Muda wa kati ni sekunde 38. Data ya mfano.
- `dash.views.operations.figures.pack.number` → 02.12
- `dash.views.operations.figures.pack.title` → Ripoti ya menejimenti ya kila mwezi
- `dash.views.operations.figures.pack.before` → Kwa mkono
- `dash.views.operations.figures.pack.after` → Kiotomatiki
- `dash.views.operations.figures.pack.beforeValue` → saa 14
- `dash.views.operations.figures.pack.afterValue` → dakika 4
- `dash.views.operations.figures.pack.summary` → Ripoti ya menejimenti ya kila mwezi ilichukua saa 14 kuandaliwa kwa mkono na sasa inachukua dakika 4. Data ya mfano.
- `dash.views.operations.log.title` → Kumbukumbu za wakala
- `dash.views.operations.log.caption` → Wakala anaandaa rasimu. Mtu anaidhinisha chochote kinachotoka nje ya taasisi. Data ya mfano.
- `dash.views.operations.log.items[0].time` → 05:30
- `dash.views.operations.log.items[0].text` → Ripoti ya PAR ya kila siku imetengenezwa na kutumwa kwa mameneja 14 wa matawi.
- `dash.views.operations.log.items[0].status` → sent
- `dash.views.operations.log.items[1].time` → 05:58
- `dash.views.operations.log.items[1].text` → Ripoti ya bodi ya Jumatatu imetengenezwa na kutumwa kwa wapokeaji 9.
- `dash.views.operations.log.items[1].status` → sent
- `dash.views.operations.log.items[2].time` → 07:02
- `dash.views.operations.log.items[2].text` → PAR30 imevuka kikomo cha 5.0% katika matawi 2: Mbeya 7.2%, Dodoma 5.4%. Rasimu ya ujumbe wa ufuatiliaji imeandaliwa kwa ajili ya Mkuu wa Mikopo.
- `dash.views.operations.log.items[2].status` → awaiting
- `dash.views.operations.log.items[3].time` → 07:09
- `dash.views.operations.log.items[3].text` → Ujumbe umeidhinishwa na Mkuu wa Mikopo na kutumwa kwa mameneja wa matawi yote mawili.
- `dash.views.operations.log.items[3].status` → sent
- `dash.views.operations.log.items[4].time` → 07:15
- `dash.views.operations.log.items[4].text` → Rasimu za jumbe 41 za ukumbusho kwa wakopaji wenye malimbikizo zimeandaliwa, zikisubiri kukaguliwa na maafisa mikopo.
- `dash.views.operations.log.items[4].status` → queued
- `dash.views.operations.read[0].figure` → schedule
- `dash.views.operations.read[0].anchor` → 05:30
- `dash.views.operations.read[0].shows` → Ripoti ya PAR ya kila siku inawafikia mameneja 14 wa matawi saa 05:30, kabla matawi hayajafunguliwa.
- `dash.views.operations.read[0].decision` → Mameneja wanaanza siku wakiwa na namba za jana badala ya kuziomba.
- `dash.views.operations.read[1].figure` → runs
- `dash.views.operations.read[1].anchor` → 7
- `dash.views.operations.read[1].shows` → Mzunguko mmoja ulichukua sekunde 61, wakati muda wa kati ni sekunde 38.
- `dash.views.operations.read[1].decision` → Mzunguko wa polepole unaonekana kabla haujageuka kuwa ripoti iliyochelewa.
- `dash.views.operations.read[2].figure` → log
- `dash.views.operations.read[2].anchor` → 07:02
- `dash.views.operations.read[2].shows` → Wakala aligundua ukiukaji na kuandaa rasimu ya ujumbe. Mtu aliuidhinisha dakika saba baadaye.
- `dash.views.operations.read[2].decision` → Wewe ndiye unayechagua hatua zipi zibaki mikononi mwa mtu.
- `dash.views.operations.read[3].figure` → pack
- `dash.views.operations.read[3].anchor` → after
- `dash.views.operations.read[3].shows` → Muda wa kuandaa ripoti ya kila mwezi ulishuka kutoka saa 14 kwa mkono hadi dakika 4.
- `dash.views.operations.read[3].decision` → Muda wa mchambuzi unatumika kufafanua namba, si kuzinakili.

---

## estimator (03, advanced feature B)

Word order differs from English: Kiswahili puts the noun before the number ("ripoti 3", "watu 2", "saa 4"). The slot order of `sentence[]` is unchanged; `{personWord}` moves into `sentence[4]` so it lands before `{people}`.

- `estimator.eyebrow` → 03 — Hesabu zako
- `estimator.title` → Saa za kazi zinakwenda wapi?
- `estimator.lead` → Weka namba zako za ripoti moja, uone inavyoigharimu timu yako leo.
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
- `estimator.salary.help` → Inaongeza makadirio ya gharama kwa shilingi. Taarifa hii inabaki kwenye kifaa chako.
- `estimator.result.label` → Makadirio yako
- `estimator.result.hours` → ≈ saa {hours} kwa mwaka
- `estimator.result.days` → siku {days} za kazi
- `estimator.result.cost` → ≈ TZS {amount} kwa mwaka, gharama ya muda wa wafanyakazi
- `estimator.formula.hours` → ripoti {count} × {periodUnit} {periods} × {personWord} {people} × saa {hours} = saa {total} kwa mwaka · saa 8 = siku 1 ya kazi
- `estimator.formula.cost` → TZS {salary} ÷ saa 176 kwa mwezi = TZS {hourly} kwa saa
- `estimator.formula.assumptions` → Tunachukulia siku 240 za kazi, wiki 48 za kazi au miezi 12 kwa mwaka.
- `estimator.note` → Namba zako, makadirio yako. Hii si nukuu ya bei, na hakuna kinachotumwa isipokuwa ukichagua kutuma ujumbe.
- `estimator.addToMessage` → Ongeza hii kwenye ujumbe wangu
- `estimator.added` → Imeongezwa kwenye ujumbe wako. Jaza jina lako ili kuutuma.
- `estimator.messageTemplate` → Tunaandaa ripoti {count} kila {period}. Kila moja inaandaliwa na {personWord} {people} kwa takriban saa {hours}, yaani takriban saa {hoursPerYear} kwa mwaka.
- `estimator.error.range` → Tumia namba kati ya {min} na {max}.

---

## process (04)

- `process.eyebrow` → 04 — Tunavyofanya kazi
- `process.title` → Jinsi mradi unavyoendeshwa.
- `process.lead` → Mfumo tunaoujenga unategemea taasisi yako. Njia ya kufika huko inabaki ileile.
- `process.receivePrefix` → Unapokea:
- `process.steps[0].index` → 04.1
- `process.steps[0].title` → Kuchunguza
- `process.steps[0].description` → Tunakaa na timu yako kuelewa mtiririko halisi wa kazi: ripoti unazozitegemea, takwimu muhimu, na mahali kazi ya mkono ilipo.
- `process.steps[0].receive` → orodha ya ripoti na takwimu muhimu, na tathmini ya wazi kama mfumo unastahili kujengwa.
- `process.steps[1].index` → 04.2
- `process.steps[1].title` → Kusanifu
- `process.steps[1].description` → Tunapanga dashibodi, otomatiki na mtiririko wa data kulingana na jinsi taasisi yako tayari inavyofanya kazi.
- `process.steps[1].receive` → mpango tuliokubaliana nawe kabla chochote hakijajengwa.
- `process.steps[2].index` → 04.3
- `process.steps[2].title` → Kujenga
- `process.steps[2].description` → Tunaandika msimbo salama na kuwasilisha mfumo unaofanya kazi: dashibodi, ripoti za kupakua na uwasilishaji kwa ratiba, vyote vikiendana na miundo yako iliyopo.
- `process.steps[2].receive` → mfumo unaofanya kazi, unaowasilishwa kwa awamu.
- `process.steps[3].index` → 04.4
- `process.steps[3].title` → Kusaidia
- `process.steps[3].description` → Tunaifundisha timu yako na kuendelea kuboresha mfumo kadri unavyoongeza ripoti, vyanzo vya data na malengo.
- `process.steps[3].receive` → mafunzo, na mabadiliko kadri mahitaji yako yanavyokua.
- `process.closing` → Kitu chenye manufaa kinaifikia timu yako mapema. Tunawasilisha kwa awamu, si kila kitu mwishoni.

---

## security (05)

- `security.eyebrow` → 05 — Kwa nini DataHub
- `security.title` → Kutoka kazi ya mkono iliyotawanyika hadi mfumo wa kiotomatiki ulio wazi.
- `security.lead` → Tunabadilisha kazi ya mkono ya polepole na yenye makosa kwa mfumo mmoja, ili timu yako itumie muda wake kwenye maamuzi, si kwenye majedwali ya Excel.
- `security.ledger.todayHeading` → Leo
- `security.ledger.withHeading` → Ukiwa na DataHub
- `security.ledger.rows[0].today` → Ripoti huchukua saa au siku kuandaliwa
- `security.ledger.rows[0].with` → Ripoti zinatengenezwa kwa sekunde
- `security.ledger.rows[1].today` → Watu tofauti wanapata namba tofauti
- `security.ledger.rows[1].with` → Hesabu moja, jibu moja kwa wote
- `security.ledger.rows[2].today` → Mafaili yametawanyika kwenye barua pepe na folda
- `security.ledger.rows[2].with` → Kila kitu sehemu moja, kwenye kivinjari chochote
- `security.ledger.rows[3].today` → Ripoti hupangwa na kutumwa kwa barua pepe kwa mkono
- `security.ledger.rows[3].with` → Ripoti zilizopangwa tayari zinawasilishwa kwa ratiba
- `security.ledger.rows[4].today` → Hakuna picha ya sasa ya utendaji
- `security.ledger.rows[4].with` → Takwimu za sasa kwa uongozi kwa mtazamo mmoja
- `security.data.title` → Data yako inabaki kuwa yako.
- `security.data.body` → Usalama unajengwa tangu mstari wa kwanza wa msimbo, si kuongezwa mwishoni. Kila mfumo tunaoujenga unafuata kanuni hizi.
- `security.data.items[0].term` → Ufikiaji kwa nafasi ya kazi
- `security.data.items[0].definition` → Kila mtu anaona tu kile ambacho nafasi yake ya kazi inaruhusu.
- `security.data.items[1].term` → Taarifa za kuingia zilizosimbwa
- `security.data.items[1].definition` → Nywila na siri za kuunganisha mifumo zinahifadhiwa zikiwa zimesimbwa, na kamwe hazihifadhiwi kama maandishi ya wazi.
- `security.data.items[2].term` → Maingizo yanayohakikiwa
- `security.data.items[2].definition` → Kila kinachoingia kwenye mfumo kinakaguliwa kwenye seva kabla hakijatumika.
- `security.data.items[3].term` → Miingiliano iliyoimarishwa
- `security.data.items[3].definition` → Miingiliano inakubali tu kile inachohitaji na kukataa kila kitu kingine.
- `security.data.items[4].term` → Mawakala wenye mipaka
- `security.data.items[4].definition` → Wakala wa AI hapati ufikiaji zaidi ya mtu anayemfanyia kazi. Chochote chenye athari kubwa kinaandaliwa kama rasimu ili mtu akiidhinishe.
- `security.data.items[5].term` → Haishirikishwi kamwe
- `security.data.items[5].definition` → Data yako haishirikishwi wala kuuzwa, na dashibodi za wateja hazichapishwi kamwe. Ndiyo sababu kila dashibodi kwenye tovuti hii inatumia data ya mfano.
- `security.proof.title` → Ushahidi kwenye ukurasa huu
- `security.proof.lead` → Unaweza kuhakiki mwenyewe madai haya kuhusu tovuti hii.
- `security.proof.lines[0]` → Skripti: zetu pekee. Kila ukurasa unatumwa pamoja na sera ya usalama yenye msimbo mpya kwa kila ziara, kwa hiyo skripti iliyopachikwa na mtu mwingine haiendeshwi.
- `security.proof.lines[1]` → Vifuatiliaji na programu za takwimu za makampuni mengine: hakuna.
- `security.proof.lines[2]` → Fonti na picha: zinatolewa kutoka datahub.co.tz, si kutoka kwenye seva za makampuni mengine.
- `security.proof.lines[3]` → Vidakuzi (cookies): hakuna. Chaguo zako za mandhari na lugha zinahifadhiwa kwenye kivinjari chako pekee.
- `security.proof.lines[4]` → Fomu ya mawasiliano: inakaguliwa kwenye seva yetu, inaruhusu jumbe chache tu kwa kila anwani ya mtandao (IP), na inachuja barua taka za kiotomatiki.
- `security.proof.showPolicy` → Onyesha sera kamili
- `security.proof.policyNote` → Kichwa cha Content-Security-Policy kilichotumwa pamoja na ukurasa huu. Msimbo unaobadilika kila ziara umefichwa.
- `security.proof.check` → Kagua mwenyewe vichwa vyetu vya usalama

---

## team (06)

- `team.eyebrow` → 06 — Timu
- `team.title` → Watu utakaofanya nao kazi.
- `team.lead` → Sisi ni timu ndogo, kwa hiyo watu unaokutana nao ndio wanaojenga na kuendesha mradi wako.
- `team.members.cto.index` → 06.1
- `team.members.cto.name` → Daniel C. Masubi
- `team.members.cto.role` → Afisa Mkuu wa Teknolojia
- `team.members.cto.bio` → Anasanifu na kujenga mifumo: mitiririko ya data, dashibodi, otomatiki ya ripoti na mawakala. Anawajibika kwa usalama wa data yako, kwa hiyo maswali yako ya kiufundi yanakwenda kwa mtu anayejenga mfumo wenyewe.
- `team.members.cto.alt` → Daniel C. Masubi, Afisa Mkuu wa Teknolojia, DataHub
- `team.members.operations.index` → 06.2
- `team.members.operations.name` → Kanuda L. Sasi
- `team.members.operations.role` → Mkuu wa Uendeshaji
- `team.members.operations.bio` → Anasimamia utekelezaji: wigo wa kazi, ratiba, mafunzo kwa timu yako na msaada baada ya mfumo kuzinduliwa. Anahakikisha kile kilichokubaliwa ndicho kinachowasilishwa.
- `team.members.operations.alt` → Kanuda L. Sasi, Mkuu wa Uendeshaji, DataHub
- `team.members.marketing.index` → 06.3
- `team.members.marketing.name` → Yohana K. Mussa
- `team.members.marketing.role` → Mkuu wa Masoko
- `team.members.marketing.bio` → Mara nyingi ndiye mtu wa kwanza kutoka DataHub utakayezungumza naye. Anahakikisha wigo wa kazi tunaopanga unalenga tatizo lile ulilolieleza, anakuonyesha dashibodi za mfano, na anakujulisha maendeleo kadri kazi inavyosonga.
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
- `faq.items[0].a` → DataHub inajenga dashibodi maalum, mifumo ya ripoti za kiotomatiki na mawakala wa AI kwa taasisi za Tanzania. Tunachukua takwimu ambazo tayari zimetawanyika kwenye majedwali ya Excel, mifumo na matawi yako, na kuziweka sehemu moja ambapo timu yako inaweza kufanya maamuzi.
- `faq.items[1].q` → Mko wapi, na mnafanya kazi nje ya Dar es Salaam?
- `faq.items[1].a` → Tupo Dar es Salaam, Tanzania, na tunafanya kazi na taasisi kote nchini na nje ya nchi. Sehemu kubwa ya kazi inafanyika kwa mbali, na tunafika ofisini kwako pale ambapo kupanga wigo wa kazi au mafunzo kunahitaji hivyo.
- `faq.items[2].q` → Mnaweza kuweka mfumo wa kiotomatiki kwa ripoti tunazoandaa sasa kwa Excel?
- `faq.items[2].a` → Ndiyo. Hapo ndipo tunapoanzia mara nyingi. Ikiwa timu yako inatumia saa nyingi kila wiki kunakili kati ya majedwali, kupanga muundo na kutuma ripoti ileile kwa barua pepe, mchakato huo wote kwa kawaida unaweza kubadilishwa na mfumo unaoitengeneza kwa sekunde na kuiwasilisha kiotomatiki.
- `faq.items[3].q` → Dashibodi au mfumo wa ripoti unagharimu kiasi gani?
- `faq.items[3].a` → Inategemea unachohitaji, na yeyote anayetaja bei kabla ya kuelewa mtiririko wako wa kazi anabahatisha. Tuambie ni ripoti au mchakato gani unaogharimu timu yako muda mwingi zaidi, nasi tutapanga wigo wake pamoja nawe. Mazungumzo ya kwanza ni bure, na kama haistahili kujengwa tutakuambia.
- `faq.items[4].q` → Mnatumia zana kama Power BI, au mnajenga mifumo maalum?
- `faq.items[4].a` → Vyote viwili, kulingana na tatizo. Zana za takwimu za biashara zilizo tayari sokoni zinafaa pale data yako tayari iko safi na maswali ni ya kawaida. Pale mtiririko wako wa kazi, mnyororo wa idhini au miundo ya ripoti ni mahususi kwa jinsi taasisi yako inavyoendeshwa, mfumo maalum unafaa zaidi na una gharama ndogo zaidi kuuendesha kwa muda mrefu.
- `faq.items[5].q` → Je, data yetu iko salama?
- `faq.items[5].a` → Usalama unajengwa ndani tangu mwanzo, si kuongezwa baadaye. Mifumo inajengwa na taarifa za kuingia zilizosimbwa, ufikiaji kwa nafasi ya kazi ili kila mtu aone tu kile ambacho nafasi yake inaruhusu, maingizo yanayohakikiwa na miingiliano iliyoimarishwa. Data yako inabaki kuwa yako. Haishirikishwi wala kuuzwa kamwe.
- `faq.items[6].q` → Mradi unachukua muda gani?
- `faq.items[6].a` → Dashibodi moja mahususi au ripoti moja ya kiotomatiki kwa kawaida huchukua wiki kadhaa. Mfumo kamili wa ripoti unaohusisha idara kadhaa unachukua muda mrefu zaidi. Tunapanga kwa awamu ili kitu chenye manufaa kiifikie timu yako mapema badala ya mwishoni kabisa.
- `faq.items[7].q` → Mnajenga pia mawakala wa AI?
- `faq.items[7].a` → Ndiyo. Zaidi ya dashibodi, tunasanifu mawakala wanaosoma data ya uendeshaji wako, kufupisha kilichobadilika, na kuchukua hatua: kufuatilia mambo yanayosubiri, kuonyesha yasiyo ya kawaida, au kuandaa rasimu za ripoti ambazo mtu anaziandika kwa mkono sasa. Chochote chenye athari kubwa kinaandaliwa kama rasimu ili mtu akiidhinishe.

---

## contact (08)

- `contact.eyebrow` → 08 — Mawasiliano
- `contact.title` → Tuambie ni ripoti gani inayokugharimu muda mwingi zaidi.
- `contact.lead` → Tueleze unachotumia sasa na ungependa kuona nini. Tutapanga wigo wa kazi pamoja nawe. Mazungumzo ya kwanza ni bure, na kama haistahili kujengwa tutakuambia.
- `contact.lines.whatsapp.label` → WhatsApp
- `contact.lines.whatsapp.action` → Tutumie ujumbe WhatsApp
- `contact.lines.email.label` → Barua pepe
- `contact.lines.location.label` → Mahali tulipo
- `contact.lines.location.value` → Dar es Salaam, Tanzania
- `contact.lines.location.note` → Tunafanya kazi na taasisi kote Tanzania
- `contact.next.title` → Kinachofuata
- `contact.next.steps[0]` → Tunasoma ujumbe wako na kukujibu ili kupanga mazungumzo mafupi.
- `contact.next.steps[1]` → Tunaangalia ripoti au mchakato pamoja nawe na kukubaliana kinachostahili kujengwa.
- `contact.next.steps[2]` → Unapokea wigo wa kazi kwa maandishi kabla kazi yoyote haijaanza.
- `contact.privacy` → Tunatumia taarifa zako kwa ajili ya kujibu ombi lako tu.
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
- `form.fields.message.placeholder` → Ni ripoti au mchakato gani unaochukua muda mwingi wa timu yako? Ungependa kuona nini badala yake?
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
- `form.errors.message.tooShort` → Tafadhali andika angalau herufi 10 ili tuelewe unachohitaji.
- `form.errors.message.tooLong` → Tafadhali ujumbe wako usizidi herufi 4,000.
- `form.submit` → Tuma ujumbe
- `form.sending` → Inatuma…
- `form.status.checkFields` → Tafadhali kagua sehemu zilizowekwa alama.
- `form.status.rateLimited` → Jumbe nyingi mno kutoka kwenye muunganisho huu. Tafadhali subiri dakika chache kisha ujaribu tena, au tutumie ujumbe WhatsApp.
- `form.status.invalid` → Hatukuweza kusoma ujumbe wako. Tafadhali jaribu tena.
- `form.status.server` → Ujumbe wako haukufika. Tafadhali jaribu tena, au tutumie ujumbe WhatsApp.
- `form.status.network` → Hakuna muunganisho. Kagua intaneti yako kisha ujaribu tena.
- `form.success.title` → Asante.
- `form.success.body` → Ujumbe wako umetufikia. Tutakujibu ili tuzungumze kuhusu unachohitaji.
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
- `footer.about` → Dashibodi, otomatiki ya ripoti na mawakala wa AI kwa taasisi za Tanzania. Tupo Dar es Salaam.
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
- `footer.legal` → © {year} DataHub · Dar es Salaam, Tanzania · Dashibodi kwenye tovuti hii zinatumia data ya mfano.
- `footer.backToTop` → Rudi juu

---

## servicePage (chrome for /services/[slug]; body copy stays in services.ts)

- `servicePage.breadcrumbLabel` → Njia ya ukurasa
- `servicePage.home` → Mwanzo
- `servicePage.cta` → Anza mazungumzo
- `servicePage.allServices` → Tazama huduma zote
- `servicePage.signals.eyebrow` → 01 — Je, unaihitaji?
- `servicePage.signals.title` → Dalili kwamba unahitaji huduma hii
- `servicePage.deliverables.eyebrow` → 02 — Utakachopata
- `servicePage.deliverables.title` → Utakachopata
- `servicePage.sample.eyebrow` → 03 — Ione kwenye mfano
- `servicePage.sample.title` → Ione kwenye mfano
- `servicePage.sample.lead` → Takwimu za mfano, zilizoandaliwa kama tunavyoandaa kwa wateja. Majina na namba zote ni za kubuni.
- `servicePage.faq.eyebrow` → 04 — Maswali
- `servicePage.faq.title` → Maswali kuhusu {service}
- `servicePage.others.eyebrow` → 05 — Pia kutoka DataHub
- `servicePage.others.title` → Pia kutoka DataHub
- `servicePage.englishOnly` → Ukurasa huu uko kwa Kiingereza wakati toleo la Kiswahili linaandaliwa.

---

## privacy (/privacy)

Facts only. The owner must confirm before launch; do not add a retention period, storage location or named officer unless supplied.

- `privacy.title` → Taarifa ya faragha
- `privacy.updated` → Ilisasishwa mwisho {date}
- `privacy.intro` → Taarifa hii inaeleza kile DataHub inachokusanya kupitia tovuti hii na tunachokifanya nacho. Imeandikwa kwa kuzingatia Sheria ya Ulinzi wa Taarifa Binafsi ya Tanzania, 2022.
- `privacy.sections[0].title` → Tunachokusanya
- `privacy.sections[0].body` → Kile tu unachoandika kwenye fomu ya mawasiliano: jina lako, anwani ya barua pepe, namba ya simu, taasisi, huduma unayovutiwa nayo na ujumbe wako. Ikiwa umefika kupitia mojawapo ya machapisho yetu, tunahifadhi pia lebo fupi ya kampeni iliyo kwenye kiungo (kwa mfano “whatsapp”) ili tujue ni njia gani ilikufikia.
- `privacy.sections[1].title` → Tusichokusanya
- `privacy.sections[1].body` → Tovuti hii haiweki vidakuzi (cookies) na haiendeshi programu za takwimu wala vifuatiliaji vya matangazo. Chaguo lako la mandhari na lugha linahifadhiwa kwenye kivinjari chako, halitumwi kwetu.
- `privacy.sections[2].title` → Muunganisho wako
- `privacy.sections[2].body` → Ili kuzuia barua taka za kiotomatiki, tunaweka kikomo cha jumbe ambazo muunganisho mmoja unaweza kutuma. Kwa ajili hiyo tunahifadhi anwani yako ya IP katika hali iliyofichwa (hashed), si anwani yenyewe.
- `privacy.sections[3].title` → Kwa nini tunazitumia
- `privacy.sections[3].body` → Kujibu ombi lako na kuendeleza mazungumzo uliyoyaanzisha. Hatuuzi, hatukodishi wala hatushirikishi taarifa zako na mtu mwingine yeyote.
- `privacy.sections[4].title` → Chaguo zako
- `privacy.sections[4].body` → Unaweza kutuuliza tunashikilia taarifa gani kukuhusu, kutuomba tuzirekebishe, au kutuomba tuzifute, kwa kutuandikia {email}.
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
- `alt.heroSilk` → (decorative, `aria-hidden`, no alt)
- `alt.heroMark` → (decorative inside the hero; the H1 carries the meaning)
- `alt.footerPlate` → (decorative, `aria-hidden`)
- `alt.teamCto` → Daniel C. Masubi, Afisa Mkuu wa Teknolojia, DataHub
- `alt.teamOperations` → Kanuda L. Sasi, Mkuu wa Uendeshaji, DataHub
- `alt.teamMarketing` → Yohana K. Mussa, Mkuu wa Masoko, DataHub
- `alt.serviceGlyphs` → (decorative; the row title names the service)
- `alt.figurePrefix` → Chati ya mfano:
- `alt.whatsappIcon` → (decorative; the visible word "WhatsApp" names the link)
- `alt.themeIcon` → (decorative; the button’s aria-label names the action)

---

## Notes for implementers (not rendered)

- `estimator.sentence[4]` contains the `{personWord}` slot (English has it in `sentence[6]`). The renderer must interpolate slots in every text fragment, not only in `sentence[6]`.
- `dash.units.hours` / `seconds` / `minutes` stay as compact symbols (h, s, dk) because they are appended after the number on chart axes and ticks. Prose and readouts spell the unit before the number ("saa 14", "sekunde 38").
- `dash.units.bn` / `mn` render as "2.30 bilioni" when appended; readouts already write "TZS bilioni {value}".
- `dash.views.loans.read[1].anchor` is "Siku 90+" to match `ageing.buckets[4]`. If anchors are matched against English labels or ids instead, revert it to "90+ days".
- Identifier values kept in English: all `*.figure`, `*.status` in the agent log, and `dash.views.operations.read[3].anchor` ("after").
- No machine translation at runtime. Kanuda and Yohana review every string before launch.
