import "server-only";
import type { Dictionary } from "../get-dictionary";

/**
 * Kiswahili dictionary. Generated from the reviewed Kiswahili copy deck
 * (copy.sw.md). Typed against the English dictionary, so a missing or extra
 * key fails the build.
 */
const sw = {
  "meta": {
    "siteName": "DataHub",
    "titleTemplate": "%s · DataHub",
    "home": {
      "title": "DataHub — Uchambuzi wa Data na Dashibodi Tanzania",
      "description": "Dashibodi maalum, otomatiki ya ripoti na mawakala wa AI kwa taasisi za Tanzania. Vyote vinajengwa Dar es Salaam na timu ya DataHub.",
      "ogTitle": "DataHub — Uchambuzi wa Data na Dashibodi Tanzania",
      "ogDescription": "Dashibodi, otomatiki ya ripoti na mawakala wa AI kwa taasisi za Tanzania. Kutoka Data hadi Maamuzi.",
      "ogImageAlt": "DataHub — Kutoka Data hadi Maamuzi. Dashibodi, otomatiki ya ripoti na mawakala wa AI Tanzania."
    },
    "privacy": {
      "title": "Taarifa ya faragha",
      "description": "DataHub inakusanya nini kupitia tovuti hii, kwa nini, na jinsi ya kuomba taarifa zako zifutwe."
    },
    "notFound": {
      "title": "Ukurasa haupatikani"
    },
    "keywords": [
      "uchambuzi wa data Tanzania",
      "dashibodi za biashara",
      "otomatiki ya ripoti",
      "takwimu za biashara",
      "mawakala wa AI",
      "mtengenezaji wa dashibodi Dar es Salaam",
      "programu maalum Tanzania"
    ]
  },
  "a11y": {
    "skip": "Ruka hadi maudhui",
    "opensNewTab": "(inafunguka kwenye kichupo kipya)",
    "external": "kiungo cha nje",
    "sampleFigure": "Chati ya mfano. Takwimu zote ni za kubuni.",
    "chartKeys": "Tumia vitufe vya mishale ya kushoto na kulia kusogea kwenye data.",
    "today": "Leo:",
    "withDataHub": "Ukiwa na DataHub:"
  },
  "brand": {
    "name": "DataHub",
    "logoAlt": "DataHub",
    "homeLink": "DataHub, ukurasa wa mwanzo",
    "tagline": "Kutoka Data hadi Maamuzi"
  },
  "nav": {
    "label": "Menyu kuu",
    "services": "Huduma",
    "dashboards": "Dashibodi",
    "process": "Mchakato",
    "security": "Usalama",
    "team": "Timu",
    "faq": "Maswali"
  },
  "header": {
    "cta": "Anza mazungumzo",
    "menuOpen": "Menyu",
    "menuClose": "Funga",
    "menuLabel": "Menyu ya tovuti",
    "progressLabel": "Maendeleo ya kusoma"
  },
  "menu": {
    "items": [
      "Huduma",
      "Dashibodi za mfano",
      "Hesabu zako",
      "Jinsi tunavyofanya kazi",
      "Usalama",
      "Timu",
      "Maswali",
      "Mawasiliano"
    ],
    "whatsapp": "Tutumie ujumbe WhatsApp",
    "preferences": "Mipangilio"
  },
  "theme": {
    "toggle": {
      "toDark": "Tumia mandhari ya giza",
      "toLight": "Tumia mandhari ya mwanga"
    },
    "settings": {
      "legend": "Mandhari",
      "system": "Mfumo",
      "light": "Mwanga",
      "dark": "Giza"
    }
  },
  "lang": {
    "legend": "Lugha",
    "en": {
      "short": "EN",
      "name": "English",
      "switchLabel": "Soma ukurasa huu kwa Kiingereza"
    },
    "sw": {
      "short": "SW",
      "name": "Kiswahili",
      "switchLabel": "Soma ukurasa huu kwa Kiswahili"
    }
  },
  "langHint": {
    "toSw": "Ukurasa huu unapatikana kwa Kiswahili",
    "toSwLink": "Soma kwa Kiswahili →",
    "toEn": "This page is available in English",
    "toEnLink": "Read in English →",
    "dismiss": "Funga"
  },
  "motion": {
    "pause": "Simamisha mwendo",
    "resume": "Rejesha mwendo",
    "legend": "Mwendo",
    "on": "Washa",
    "off": "Zima"
  },
  "hero": {
    "eyebrow": "DataHub · Ushauri wa data · Dar es Salaam",
    "title": {
      "line1": "Kutoka data",
      "line2Before": "hadi ",
      "accent": "maamuzi.",
      "sub": "Dashibodi, otomatiki ya ripoti na mawakala wa AI kwa taasisi za Tanzania."
    },
    "lead": "Tunachukua takwimu zilizotawanyika kwenye mifumo, majedwali ya Excel na matawi yako, na kujenga sehemu moja ambapo timu yako hufanya maamuzi. Kwa benki, taasisi za mikopo midogo, vyombo vya habari na biashara zinazokua.",
    "ctaPrimary": "Anza mazungumzo",
    "ctaSecondary": "Tazama dashibodi za mfano",
    "markLabel": "Nembo ya DataHub: herufi D iliyo wazi yenye mkono ndani yake."
  },
  "serviceIndex": {
    "label": "Huduma zetu",
    "items": [
      {
        "index": "01.1",
        "label": "Dashibodi na BI"
      },
      {
        "index": "01.2",
        "label": "Otomatiki ya ripoti"
      },
      {
        "index": "01.3",
        "label": "Mawakala wa AI"
      }
    ]
  },
  "services": {
    "eyebrow": "01 — Tunachofanya",
    "title": "Njia tatu za kugeuza data kuwa maamuzi.",
    "lead": "Kila moja inaanzia kwenye kazi ambayo timu yako tayari inaifanya kwa mkono.",
    "readMore": "Soma zaidi",
    "items": {
      "dashboards": {
        "index": "01.1",
        "title": "Dashibodi na takwimu za biashara (BI)",
        "tagline": "Sehemu moja ya kufanyia maamuzi",
        "description": "Takwimu za sasa kutoka kwenye mifumo yako, zikipimwa dhidi ya lengo na kuchambuliwa kwa kila tawi, idara au afisa. Unaweza kuzisoma kwenye simu kabla ya kikao.",
        "glyphLabel": "Mstari unaopanda kuelekea alama ya lengo"
      },
      "automation": {
        "index": "01.2",
        "title": "Otomatiki ya ripoti",
        "tagline": "Kazi ya saa nyingi kwa mkono, inakamilika kwa sekunde",
        "description": "Ripoti za kila wiki za Excel na PowerPoint ambazo timu yako huziandaa upya kwa mkono, zinatengenezwa kwa muundo uleule na kuwasilishwa kwa ratiba.",
        "glyphLabel": "Mistari mitatu inayoungana kuwa mmoja"
      },
      "aiAgents": {
        "index": "01.3",
        "title": "Mawakala wa AI",
        "tagline": "Programu inayosoma, kuamua na kutenda",
        "description": "Mawakala wanaofuatilia data yako, kufupisha kilichobadilika na kuandaa rasimu ya hatua inayofuata ili mtu aiidhinishe.",
        "glyphLabel": "Nukta tatu zilizounganishwa, moja ikiwa na alama ya kuidhinishwa"
      }
    }
  },
  "dash": {
    "eyebrow": "02 — Dashibodi za mfano",
    "title": "Tazama Jumatatu asubuhi yako inavyoweza kuwa.",
    "lead": "Mionekano minne ya mfano, iliyojengwa kama tunavyojenga kwa wateja. Majina na namba zote ndani yake ni za kubuni.",
    "notice": "Data ya mfano — hatuchapishi dashibodi za wateja",
    "stamp": "DATA YA MFANO",
    "footnote": "Data ya mfano — hatuchapishi dashibodi za wateja. Dashibodi halisi zina taarifa za watu, kwa hiyo zinabaki kwa taasisi zinazozimiliki.",
    "credit": "Chanzo: data ya mfano ya DataHub · TZS · {period}",
    "figPrefix": "Kielelezo",
    "tablistLabel": "Mionekano ya dashibodi za mfano",
    "showTable": "Tazama kama jedwali",
    "readHint": "Inaonyesha lengo la kila chati na uamuzi inaousaidia.",
    "read": {
      "on": "Eleza mwonekano huu",
      "off": "Ficha maelezo",
      "listLabel": "Chati hii inakuambia nini",
      "markerLabel": "Maelezo {n}",
      "decisionPrefix": "Uamuzi:"
    },
    "readout": {
      "idle": "Sogeza juu ya chati ili kusoma thamani"
    },
    "status": {
      "onTarget": "Imefikia lengo",
      "watch": "Angalizo",
      "breach": "Imevuka kikomo",
      "done": "Imekamilika",
      "sent": "Imetumwa",
      "awaiting": "Inasubiri idhini",
      "queued": "Inasubiri kukaguliwa"
    },
    "units": {
      "bn": "bilioni",
      "mn": "milioni",
      "hours": "h",
      "seconds": "s",
      "minutes": "dk",
      "percent": "%"
    },
    "months": [
      "Jan",
      "Feb",
      "Mac",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Okt",
      "Nov",
      "Des"
    ],
    "table": {
      "month": "Mwezi",
      "value": "Thamani",
      "target": "Lengo"
    },
    "views": {
      "overview": {
        "index": "02.1",
        "tab": "Muhtasari kwa uongozi",
        "tabDescription": "Mwezi mzima kwenye skrini moja, kwa ajili ya uongozi.",
        "entity": "Mkopeshaji wa mfano (mikopo midogo)",
        "period": "Jan–Sep 2026",
        "creditPeriod": "Jan–Sep 2026",
        "kpis": [
          {
            "label": "Mapato tangu mwanzo wa mwaka",
            "context": "94% ya lengo la TZS bilioni 19.6"
          },
          {
            "label": "Ufanisi wa makusanyo",
            "context": "Lengo 95.0%"
          },
          {
            "label": "Wakopaji hai",
            "context": "+6.1% tangu mwisho wa Juni"
          },
          {
            "label": "Uwiano wa gharama kwa mapato",
            "context": "Kiwango cha juu 60.0%"
          }
        ],
        "figures": {
          "revenue": {
            "number": "02.1",
            "title": "Mapato dhidi ya lengo, kwa mwezi",
            "axis": "TZS bilioni",
            "seriesActual": "Mapato",
            "seriesTarget": "Lengo",
            "readout": "{month} · TZS bilioni {value} · {pct}% ya lengo",
            "summary": "Mapato ya kila mwezi yalibaki chini ya lengo la TZS bilioni 2.18 kuanzia Januari hadi Agosti, na yakalivuka mwezi Septemba yakifikia TZS bilioni 2.30. Data ya mfano."
          },
          "branches": {
            "number": "02.2",
            "title": "Matawi, % ya lengo la mapato",
            "axis": "% ya lengo",
            "readout": "{branch} · {pct}% ya lengo",
            "summary": "Kariakoo ndilo tawi pekee lililo juu ya lengo, kwa 104%. Matawi ya Dodoma (88%) na Mbeya (84%) yako chini ya 90%. Data ya mfano."
          },
          "exceptions": {
            "number": "02.3",
            "title": "Yasiyo ya kawaida",
            "items": [
              "Mbeya PAR30 7.2% (kikomo 5.0%)",
              "Dodoma PAR30 5.4% (kikomo 5.0%)",
              "Mikopo iliyotolewa Dodoma iko 18% chini ya mpango",
              "Ripoti ya bodi imetengenezwa saa 05:58, imetumwa kwa wapokeaji 9"
            ],
            "summary": "Matawi mawili yamevuka kikomo cha PAR30, tawi moja liko nyuma ya mpango wake wa utoaji mikopo, na ripoti ya bodi ilitumwa kwa wakati. Data ya mfano."
          }
        },
        "changed": {
          "label": "Kilichobadilika wiki hii",
          "byline": "Imeandikwa na wakala wa ripoti · mfano",
          "items": [
            "PAR30 ya Mbeya imepanda kwa pointi 0.8 hadi 7.2%. Maafisa mikopo wawili wanachangia sehemu kubwa ya ongezeko hilo.",
            "Mikopo iliyotolewa Dodoma iko 18% chini ya mpango wa Septemba, hasa kwenye mikopo ya vikundi.",
            "Septemba, kwa mapato ya TZS bilioni 2.30, ni mwezi wa kwanza mwaka huu kuvuka lengo."
          ]
        },
        "read": [
          {
            "figure": "revenue",
            "anchor": "Sep",
            "shows": "Septemba ndio mwezi pekee mwaka huu uliovuka lengo la mwezi.",
            "decision": "Uongozi unaona pengo la tangu mwanzo wa mwaka likipungua na kuamua kama mpango wa robo ya nne ubadilishwe, bila kusubiri ripoti ya mwisho wa mwezi."
          },
          {
            "figure": "branches",
            "anchor": "Mbeya",
            "shows": "Mbeya iko kwenye 84% ya lengo, kiwango cha chini zaidi kati ya matawi manane.",
            "decision": "Mameneja wa kanda wanajua ni tawi gani wanapaswa kulitembelea kwanza."
          },
          {
            "figure": "exceptions",
            "anchor": "0",
            "shows": "Matawi mawili yamevuka kikomo cha PAR30 cha 5%.",
            "decision": "Mkuu wa Mikopo anaona ukiukaji asubuhi ileile unapotokea, si mwisho wa mwezi."
          }
        ]
      },
      "loans": {
        "index": "02.2",
        "tab": "Jalada la mikopo",
        "tabDescription": "Malimbikizo, umri wa madeni na maafisa, kwa timu ya mikopo.",
        "entity": "Mkopeshaji wa mfano (mikopo midogo)",
        "period": "Kufikia 30 Sep 2026",
        "creditPeriod": "Sep 2026",
        "kpis": [
          {
            "label": "Jumla ya jalada la mikopo",
            "context": "+2.1% tangu Agosti"
          },
          {
            "label": "PAR30",
            "context": "Kikomo 5.0%"
          },
          {
            "label": "Mikopo chechefu (siku 90+)",
            "context": "Sehemu ya jalada"
          },
          {
            "label": "Mikopo iliyotolewa Septemba",
            "context": "Mpango TZS bilioni 6.1"
          }
        ],
        "figures": {
          "par": {
            "number": "02.4",
            "title": "PAR30, miezi 12 iliyopita",
            "axis": "% ya jalada",
            "limit": "Kikomo 5.0%",
            "readout": "{month} · PAR30 {value}%",
            "summary": "PAR30 ilipanda kutoka 3.8% Oktoba hadi kilele cha 5.4% Julai, ikiwa juu ya kikomo cha 5% kuanzia Mei hadi Julai, na ikashuka tena hadi 4.6% Septemba. Data ya mfano."
          },
          "ageing": {
            "number": "02.5",
            "title": "Umri wa madeni katika jalada",
            "buckets": [
              "Hayajachelewa",
              "Siku 1–30",
              "Siku 31–60",
              "Siku 61–90",
              "Siku 90+"
            ],
            "summary": "91.2% ya jalada haijachelewa. Mikopo iliyochelewa zaidi ya siku 30 ni 4.6%, na 1.5% imechelewa zaidi ya siku 90. Data ya mfano."
          },
          "mix": {
            "number": "02.6",
            "title": "Jalada kwa aina ya mkopo",
            "products": [
              "Mikopo ya vikundi",
              "Biashara ndogo na za kati",
              "Mishahara",
              "Kilimo"
            ],
            "summary": "Mikopo ya vikundi ndiyo bidhaa kubwa zaidi, TZS bilioni 21.8 kati ya TZS bilioni 64.2, ikifuatiwa na mikopo ya biashara ndogo na za kati, ya mishahara na ya kilimo. Data ya mfano."
          },
          "flows": {
            "number": "02.7",
            "title": "Mikopo iliyotolewa na marejesho, Aprili hadi Septemba",
            "axis": "TZS bilioni",
            "seriesDisbursed": "Mikopo iliyotolewa",
            "seriesRepaid": "Marejesho",
            "readout": "{month} · mikopo iliyotolewa TZS bilioni {a} · marejesho TZS bilioni {b}",
            "summary": "Mikopo iliyotolewa ilikuwa kati ya TZS bilioni 5.2 na 5.9 kwa mwezi. Marejesho yalizidi mikopo iliyotolewa mwezi Julai na Agosti. Data ya mfano."
          }
        },
        "officers": {
          "title": "Maafisa mikopo",
          "caption": "Maafisa wanaonyeshwa kwa namba ya utambulisho pekee. Data ya mfano.",
          "columns": {
            "code": "Afisa",
            "branch": "Tawi",
            "portfolio": "Jalada",
            "par": "PAR30",
            "trend": "Miezi 12"
          }
        },
        "read": [
          {
            "figure": "par",
            "anchor": "Jul",
            "shows": "PAR30 ilivuka kikomo cha 5% mwezi Mei na kufikia kilele cha 5.4% Julai.",
            "decision": "Kuvuka kikomo kunaripotiwa siku ileile kunapotokea, kwa hiyo kazi ya makusanyo inaanza kabla ya kufunga hesabu za mwezi."
          },
          {
            "figure": "ageing",
            "anchor": "90+ days",
            "shows": "1.5% ya jalada imechelewa zaidi ya siku 90.",
            "decision": "Idara za fedha na mikopo zinajadili tengo la hasara kwa kutumia namba ileile."
          },
          {
            "figure": "officers",
            "anchor": "LO-047",
            "shows": "Maafisa wawili wamevuka kikomo, katika matawi yaleyale yaliyoonyeshwa kwenye muhtasari.",
            "decision": "Ufuatiliaji unaelekezwa kwenye majalada mahususi badala ya tawi zima."
          },
          {
            "figure": "flows",
            "anchor": "Jul",
            "shows": "Mwezi Julai, marejesho yalizidi mikopo iliyotolewa kwa mara ya kwanza katika kipindi kinachoonyeshwa.",
            "decision": "Idara ya hazina inapanga fedha kwa kufuata mwenendo badala ya makadirio ya mwezi uliopita."
          }
        ]
      },
      "sales": {
        "index": "02.3",
        "tab": "Mauzo kwa mkoa",
        "tabDescription": "Mauzo yanatoka wapi na yanakua wapi.",
        "entity": "Msambazaji wa mfano (bidhaa za walaji)",
        "period": "Robo ya 3, 2026 (Jul–Sep)",
        "creditPeriod": "Robo ya 3, 2026",
        "kpis": [
          {
            "label": "Mauzo, robo ya 3",
            "context": "+11.3% ukilinganisha na robo ya 3, 2025"
          },
          {
            "label": "Maduka hai",
            "context": "Yaliyoagiza angalau mara moja katika robo ya 3"
          },
          {
            "label": "Wastani wa oda",
            "context": "Kwa kila oda ya duka"
          },
          {
            "label": "Mikoa iliyovuka mpango",
            "value": "6 kati ya 10",
            "context": "Mpango wa robo ya 3"
          }
        ],
        "figures": {
          "map": {
            "number": "02.8",
            "title": "Mauzo kwa mkoa",
            "legendTitle": "Ukuaji ukilinganisha na robo ya 3, 2025",
            "legend": [
              "hadi 6%",
              "7–9%",
              "10–13%",
              "14–17%",
              "18% au zaidi"
            ],
            "ringNote": "Ukubwa wa duara unaonyesha mauzo.",
            "summary": "Dar es Salaam ina mauzo makubwa zaidi. Dodoma, Mwanza na Arusha zilikua kwa kasi zaidi. Ramani inaonyesha ardhi pekee, bila kuchora mipaka. Data ya mfano."
          },
          "ranked": {
            "number": "02.9",
            "title": "Mikoa kwa mpangilio wa mauzo",
            "columns": {
              "region": "Mkoa",
              "sales": "Mauzo",
              "share": "Sehemu",
              "growth": "Ukuaji"
            },
            "other": "Mikoa mingine",
            "readout": "{region} · TZS bilioni {value} · {share}% ya mauzo · ukuaji {growth}%",
            "summary": "Dar es Salaam ni 30.6% ya mauzo na ilikua kwa 8%. Dodoma ilikua kwa kasi zaidi, 21%; Tanga ilikua polepole zaidi, 4%. Data ya mfano."
          }
        },
        "read": [
          {
            "figure": "map",
            "anchor": "Dodoma",
            "shows": "Dodoma ilikua kwa kasi zaidi, 21% ukilinganisha na robo hiyohiyo mwaka jana.",
            "decision": "Uongozi wa mauzo unaweza kujaribu kuelekeza bidhaa na wauzaji wanaotembelea maduka kwenye ukanda wa kati."
          },
          {
            "figure": "ranked",
            "anchor": "Dar es Salaam",
            "shows": "Dar es Salaam ni karibu theluthi moja ya mauzo lakini ilikua kwa 8%, chini ya wastani wa jumla wa 11.3%.",
            "decision": "Mkoa mkubwa zaidi ndio wa kufuatilia kwa hisa ya soko, si kwa wingi wa mauzo."
          },
          {
            "figure": "ranked",
            "anchor": "Tanga",
            "shows": "Tanga ilikua kwa 4%, mkoa uliokua polepole zaidi.",
            "decision": "Kagua ufikiaji wa maduka huko kabla malengo ya robo ijayo hayajawekwa."
          }
        ]
      },
      "operations": {
        "index": "02.4",
        "tab": "Otomatiki na uendeshaji",
        "tabDescription": "Ripoti zinazojiendesha zenyewe, na kile wakala alichofanya.",
        "entity": "Mfumo wa ripoti wa mkopeshaji wa mfano",
        "period": "Septemba 2026 · ratiba ya Jumatatu ya mfano",
        "creditPeriod": "Sep 2026",
        "kpis": [
          {
            "label": "Ripoti zilizowasilishwa kiotomatiki",
            "context": "Mwezi Septemba"
          },
          {
            "label": "Muda wa kati (median) wa kutengeneza ripoti",
            "context": "Mizunguko 14 ya mwisho"
          },
          {
            "label": "Saa za wafanyakazi zilizookolewa",
            "context": "Makadirio, ukilinganisha na kuandaa kwa mkono"
          },
          {
            "label": "Mizunguko iliyoshindwa",
            "context": "Yote miwili ilirudiwa asubuhi ileile"
          }
        ],
        "figures": {
          "schedule": {
            "number": "02.10",
            "title": "Ratiba ya Jumatatu",
            "lanes": [
              "Ripoti",
              "Tahadhari",
              "Wakala"
            ],
            "items": [
              "05:30 Ripoti ya PAR ya kila siku → mameneja 14 wa matawi",
              "05:58 Ripoti ya bodi (Jumatatu) → wapokeaji 9",
              "07:00 Yasiyo ya kawaida kwenye makusanyo → wakala anaandaa rasimu za ufuatiliaji",
              "12:00 Hali ya fedha taslimu",
              "18:30 Kufunga hesabu za siku"
            ],
            "timeAxis": "Saa za Afrika Mashariki",
            "summary": "Kazi tano zilizopangwa zinaendeshwa kati ya 05:30 na 18:30, zikianza na ripoti ya PAR ya kila siku kabla matawi hayajafunguliwa. Data ya mfano."
          },
          "runs": {
            "number": "02.11",
            "title": "Muda wa kutengeneza, mizunguko 14 ya mwisho",
            "axis": "sekunde",
            "readout": "Mzunguko {n} · sekunde {value}",
            "slowLabel": "Mzunguko wa polepole",
            "summary": "Mizunguko ilichukua sekunde 35 hadi 41, isipokuwa mzunguko wa 7 uliochukua sekunde 61. Muda wa kati ni sekunde 38. Data ya mfano."
          },
          "pack": {
            "number": "02.12",
            "title": "Ripoti ya menejimenti ya kila mwezi",
            "before": "Kwa mkono",
            "after": "Kiotomatiki",
            "beforeValue": "saa 14",
            "afterValue": "dakika 4",
            "summary": "Ripoti ya menejimenti ya kila mwezi ilichukua saa 14 kuandaliwa kwa mkono na sasa inachukua dakika 4. Data ya mfano."
          }
        },
        "log": {
          "title": "Kumbukumbu za wakala",
          "caption": "Wakala anaandaa rasimu. Mtu anaidhinisha chochote kinachotoka nje ya taasisi. Data ya mfano.",
          "items": [
            {
              "time": "05:30",
              "text": "Ripoti ya PAR ya kila siku imetengenezwa na kutumwa kwa mameneja 14 wa matawi.",
              "status": "sent"
            },
            {
              "time": "05:58",
              "text": "Ripoti ya bodi ya Jumatatu imetengenezwa na kutumwa kwa wapokeaji 9.",
              "status": "sent"
            },
            {
              "time": "07:02",
              "text": "PAR30 imevuka kikomo cha 5.0% katika matawi 2: Mbeya 7.2%, Dodoma 5.4%. Rasimu ya ujumbe wa ufuatiliaji imeandaliwa kwa ajili ya Mkuu wa Mikopo.",
              "status": "awaiting"
            },
            {
              "time": "07:09",
              "text": "Ujumbe umeidhinishwa na Mkuu wa Mikopo na kutumwa kwa mameneja wa matawi yote mawili.",
              "status": "sent"
            },
            {
              "time": "07:15",
              "text": "Rasimu za jumbe 41 za ukumbusho kwa wakopaji wenye malimbikizo zimeandaliwa, zikisubiri kukaguliwa na maafisa mikopo.",
              "status": "queued"
            }
          ]
        },
        "read": [
          {
            "figure": "schedule",
            "anchor": "05:30",
            "shows": "Ripoti ya PAR ya kila siku inawafikia mameneja 14 wa matawi saa 05:30, kabla matawi hayajafunguliwa.",
            "decision": "Mameneja wanaanza siku wakiwa na namba za jana badala ya kuziomba."
          },
          {
            "figure": "runs",
            "anchor": "7",
            "shows": "Mzunguko mmoja ulichukua sekunde 61, wakati muda wa kati ni sekunde 38.",
            "decision": "Mzunguko wa polepole unaonekana kabla haujageuka kuwa ripoti iliyochelewa."
          },
          {
            "figure": "log",
            "anchor": "07:02",
            "shows": "Wakala aligundua ukiukaji na kuandaa rasimu ya ujumbe. Mtu aliuidhinisha dakika saba baadaye.",
            "decision": "Wewe ndiye unayechagua hatua zipi zibaki mikononi mwa mtu."
          },
          {
            "figure": "pack",
            "anchor": "after",
            "shows": "Muda wa kuandaa ripoti ya kila mwezi ulishuka kutoka saa 14 kwa mkono hadi dakika 4.",
            "decision": "Muda wa mchambuzi unatumika kufafanua namba, si kuzinakili."
          }
        ]
      }
    }
  },
  "estimator": {
    "eyebrow": "03 — Hesabu zako",
    "title": "Saa za kazi zinakwenda wapi?",
    "lead": "Weka namba zako za ripoti moja, uone inavyoigharimu timu yako leo.",
    "sentence": [
      "Tunaandaa ripoti ",
      "{count}",
      " kila ",
      "{period}",
      ". Kila moja inaandaliwa na {personWord} ",
      "{people}",
      " kwa takriban saa ",
      "{hours}",
      "."
    ],
    "personWord": {
      "one": "mtu",
      "other": "watu"
    },
    "reportWord": {
      "one": "ripoti",
      "other": "ripoti"
    },
    "hourWord": {
      "one": "saa",
      "other": "saa"
    },
    "periods": {
      "day": "siku ya kazi",
      "week": "wiki",
      "month": "mwezi"
    },
    "periodUnits": {
      "day": "siku za kazi",
      "week": "wiki",
      "month": "miezi"
    },
    "labels": {
      "count": "Idadi ya ripoti",
      "period": "Mara ngapi",
      "people": "Watu wanaohusika kwenye kila ripoti",
      "hours": "Saa ambazo kila mtu hutumia kwa ripoti moja"
    },
    "stepper": {
      "decrease": "Punguza {label}",
      "increase": "Ongeza {label}"
    },
    "salary": {
      "label": "Wastani wa mshahara wa mwezi wa wanaohusika (si lazima)",
      "placeholder": "mf. 1,500,000",
      "unit": "TZS",
      "help": "Inaongeza makadirio ya gharama kwa shilingi. Taarifa hii inabaki kwenye kifaa chako."
    },
    "result": {
      "label": "Makadirio yako",
      "hours": "≈ saa {hours} kwa mwaka",
      "days": "siku {days} za kazi",
      "cost": "≈ TZS {amount} kwa mwaka, gharama ya muda wa wafanyakazi"
    },
    "formula": {
      "hours": "ripoti {count} × {periodUnit} {periods} × {personWord} {people} × saa {hours} = saa {total} kwa mwaka · saa 8 = siku 1 ya kazi",
      "cost": "TZS {salary} ÷ saa 176 kwa mwezi = TZS {hourly} kwa saa",
      "assumptions": "Tunachukulia siku 240 za kazi, wiki 48 za kazi au miezi 12 kwa mwaka."
    },
    "note": "Namba zako, makadirio yako. Hii si nukuu ya bei, na hakuna kinachotumwa isipokuwa ukichagua kutuma ujumbe.",
    "addToMessage": "Ongeza hii kwenye ujumbe wangu",
    "added": "Imeongezwa kwenye ujumbe wako. Jaza jina lako ili kuutuma.",
    "messageTemplate": "Tunaandaa ripoti {count} kila {period}. Kila moja inaandaliwa na {personWord} {people} kwa takriban saa {hours}, yaani takriban saa {hoursPerYear} kwa mwaka.",
    "error": {
      "range": "Tumia namba kati ya {min} na {max}."
    }
  },
  "process": {
    "eyebrow": "04 — Tunavyofanya kazi",
    "title": "Jinsi mradi unavyoendeshwa.",
    "lead": "Mfumo tunaoujenga unategemea taasisi yako. Njia ya kufika huko inabaki ileile.",
    "receivePrefix": "Unapokea:",
    "steps": [
      {
        "index": "04.1",
        "title": "Kuchunguza",
        "description": "Tunakaa na timu yako kuelewa mtiririko halisi wa kazi: ripoti unazozitegemea, takwimu muhimu, na mahali kazi ya mkono ilipo.",
        "receive": "orodha ya ripoti na takwimu muhimu, na tathmini ya wazi kama mfumo unastahili kujengwa."
      },
      {
        "index": "04.2",
        "title": "Kusanifu",
        "description": "Tunapanga dashibodi, otomatiki na mtiririko wa data kulingana na jinsi taasisi yako tayari inavyofanya kazi.",
        "receive": "mpango tuliokubaliana nawe kabla chochote hakijajengwa."
      },
      {
        "index": "04.3",
        "title": "Kujenga",
        "description": "Tunaandika msimbo salama na kuwasilisha mfumo unaofanya kazi: dashibodi, ripoti za kupakua na uwasilishaji kwa ratiba, vyote vikiendana na miundo yako iliyopo.",
        "receive": "mfumo unaofanya kazi, unaowasilishwa kwa awamu."
      },
      {
        "index": "04.4",
        "title": "Kusaidia",
        "description": "Tunaifundisha timu yako na kuendelea kuboresha mfumo kadri unavyoongeza ripoti, vyanzo vya data na malengo.",
        "receive": "mafunzo, na mabadiliko kadri mahitaji yako yanavyokua."
      }
    ],
    "closing": "Kitu chenye manufaa kinaifikia timu yako mapema. Tunawasilisha kwa awamu, si kila kitu mwishoni."
  },
  "security": {
    "eyebrow": "05 — Kwa nini DataHub",
    "title": "Kutoka kazi ya mkono iliyotawanyika hadi mfumo wa kiotomatiki ulio wazi.",
    "lead": "Tunabadilisha kazi ya mkono ya polepole na yenye makosa kwa mfumo mmoja, ili timu yako itumie muda wake kwenye maamuzi, si kwenye majedwali ya Excel.",
    "ledger": {
      "todayHeading": "Leo",
      "withHeading": "Ukiwa na DataHub",
      "rows": [
        {
          "today": "Ripoti huchukua saa au siku kuandaliwa",
          "with": "Ripoti zinatengenezwa kwa sekunde"
        },
        {
          "today": "Watu tofauti wanapata namba tofauti",
          "with": "Hesabu moja, jibu moja kwa wote"
        },
        {
          "today": "Mafaili yametawanyika kwenye barua pepe na folda",
          "with": "Kila kitu sehemu moja, kwenye kivinjari chochote"
        },
        {
          "today": "Ripoti hupangwa na kutumwa kwa barua pepe kwa mkono",
          "with": "Ripoti zilizopangwa tayari zinawasilishwa kwa ratiba"
        },
        {
          "today": "Hakuna picha ya sasa ya utendaji",
          "with": "Takwimu za sasa kwa uongozi kwa mtazamo mmoja"
        }
      ]
    },
    "data": {
      "title": "Data yako inabaki kuwa yako.",
      "body": "Usalama unajengwa tangu mstari wa kwanza wa msimbo, si kuongezwa mwishoni. Kila mfumo tunaoujenga unafuata kanuni hizi.",
      "items": [
        {
          "term": "Ufikiaji kwa nafasi ya kazi",
          "definition": "Kila mtu anaona tu kile ambacho nafasi yake ya kazi inaruhusu."
        },
        {
          "term": "Taarifa za kuingia zilizosimbwa",
          "definition": "Nywila na siri za kuunganisha mifumo zinahifadhiwa zikiwa zimesimbwa, na kamwe hazihifadhiwi kama maandishi ya wazi."
        },
        {
          "term": "Maingizo yanayohakikiwa",
          "definition": "Kila kinachoingia kwenye mfumo kinakaguliwa kwenye seva kabla hakijatumika."
        },
        {
          "term": "Miingiliano iliyoimarishwa",
          "definition": "Miingiliano inakubali tu kile inachohitaji na kukataa kila kitu kingine."
        },
        {
          "term": "Mawakala wenye mipaka",
          "definition": "Wakala wa AI hapati ufikiaji zaidi ya mtu anayemfanyia kazi. Chochote chenye athari kubwa kinaandaliwa kama rasimu ili mtu akiidhinishe."
        },
        {
          "term": "Haishirikishwi kamwe",
          "definition": "Data yako haishirikishwi wala kuuzwa, na dashibodi za wateja hazichapishwi kamwe. Ndiyo sababu kila dashibodi kwenye tovuti hii inatumia data ya mfano."
        }
      ]
    },
    "proof": {
      "title": "Ushahidi kwenye ukurasa huu",
      "lead": "Unaweza kuhakiki mwenyewe madai haya kuhusu tovuti hii.",
      "lines": [
        "Skripti: zetu pekee. Kila ukurasa unatumwa pamoja na sera ya usalama yenye msimbo mpya kwa kila ziara, kwa hiyo skripti iliyopachikwa na mtu mwingine haiendeshwi.",
        "Vifuatiliaji na programu za takwimu za makampuni mengine: hakuna.",
        "Fonti na picha: zinatolewa kutoka datahub.co.tz, si kutoka kwenye seva za makampuni mengine.",
        "Vidakuzi (cookies): hakuna. Chaguo zako za mandhari na lugha zinahifadhiwa kwenye kivinjari chako pekee.",
        "Fomu ya mawasiliano: inakaguliwa kwenye seva yetu, inaruhusu jumbe chache tu kwa kila anwani ya mtandao (IP), na inachuja barua taka za kiotomatiki."
      ],
      "showPolicy": "Onyesha sera kamili",
      "policyNote": "Kichwa cha Content-Security-Policy kilichotumwa pamoja na ukurasa huu. Msimbo unaobadilika kila ziara umefichwa.",
      "check": "Kagua mwenyewe vichwa vyetu vya usalama"
    }
  },
  "team": {
    "eyebrow": "06 — Timu",
    "title": "Watu utakaofanya nao kazi.",
    "lead": "Sisi ni timu ndogo, kwa hiyo watu unaokutana nao ndio wanaojenga na kuendesha mradi wako.",
    "members": {
      "cto": {
        "index": "06.1",
        "name": "Daniel C. Masubi",
        "role": "Afisa Mkuu wa Teknolojia",
        "bio": "Anasanifu na kujenga mifumo: mitiririko ya data, dashibodi, otomatiki ya ripoti na mawakala. Anawajibika kwa usalama wa data yako, kwa hiyo maswali yako ya kiufundi yanakwenda kwa mtu anayejenga mfumo wenyewe.",
        "alt": "Daniel C. Masubi, Afisa Mkuu wa Teknolojia, DataHub"
      },
      "operations": {
        "index": "06.2",
        "name": "Kanuda L. Sasi",
        "role": "Mkuu wa Uendeshaji",
        "bio": "Anasimamia utekelezaji: wigo wa kazi, ratiba, mafunzo kwa timu yako na msaada baada ya mfumo kuzinduliwa. Anahakikisha kile kilichokubaliwa ndicho kinachowasilishwa.",
        "alt": "Kanuda L. Sasi, Mkuu wa Uendeshaji, DataHub"
      },
      "marketing": {
        "index": "06.3",
        "name": "Yohana K. Mussa",
        "role": "Mkuu wa Masoko",
        "bio": "Mara nyingi ndiye mtu wa kwanza kutoka DataHub utakayezungumza naye. Anahakikisha wigo wa kazi tunaopanga unalenga tatizo lile ulilolieleza, anakuonyesha dashibodi za mfano, na anakujulisha maendeleo kadri kazi inavyosonga.",
        "alt": "Yohana K. Mussa, Mkuu wa Masoko, DataHub"
      }
    }
  },
  "faq": {
    "eyebrow": "07 — Maswali",
    "title": "Maswali ambayo watu huuliza kabla ya kuanza.",
    "aside": "Hujapata jibu hapa?",
    "asideWhatsapp": "Tuulize kupitia WhatsApp",
    "asideEmail": "Tutumie barua pepe",
    "indexPrefix": "S",
    "items": [
      {
        "q": "DataHub inafanya nini?",
        "a": "DataHub inajenga dashibodi maalum, mifumo ya ripoti za kiotomatiki na mawakala wa AI kwa taasisi za Tanzania. Tunachukua takwimu ambazo tayari zimetawanyika kwenye majedwali ya Excel, mifumo na matawi yako, na kuziweka sehemu moja ambapo timu yako inaweza kufanya maamuzi."
      },
      {
        "q": "Mko wapi, na mnafanya kazi nje ya Dar es Salaam?",
        "a": "Tupo Dar es Salaam, Tanzania, na tunafanya kazi na taasisi kote nchini na nje ya nchi. Sehemu kubwa ya kazi inafanyika kwa mbali, na tunafika ofisini kwako pale ambapo kupanga wigo wa kazi au mafunzo kunahitaji hivyo."
      },
      {
        "q": "Mnaweza kuweka mfumo wa kiotomatiki kwa ripoti tunazoandaa sasa kwa Excel?",
        "a": "Ndiyo. Hapo ndipo tunapoanzia mara nyingi. Ikiwa timu yako inatumia saa nyingi kila wiki kunakili kati ya majedwali, kupanga muundo na kutuma ripoti ileile kwa barua pepe, mchakato huo wote kwa kawaida unaweza kubadilishwa na mfumo unaoitengeneza kwa sekunde na kuiwasilisha kiotomatiki."
      },
      {
        "q": "Dashibodi au mfumo wa ripoti unagharimu kiasi gani?",
        "a": "Inategemea unachohitaji, na yeyote anayetaja bei kabla ya kuelewa mtiririko wako wa kazi anabahatisha. Tuambie ni ripoti au mchakato gani unaogharimu timu yako muda mwingi zaidi, nasi tutapanga wigo wake pamoja nawe. Mazungumzo ya kwanza ni bure, na kama haistahili kujengwa tutakuambia."
      },
      {
        "q": "Mnatumia zana kama Power BI, au mnajenga mifumo maalum?",
        "a": "Vyote viwili, kulingana na tatizo. Zana za takwimu za biashara zilizo tayari sokoni zinafaa pale data yako tayari iko safi na maswali ni ya kawaida. Pale mtiririko wako wa kazi, mnyororo wa idhini au miundo ya ripoti ni mahususi kwa jinsi taasisi yako inavyoendeshwa, mfumo maalum unafaa zaidi na una gharama ndogo zaidi kuuendesha kwa muda mrefu."
      },
      {
        "q": "Je, data yetu iko salama?",
        "a": "Usalama unajengwa ndani tangu mwanzo, si kuongezwa baadaye. Mifumo inajengwa na taarifa za kuingia zilizosimbwa, ufikiaji kwa nafasi ya kazi ili kila mtu aone tu kile ambacho nafasi yake inaruhusu, maingizo yanayohakikiwa na miingiliano iliyoimarishwa. Data yako inabaki kuwa yako. Haishirikishwi wala kuuzwa kamwe."
      },
      {
        "q": "Mradi unachukua muda gani?",
        "a": "Dashibodi moja mahususi au ripoti moja ya kiotomatiki kwa kawaida huchukua wiki kadhaa. Mfumo kamili wa ripoti unaohusisha idara kadhaa unachukua muda mrefu zaidi. Tunapanga kwa awamu ili kitu chenye manufaa kiifikie timu yako mapema badala ya mwishoni kabisa."
      },
      {
        "q": "Mnajenga pia mawakala wa AI?",
        "a": "Ndiyo. Zaidi ya dashibodi, tunasanifu mawakala wanaosoma data ya uendeshaji wako, kufupisha kilichobadilika, na kuchukua hatua: kufuatilia mambo yanayosubiri, kuonyesha yasiyo ya kawaida, au kuandaa rasimu za ripoti ambazo mtu anaziandika kwa mkono sasa. Chochote chenye athari kubwa kinaandaliwa kama rasimu ili mtu akiidhinishe."
      }
    ]
  },
  "contact": {
    "eyebrow": "08 — Mawasiliano",
    "title": "Tuambie ni ripoti gani inayokugharimu muda mwingi zaidi.",
    "lead": "Tueleze unachotumia sasa na ungependa kuona nini. Tutapanga wigo wa kazi pamoja nawe. Mazungumzo ya kwanza ni bure, na kama haistahili kujengwa tutakuambia.",
    "lines": {
      "whatsapp": {
        "label": "WhatsApp",
        "action": "Tutumie ujumbe WhatsApp"
      },
      "email": {
        "label": "Barua pepe"
      },
      "location": {
        "label": "Mahali tulipo",
        "value": "Dar es Salaam, Tanzania",
        "note": "Tunafanya kazi na taasisi kote Tanzania"
      }
    },
    "next": {
      "title": "Kinachofuata",
      "steps": [
        "Tunasoma ujumbe wako na kukujibu ili kupanga mazungumzo mafupi.",
        "Tunaangalia ripoti au mchakato pamoja nawe na kukubaliana kinachostahili kujengwa.",
        "Unapokea wigo wa kazi kwa maandishi kabla kazi yoyote haijaanza."
      ]
    },
    "privacy": "Tunatumia taarifa zako kwa ajili ya kujibu ombi lako tu.",
    "privacyLink": "Soma taarifa yetu ya faragha"
  },
  "form": {
    "label": "Fomu ya mawasiliano",
    "optional": "si lazima",
    "fields": {
      "name": {
        "label": "Jina",
        "placeholder": "Jina lako kamili"
      },
      "phone": {
        "label": "Simu / WhatsApp",
        "placeholder": "+255 7XX XXX XXX"
      },
      "email": {
        "label": "Barua pepe",
        "placeholder": "jina@taasisi.co.tz"
      },
      "company": {
        "label": "Taasisi",
        "placeholder": "Jina la taasisi"
      },
      "service": {
        "legend": "Unavutiwa na",
        "options": {
          "dashboards": "Dashibodi na takwimu za biashara (BI)",
          "automation": "Otomatiki ya ripoti",
          "customSoftware": "Mawakala wa AI na programu maalum",
          "other": "Bado sina uhakika"
        }
      },
      "message": {
        "label": "Ujumbe",
        "placeholder": "Ni ripoti au mchakato gani unaochukua muda mwingi wa timu yako? Ungependa kuona nini badala yake?",
        "counter": "Herufi {count} kati ya 4,000"
      }
    },
    "honeypot": "Acha sehemu hii wazi",
    "errors": {
      "name": {
        "required": "Tafadhali andika jina lako.",
        "tooShort": "Tafadhali andika angalau herufi 2.",
        "tooLong": "Tafadhali jina lisizidi herufi 100."
      },
      "email": {
        "required": "Tafadhali andika anwani yako ya barua pepe.",
        "invalid": "Tafadhali andika anwani sahihi ya barua pepe, kwa mfano jina@taasisi.co.tz.",
        "tooLong": "Tafadhali anwani ya barua pepe isizidi herufi 160."
      },
      "phone": {
        "invalid": "Tafadhali tumia tarakimu, nafasi, +, - au mabano pekee.",
        "tooLong": "Tafadhali namba isizidi herufi 30."
      },
      "company": {
        "tooLong": "Tafadhali jina la taasisi lisizidi herufi 140."
      },
      "service": {
        "invalid": "Tafadhali chagua mojawapo ya machaguo."
      },
      "message": {
        "required": "Tafadhali tueleze unachohitaji.",
        "tooShort": "Tafadhali andika angalau herufi 10 ili tuelewe unachohitaji.",
        "tooLong": "Tafadhali ujumbe wako usizidi herufi 4,000."
      }
    },
    "submit": "Tuma ujumbe",
    "sending": "Inatuma…",
    "status": {
      "checkFields": "Tafadhali kagua sehemu zilizowekwa alama.",
      "rateLimited": "Jumbe nyingi mno kutoka kwenye muunganisho huu. Tafadhali subiri dakika chache kisha ujaribu tena, au tutumie ujumbe WhatsApp.",
      "invalid": "Hatukuweza kusoma ujumbe wako. Tafadhali jaribu tena.",
      "server": "Ujumbe wako haukufika. Tafadhali jaribu tena, au tutumie ujumbe WhatsApp.",
      "network": "Hakuna muunganisho. Kagua intaneti yako kisha ujaribu tena.",
      "loading": "Bado inapakia. Kwa sasa, tutumie WhatsApp kwa {number}."
    },
    "success": {
      "title": "Asante.",
      "body": "Ujumbe wako umetufikia. Tutakujibu ili tuzungumze kuhusu unachohitaji.",
      "again": "Tuma ujumbe mwingine"
    },
    "whatsappAlt": "Unapendelea WhatsApp? Tutumie ujumbe kwa {number}.",
    "whatsappAltNoNumber": "Unapendelea barua pepe? Tuandikie kwa {email}."
  },
  "rail": {
    "label": "Mawasiliano ya haraka",
    "whatsapp": "WhatsApp",
    "cta": "Anza mazungumzo"
  },
  "footer": {
    "tagline": {
      "line1Before": "Kutoka ",
      "line1Accent": "Data",
      "line2": "hadi Maamuzi"
    },
    "about": "Dashibodi, otomatiki ya ripoti na mawakala wa AI kwa taasisi za Tanzania. Tupo Dar es Salaam.",
    "columns": {
      "services": "Huduma",
      "company": "Kampuni",
      "contact": "Mawasiliano",
      "preferences": "Mipangilio"
    },
    "services": [
      "Dashibodi na takwimu za biashara (BI)",
      "Otomatiki ya ripoti",
      "Mawakala wa AI"
    ],
    "company": [
      "Jinsi tunavyofanya kazi",
      "Usalama",
      "Timu",
      "Maswali",
      "Taarifa ya faragha"
    ],
    "contact": {
      "whatsapp": "WhatsApp {number}",
      "email": "{email}",
      "location": "Dar es Salaam, Tanzania"
    },
    "legal": "© {year} DataHub · Dar es Salaam, Tanzania · Dashibodi kwenye tovuti hii zinatumia data ya mfano.",
    "backToTop": "Rudi juu"
  },
  "servicePage": {
    "breadcrumbLabel": "Njia ya ukurasa",
    "home": "Mwanzo",
    "cta": "Anza mazungumzo",
    "allServices": "Tazama huduma zote",
    "signals": {
      "eyebrow": "01 — Je, unaihitaji?",
      "title": "Dalili kwamba unahitaji huduma hii"
    },
    "deliverables": {
      "eyebrow": "02 — Utakachopata",
      "title": "Utakachopata"
    },
    "sample": {
      "eyebrow": "03 — Ione kwenye mfano",
      "title": "Ione kwenye mfano",
      "lead": "Takwimu za mfano, zilizoandaliwa kama tunavyoandaa kwa wateja. Majina na namba zote ni za kubuni."
    },
    "faq": {
      "eyebrow": "04 — Maswali",
      "title": "Maswali kuhusu {service}"
    },
    "others": {
      "eyebrow": "05 — Pia kutoka DataHub",
      "title": "Pia kutoka DataHub"
    },
    "englishOnly": "Ukurasa huu uko kwa Kiingereza wakati toleo la Kiswahili linaandaliwa."
  },
  "privacy": {
    "title": "Taarifa ya faragha",
    "updated": "Ilisasishwa mwisho {date}",
    "intro": "Taarifa hii inaeleza kile DataHub inachokusanya kupitia tovuti hii na tunachokifanya nacho. Imeandikwa kwa kuzingatia Sheria ya Ulinzi wa Taarifa Binafsi ya Tanzania, 2022.",
    "sections": [
      {
        "title": "Tunachokusanya",
        "body": "Kile tu unachoandika kwenye fomu ya mawasiliano: jina lako, anwani ya barua pepe, namba ya simu, taasisi, huduma unayovutiwa nayo na ujumbe wako. Ikiwa umefika kupitia mojawapo ya machapisho yetu, tunahifadhi pia lebo fupi ya kampeni iliyo kwenye kiungo (kwa mfano “whatsapp”) ili tujue ni njia gani ilikufikia."
      },
      {
        "title": "Tusichokusanya",
        "body": "Tovuti hii haiweki vidakuzi (cookies) na haiendeshi programu za takwimu wala vifuatiliaji vya matangazo. Chaguo lako la mandhari na lugha linahifadhiwa kwenye kivinjari chako, halitumwi kwetu."
      },
      {
        "title": "Muunganisho wako",
        "body": "Ili kuzuia barua taka za kiotomatiki, tunaweka kikomo cha jumbe ambazo muunganisho mmoja unaweza kutuma. Kwa ajili hiyo tunahifadhi anwani yako ya IP katika hali iliyofichwa (hashed), si anwani yenyewe."
      },
      {
        "title": "Kwa nini tunazitumia",
        "body": "Kujibu ombi lako na kuendeleza mazungumzo uliyoyaanzisha. Hatuuzi, hatukodishi wala hatushirikishi taarifa zako na mtu mwingine yeyote."
      },
      {
        "title": "Chaguo zako",
        "body": "Unaweza kutuuliza tunashikilia taarifa gani kukuhusu, kutuomba tuzirekebishe, au kutuomba tuzifute, kwa kutuandikia {email}."
      },
      {
        "title": "Mawasiliano",
        "body": "DataHub, Dar es Salaam, Tanzania. {email}"
      }
    ]
  },
  "notFound": {
    "eyebrow": "404",
    "title": "Ukurasa huu haupo.",
    "body": "Huenda kiungo ni cha zamani au kimeandikwa vibaya.",
    "home": "Nenda ukurasa wa mwanzo",
    "contact": "Au tuambie ulichokuwa unatafuta"
  },
  "alt": {
    "og": "DataHub — Kutoka Data hadi Maamuzi. Dashibodi, otomatiki ya ripoti na mawakala wa AI Tanzania.",
    "heroSilk": "(decorative, `aria-hidden`, no alt)",
    "heroMark": "(decorative inside the hero; the H1 carries the meaning)",
    "footerPlate": "(decorative, `aria-hidden`)",
    "teamCto": "Daniel C. Masubi, Afisa Mkuu wa Teknolojia, DataHub",
    "teamOperations": "Kanuda L. Sasi, Mkuu wa Uendeshaji, DataHub",
    "teamMarketing": "Yohana K. Mussa, Mkuu wa Masoko, DataHub",
    "serviceGlyphs": "(decorative; the row title names the service)",
    "figurePrefix": "Chati ya mfano:",
    "whatsappIcon": "(decorative; the visible word \"WhatsApp\" names the link)",
    "themeIcon": "(decorative; the button’s aria-label names the action)"
  }
} satisfies Dictionary;

export default sw;
