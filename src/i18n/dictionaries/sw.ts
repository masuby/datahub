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
      "description": "Dashibodi, otomatiki ya ripoti na mawakala wa AI kwa taasisi za Tanzania, vinavyojengwa Dar es Salaam.",
      "ogTitle": "DataHub — Uchambuzi wa Data na Dashibodi Tanzania",
      "ogDescription": "Dashibodi, otomatiki ya ripoti na mawakala wa AI Tanzania. Kutoka Data hadi Maamuzi."
    },
    "privacy": {
      "title": "Taarifa ya faragha",
      "description": "Kile tovuti hii inachokusanya, kwa nini, na jinsi ya kuomba kifutwe."
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
    "today": "Leo:",
    "withDataHub": "Ukiwa na DataHub:"
  },
  "brand": {
    "homeLink": "DataHub, ukurasa wa mwanzo",
    "tagline": "Kutoka Data hadi Maamuzi"
  },
  "nav": {
    "label": "Menyu kuu",
    "services": "Huduma",
    "process": "Mchakato",
    "security": "Usalama",
    "team": "Timu",
    "faq": "Maswali"
  },
  "header": {
    "cta": "Anza mazungumzo",
    "menuOpen": "Menyu",
    "menuClose": "Funga",
    "menuLabel": "Menyu ya tovuti"
  },
  "menu": {
    "items": [
      "Huduma",
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
    "ctaPrimary": "Anza mazungumzo",
    "ctaSecondary": "Tazama onyesho la moja kwa moja"
  },
  "services": {
    "eyebrow": "01 — Tunachofanya",
    "title": "Njia tatu za kugeuza data kuwa maamuzi.",
    "lead": "Kila moja inaanzia kwenye kazi ambayo timu yako hufanya kwa mkono.",
    "readMore": "Soma zaidi",
    "items": {
      "dashboards": {
        "index": "01.1",
        "title": "Dashibodi na takwimu za biashara (BI)",
        "tagline": "Sehemu moja ya kufanyia maamuzi",
        "description": "Takwimu za sasa dhidi ya lengo, kwa kila tawi, idara au afisa."
      },
      "automation": {
        "index": "01.2",
        "title": "Otomatiki ya ripoti",
        "tagline": "Kazi ya saa nyingi, kwa sekunde",
        "description": "Ripoti zako za kila wiki za Excel na PowerPoint, zinajitengeneza zenyewe."
      },
      "aiAgents": {
        "index": "01.3",
        "title": "Mawakala wa AI",
        "tagline": "Husoma data, huandaa hatua ijayo",
        "description": "Mawakala wanaofuatilia data yako, kufupisha kilichobadilika na kusubiri mtu aidhinishe."
      }
    }
  },
  "dash": {
    "eyebrow": "Dashibodi ya mfano",
    "title": "Jumatatu yako inaweza kuonekana hivi.",
    "notice": "Data ya mfano — hatuchapishi dashibodi za wateja",
    "stamp": "DATA YA MFANO",
    "footnote": "Majina na namba zote hapa ni za kubuni.",
    "credit": "Chanzo: data ya mfano ya DataHub · TZS · {period}",
    "figPrefix": "Kielelezo",
    "showTable": "Tazama kama jedwali",
    "read": {
      "listLabel": "Chati hii inakuambia nini",
      "decisionPrefix": "Uamuzi:"
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
      "month": "Mwezi"
    },
    "views": {
      "overview": {
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
            "summary": "Mapato yalikuwa chini ya lengo la mwezi la TZS bilioni 2.18 hadi Septemba (TZS bilioni 2.30)."
          },
          "branches": {
            "number": "02.2",
            "title": "Matawi, % ya lengo la mapato",
            "axis": "% ya lengo",
            "readout": "{branch} · {pct}% ya lengo",
            "summary": "Kariakoo pekee iko juu ya lengo, kwa 104%."
          }
        },
        "changed": {
          "label": "Kilichobadilika wiki hii",
          "byline": "Imeandikwa na wakala wa ripoti · mfano",
          "items": [
            "PAR30 ya Mbeya imepanda kwa pointi 0.8 hadi 7.2%, hasa kutokana na maafisa mikopo wawili.",
            "Mikopo iliyotolewa Dodoma iko 18% chini ya mpango, hasa mikopo ya vikundi.",
            "Septemba, kwa TZS bilioni 2.30, ni mwezi wa kwanza mwaka huu kuvuka lengo."
          ]
        },
        "read": [
          {
            "figure": "revenue",
            "anchor": "Sep",
            "shows": "Septemba ni mwezi wa kwanza kuvuka lengo.",
            "decision": "Uongozi unaweza kurekebisha mpango wa robo ya nne sasa."
          },
          {
            "figure": "branches",
            "anchor": "Mbeya",
            "shows": "Mbeya iko chini zaidi, kwa 84% ya lengo.",
            "decision": "Mameneja wa kanda wanajua waanzie wapi."
          }
        ]
      },
      "operations": {
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
            "context": "Makadirio, dhidi ya kazi ya mkono"
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
            "summary": "Kazi tano zinaendeshwa kuanzia 05:30 hadi 18:30."
          },
          "runs": {
            "number": "02.11",
            "title": "Muda wa kutengeneza, mizunguko 14 ya mwisho",
            "axis": "sekunde",
            "readout": "Mzunguko {n} · sekunde {value}",
            "slowLabel": "Mzunguko wa polepole",
            "summary": "Mizunguko mingi ilichukua sekunde 35–41."
          }
        },
        "log": {
          "title": "Kumbukumbu za wakala",
          "caption": "Wakala anaandaa rasimu. Mtu anaidhinisha chochote kinachotoka nje ya taasisi.",
          "items": [
            {
              "time": "05:30",
              "text": "Ripoti ya PAR ya kila siku imetumwa kwa mameneja 14 wa matawi.",
              "status": "sent"
            },
            {
              "time": "05:58",
              "text": "Ripoti ya bodi ya Jumatatu imetumwa kwa wapokeaji 9.",
              "status": "sent"
            },
            {
              "time": "07:02",
              "text": "PAR30 imevuka kikomo cha 5.0% Mbeya (7.2%) na Dodoma (5.4%). Rasimu ya ujumbe imeandaliwa kwa Mkuu wa Mikopo.",
              "status": "awaiting"
            },
            {
              "time": "07:09",
              "text": "Mkuu wa Mikopo ameidhinisha ujumbe; umetumwa kwa mameneja wa matawi yote mawili.",
              "status": "sent"
            },
            {
              "time": "07:15",
              "text": "Rasimu za vikumbusho 41 vya malimbikizo zinasubiri kukaguliwa na maafisa mikopo.",
              "status": "queued"
            }
          ]
        },
        "read": [
          {
            "figure": "schedule",
            "anchor": "05:30",
            "shows": "Ripoti ya PAR inawafikia mameneja 14 saa 05:30, kabla matawi hayajafunguliwa.",
            "decision": "Mameneja wanaanza siku wakiwa na namba za jana."
          },
          {
            "figure": "runs",
            "anchor": "7",
            "shows": "Mzunguko mmoja ulichukua sekunde 61, wakati muda wa kati ni sekunde 38.",
            "decision": "Mzunguko wa polepole unaonekana kabla haujawa ripoti iliyochelewa."
          },
          {
            "figure": "log",
            "anchor": "07:02",
            "shows": "Wakala aliandaa rasimu ya ujumbe; mtu aliuidhinisha dakika saba baadaye.",
            "decision": "Unachagua hatua zipi zibaki mikononi mwa mtu."
          }
        ]
      }
    }
  },
  "estimator": {
    "eyebrow": "02 — Hesabu zako",
    "title": "Saa za kazi zinakwenda wapi?",
    "lead": "Weka namba za ripoti moja uone inavyoigharimu timu yako.",
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
      "help": "Inaonyesha gharama kwa shilingi. Taarifa hii inabaki kwenye kifaa chako."
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
    "note": "Ni makadirio, si nukuu ya bei. Hakuna kinachotumwa usipotuma ujumbe.",
    "addToMessage": "Ongeza hii kwenye ujumbe wangu",
    "added": "Imeongezwa kwenye ujumbe wako. Jaza jina lako ili kuutuma.",
    "messageTemplate": "Tunaandaa ripoti {count} kila {period}. Kila moja inaandaliwa na {personWord} {people} kwa takriban saa {hours}, yaani takriban saa {hoursPerYear} kwa mwaka.",
    "error": {
      "range": "Tumia namba kati ya {min} na {max}."
    }
  },
  "process": {
    "eyebrow": "03 — Tunavyofanya kazi",
    "title": "Jinsi mradi unavyoendeshwa.",
    "lead": "Kila mfumo ni tofauti; njia yetu ya kuujenga haibadiliki.",
    "receivePrefix": "Unapokea:",
    "steps": [
      {
        "index": "03.1",
        "title": "Kuchunguza",
        "description": "Tunaelewa mtiririko wako wa kazi na kubaini kazi ya mkono.",
        "receive": "takwimu muhimu, na tathmini ya wazi kama mfumo unastahili kujengwa."
      },
      {
        "index": "03.2",
        "title": "Kusanifu",
        "description": "Tunapanga mfumo kulingana na jinsi unavyofanya kazi.",
        "receive": "mpango unaouidhinisha kabla hatujaanza kujenga."
      },
      {
        "index": "03.3",
        "title": "Kujenga",
        "description": "Tunaujenga kwa usalama, katika miundo ambayo timu yako tayari inaitumia.",
        "receive": "mfumo unaofanya kazi, tayari kutumika."
      },
      {
        "index": "03.4",
        "title": "Kusaidia",
        "description": "Tunaifundisha timu yako na kurekebisha mfumo kadri mahitaji yanavyobadilika.",
        "receive": "mafunzo, na mabadiliko unapoyahitaji."
      }
    ],
    "closing": "Kitu chenye manufaa kinaifikia timu yako mapema, si kila kitu mwishoni."
  },
  "security": {
    "title": "Kutoka kazi ya mkono iliyotawanyika hadi mfumo wa kiotomatiki ulio wazi.",
    "ledger": {
      "todayHeading": "Leo",
      "withHeading": "Ukiwa na DataHub",
      "rows": [
        {
          "today": "Ripoti huchukua saa au siku",
          "with": "Ripoti zinatengenezwa kwa sekunde"
        },
        {
          "today": "Watu tofauti wanapata namba tofauti",
          "with": "Jibu moja kwa wote"
        },
        {
          "today": "Mafaili yametawanyika kwenye barua pepe na folda",
          "with": "Sehemu moja, kwenye kivinjari chochote"
        },
        {
          "today": "Ripoti hupangwa na kutumwa kwa barua pepe kwa mkono",
          "with": "Zinawasilishwa kwa ratiba"
        },
        {
          "today": "Hakuna picha ya sasa ya utendaji",
          "with": "Takwimu za sasa kwa mtazamo mmoja"
        }
      ]
    },
    "data": {
      "title": "Data yako inabaki kuwa yako.",
      "body": "Katika kila mfumo tunaoujenga, usalama unaanza na mstari wa kwanza wa msimbo.",
      "items": [
        {
          "term": "Ufikiaji kwa nafasi ya kazi",
          "definition": "Kila mtu anaona tu kile ambacho nafasi yake ya kazi inaruhusu."
        },
        {
          "term": "Taarifa za kuingia zilizosimbwa",
          "definition": "Nywila na siri za kuunganisha mifumo zinahifadhiwa zikiwa zimesimbwa."
        },
        {
          "term": "Maingizo yanayohakikiwa",
          "definition": "Seva inakagua kila kinachoingizwa kabla ya kutumika."
        },
        {
          "term": "Miingiliano iliyoimarishwa",
          "definition": "Miingiliano inakubali tu kile inachohitaji."
        },
        {
          "term": "Mawakala wenye mipaka",
          "definition": "Wakala wa AI hapati ufikiaji zaidi ya mtu anayemfanyia kazi."
        },
        {
          "term": "Haishirikishwi kamwe",
          "definition": "Data yako haishirikishwi wala kuuzwa kamwe."
        }
      ]
    },
    "proof": {
      "title": "Ushahidi kwenye ukurasa huu",
      "lead": "Madai kuhusu tovuti hii unayoweza kuhakiki mwenyewe.",
      "lines": [
        "Skripti: zetu pekee. Msimbo mpya wa usalama kwa kila ziara unazuia skripti zilizopachikwa zisiendeshwe.",
        "Vifuatiliaji na programu za takwimu za makampuni mengine: hakuna.",
        "Fonti na picha: zinatolewa kutoka datahub.co.tz.",
        "Vidakuzi (cookies): hakuna. Chaguo zako zinabaki kwenye kivinjari chako.",
        "Fomu ya mawasiliano: inakaguliwa kwenye seva yetu, inaruhusu jumbe chache tu kwa kila anwani ya mtandao, na inachuja barua taka za kiotomatiki."
      ],
      "showPolicy": "Onyesha sera kamili",
      "policyNote": "Kichwa cha Content-Security-Policy cha ukurasa huu, msimbo wa kila ziara ukiwa umefichwa.",
      "check": "Kagua mwenyewe vichwa vyetu vya usalama"
    }
  },
  "team": {
    "eyebrow": "05 — Timu",
    "title": "Watu utakaofanya nao kazi.",
    "lead": "Hivi ndivyo tunavyogawana kazi kwenye mradi wako.",
    "members": {
      "cto": {
        "index": "05.1",
        "name": "Daniel C. Masubi",
        "role": "Afisa Mkuu wa Teknolojia",
        "bio": "Anajenga mifumo, kuanzia mitiririko ya data hadi mawakala, na anawajibika kwa usalama wa data yako.",
        "alt": "Daniel C. Masubi, Afisa Mkuu wa Teknolojia, DataHub"
      },
      "operations": {
        "index": "05.2",
        "name": "Kanuda L. Sasi",
        "role": "Mkuu wa Uendeshaji",
        "bio": "Anasimamia utekelezaji, kuanzia wigo wa kazi hadi msaada, ili kilichokubaliwa ndicho kifike.",
        "alt": "Kanuda L. Sasi, Mkuu wa Uendeshaji, DataHub"
      },
      "marketing": {
        "index": "05.3",
        "name": "Yohana K. Mussa",
        "role": "Mkuu wa Masoko",
        "bio": "Mara nyingi ndiye utakayezungumza naye kwanza: anabainisha tatizo lako halisi na anakujulisha maendeleo.",
        "alt": "Yohana K. Mussa, Mkuu wa Masoko, DataHub"
      }
    }
  },
  "faq": {
    "eyebrow": "06 — Maswali",
    "title": "Maswali ambayo watu huuliza kabla ya kuanza.",
    "aside": "Hujapata jibu hapa?",
    "asideWhatsapp": "Tuulize kupitia WhatsApp",
    "asideEmail": "Tutumie barua pepe",
    "indexPrefix": "S",
    "items": [
      {
        "q": "DataHub inafanya nini?",
        "a": "Tunajenga dashibodi, ripoti za kiotomatiki na mawakala wa AI kwa taasisi za Tanzania."
      },
      {
        "q": "Mnapatikana wapi?",
        "a": "Dar es Salaam. Tunafanya kazi kote Tanzania na nje ya nchi, mara nyingi kwa mbali, na ofisini kwako inapohitajika."
      },
      {
        "q": "Dashibodi inagharimu kiasi gani?",
        "a": "Inategemea kazi, kwa hiyo tunapanga wigo kabla ya kutaja bei. Mazungumzo ya kwanza ni bure."
      },
      {
        "q": "Je, data yetu iko salama?",
        "a": "Ndiyo. Kila mtu anaona tu kile ambacho nafasi yake ya kazi inaruhusu, na data yako haishirikishwi wala kuuzwa kamwe."
      },
      {
        "q": "Mradi unachukua muda gani?",
        "a": "Wiki kadhaa kwa dashibodi au ripoti moja; zaidi kwa mfumo wa idara kadhaa."
      }
    ]
  },
  "contact": {
    "eyebrow": "07 — Mawasiliano",
    "title": "Anza na ripoti moja.",
    "lead": "Tueleze unachotumia sasa na unachotaka badala yake.",
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
        "Tunakujibu ili kupanga mazungumzo mafupi.",
        "Tunakubaliana pamoja kinachostahili kujengwa.",
        "Unapokea wigo wa kazi kwa maandishi kabla kazi yoyote haijaanza."
      ]
    },
    "privacy": "Tunatumia taarifa zako kukujibu tu.",
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
        "placeholder": "Kwa mfano: ripoti yetu ya kila wiki ya matawi huchukua siku mbili kuandaliwa.",
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
        "tooShort": "Tafadhali andika angalau herufi 10.",
        "tooLong": "Tafadhali ujumbe wako usizidi herufi 4,000."
      }
    },
    "submit": "Tuma ujumbe",
    "sending": "Inatuma…",
    "status": {
      "checkFields": "Tafadhali kagua sehemu zilizowekwa alama.",
      "rateLimited": "Jumbe nyingi mno kutoka kwenye muunganisho huu. Tafadhali subiri dakika chache, au tutumie ujumbe WhatsApp.",
      "invalid": "Hatukuweza kusoma ujumbe wako. Tafadhali jaribu tena.",
      "server": "Ujumbe wako haukufika. Tafadhali jaribu tena, au tutumie ujumbe WhatsApp.",
      "network": "Hakuna muunganisho. Kagua intaneti yako kisha ujaribu tena.",
      "loading": "Inapakia… au tutumie WhatsApp kwa {number}.",
      "loadingNoNumber": "Inapakia… au tuandikie kwa {email}."
    },
    "success": {
      "title": "Asante.",
      "body": "Ujumbe wako umetufikia, na tutakujibu.",
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
    "about": "Dashibodi, otomatiki ya ripoti na mawakala wa AI kwa taasisi za Tanzania.",
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
    "legal": "© {year} DataHub"
  },
  "servicePage": {
    "breadcrumbLabel": "Njia ya ukurasa",
    "home": "Mwanzo",
    "cta": "Anza mazungumzo",
    "allServices": "Tazama huduma zote",
    "signals": {
      "eyebrow": "01 — Tatizo",
      "title": "Dalili kwamba unaihitaji"
    },
    "deliverables": {
      "eyebrow": "02 — Matokeo",
      "title": "Utakachopata"
    },
    "sample": {
      "eyebrow": "03 — Mfano",
      "title": "Ione kwenye mfano",
      "lead": "Chati kutoka dashibodi zetu za mfano, na uamuzi ambao kila moja inausaidia."
    },
    "faq": {
      "eyebrow": "04 — Maswali",
      "title": "Maswali kuhusu {service}"
    },
    "others": {
      "eyebrow": "05 — Huduma zaidi",
      "title": "Pia kutoka DataHub"
    }
  },
  "privacy": {
    "title": "Taarifa ya faragha",
    "updated": "Ilisasishwa mwisho {date}",
    "intro": "Kile DataHub inachokusanya kupitia tovuti hii, na kwa nini. Imeandikwa kwa kuzingatia Sheria ya Ulinzi wa Taarifa Binafsi ya Tanzania, 2022.",
    "sections": [
      {
        "title": "Tunachokusanya",
        "body": "Kile tu unachoandika kwenye fomu ya mawasiliano: jina lako, barua pepe, simu, taasisi, huduma unayovutiwa nayo na ujumbe wako. Ikiwa umefika kupitia mojawapo ya machapisho yetu, tunahifadhi pia lebo ya kampeni iliyo kwenye kiungo (kwa mfano “whatsapp”)."
      },
      {
        "title": "Tusichokusanya",
        "body": "Hakuna vidakuzi (cookies), programu za takwimu wala vifuatiliaji vya matangazo. Chaguo lako la mandhari na lugha linabaki kwenye kivinjari chako."
      },
      {
        "title": "Muunganisho wako",
        "body": "Ili kuzuia barua taka za kiotomatiki, tunaweka kikomo cha jumbe ambazo muunganisho mmoja unaweza kutuma. Kwa ajili hiyo tunahifadhi anwani yako ya IP katika hali iliyofichwa (hashed), si anwani yenyewe."
      },
      {
        "title": "Kwa nini tunazitumia",
        "body": "Kukujibu. Hatuuzi, hatukodishi wala hatushirikishi taarifa zako."
      },
      {
        "title": "Chaguo zako",
        "body": "Ili kuona, kurekebisha au kufuta taarifa tulizo nazo kukuhusu, tuandikie {email}."
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
    "figurePrefix": "Chati ya mfano:"
  }
} satisfies Dictionary;

export default sw;
