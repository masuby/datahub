import type { Service } from "./services";

/**
 * Kiswahili service-page content. Same shape, slugs and order as SERVICES in
 * services.ts — the English file is the source; this is its translation,
 * written and then independently reviewed for natural Tanzanian business
 * Kiswahili. metaTitle/metaDescription are phrased the way people search in
 * Kiswahili, not translated word for word.
 */
export const SERVICES_SW: Service[] = [
  {
    "slug": "dashboards",
    "navLabel": "Dashibodi",
    "title": "Dashibodi na Uchambuzi wa Takwimu za Biashara Tanzania",
    "metaTitle": "Dashibodi za Biashara na Takwimu Tanzania",
    "metaDescription": "Dashibodi maalum na uchambuzi wa takwimu za biashara kwa taasisi za Tanzania: KPI za moja kwa moja kwa kila tawi na idara, zilizoundwa kulingana na jinsi timu yako inavyoamua. Dar es Salaam.",
    "tagline": "Sehemu moja ya kufanyia maamuzi",
    "intro": "Badala ya watu watatu kukagua mafaili matatu, dashibodi moja ambayo kila mtu anaiamini inajibu swali kwenye simu, kabla kikao hakijaanza.",
    "signals": [
      "Swali moja linajibiwa kwa namba mbili tofauti",
      "Ripoti ya uongozi inafika ikiwa imepitwa na wakati",
      "Maamuzi yanasubiri faili la Excel la mtu mmoja"
    ],
    "deliverables": [
      {
        "title": "Mwonekano wa uongozi na wa idara",
        "desc": "Muhtasari kwa viongozi, na undani kwa wanaochukua hatua."
      },
      {
        "title": "KPI zinazopimwa kiotomatiki",
        "desc": "Lengo, matokeo na pengo, kwa rangi."
      },
      {
        "title": "Kufuatilia hadi kwenye rekodi husika",
        "desc": "Kuanzia jumla hadi tawi, afisa na muamala."
      },
      {
        "title": "Mfumo mmoja, jibu moja",
        "desc": "Mantiki ileile kila mahali, hivyo idara za fedha na uendeshaji zinaona namba moja."
      }
    ],
    "faq": [
      {
        "q": "Mnatengeneza dashibodi maalum au mnatumia Power BI?",
        "a": "Vyote viwili. Power BI inafaa data safi na maswali ya kawaida; dashibodi maalum inafaa mantiki iliyo ya kwako pekee."
      },
      {
        "q": "Data inatoka wapi?",
        "a": "Popote ilipo sasa: core banking, ERP, database au mafaili ya Excel. Tunaiunganisha yote."
      },
      {
        "q": "Timu yetu inaweza kuitumia bila mafunzo?",
        "a": "Ndiyo, na bado tunaipa mafunzo. Chati ikihitaji maelezo, tunairekebisha."
      }
    ]
  },
  {
    "slug": "automation",
    "navLabel": "Ripoti Kiotomatiki",
    "title": "Ripoti Kiotomatiki kwa Biashara na Taasisi za Tanzania",
    "metaTitle": "Ripoti za Excel Kiotomatiki Tanzania",
    "metaDescription": "Ripoti za Excel na PowerPoint ambazo timu yako huandaa kila wiki zijitengeneze kiotomatiki: kwa ratiba, zimepangiliwa na kutumwa. Dar es Salaam, Tanzania.",
    "tagline": "Kazi ya saa nyingi, kwa sekunde",
    "intro": "Ripoti ambayo mtu huiandaa kwa mkono kila wiki inakuwa mfumo unaoitengeneza na kuituma kwa ratiba.",
    "signals": [
      "Ripoti zinachelewa mtu mmoja akiwa hayupo",
      "Namba ileile inatofautiana kati ya faili na faili",
      "Mwisho wa mwezi ni kukesha ukitengeneza upya faili lilelile la Excel"
    ],
    "deliverables": [
      {
        "title": "Ripoti kwa ratiba au papo hapo",
        "desc": "Kwa ratiba, au papo hapo mtu anapoomba."
      },
      {
        "title": "Ripoti za Excel na PowerPoint",
        "desc": "Zimepangiliwa, katika mafaili ambayo tayari unayasambaza."
      },
      {
        "title": "Kutuma kiotomatiki",
        "desc": "Kila mpokeaji anapata toleo linalolingana na nafasi yake."
      },
      {
        "title": "Matokeo yaleyale kila mara",
        "desc": "Mantiki ileile kila mara, hivyo namba zinaweza kuthibitishwa tena."
      }
    ],
    "faq": [
      {
        "q": "Mnaweza kufanya ripoti tunazoandaa sasa kwenye Excel zijitengeneze kiotomatiki?",
        "a": "Ndiyo. Tunajenga upya mantiki ya faili lako la Excel kama mfumo, na ripoti inabaki na muonekano ambao watu wameuzoea."
      },
      {
        "q": "Je, timu yetu itapoteza udhibiti wa ripoti?",
        "a": "Hapana. Mfumo unaondoa kazi ya kuchapa, si maamuzi: timu yako bado inaweka malengo, viwango na wapokeaji."
      },
      {
        "q": "Itakuwaje tukihitaji ripoti mpya?",
        "a": "Mtiririko wa data ukishakuwepo, ripoti mpya ni kazi ndogo, si mradi mpya."
      }
    ]
  },
  {
    "slug": "ai-agents",
    "navLabel": "Mawakala wa AI",
    "title": "Kubuni Mawakala wa AI na Uendeshaji wa Kiotomatiki Tanzania",
    "metaTitle": "Mawakala wa AI (AI Agents) kwa Biashara Tanzania",
    "metaDescription": "Mawakala wa AI kwa taasisi za Tanzania wanaosoma data za uendeshaji, kufupisha kilichobadilika na kuandaa ripoti na ufuatiliaji. Dar es Salaam.",
    "tagline": "Husoma data, huandaa hatua ijayo",
    "intro": "Wakala anastahili kujengwa pale ambapo kazi ya mtu ni kusoma data na kuchukua hatua: kuonyesha yasiyo ya kawaida, kuandaa rasimu za ufuatiliaji.",
    "signals": [
      "Kila asubuhi mtu anapitia data zilezile akitafuta yasiyo ya kawaida",
      "Ufuatiliaji unasahaulika kwa sababu si jukumu la mtu yeyote",
      "Kila wiki mtu anaandika kwa mkono muhtasari uleule"
    ],
    "deliverables": [
      {
        "title": "Mawakala wanaolenga kazi halisi",
        "desc": "Tunaanzia kwenye kazi ambayo mtu anaifanya leo. Kama haihitaji wakala, tunakuambia."
      },
      {
        "title": "Wanategemea data zako mwenyewe",
        "desc": "Kila matokeo yanaweza kuhakikiwa kwenye mifumo yako mwenyewe."
      },
      {
        "title": "Mtu anakagua pale inapohitajika",
        "desc": "Jambo lolote lenye uzito linasubiri idhini; wewe unaamua mpaka huo uwe wapi."
      },
      {
        "title": "Wamejengwa juu ya msingi uleule wa usalama",
        "desc": "Mawakala wanafuata kanuni zilezile za ufikiaji kama wafanyakazi wako."
      }
    ],
    "faq": [
      {
        "q": "Je, huduma hii inafaa kwa biashara ya Kitanzania, au ni kwa makampuni makubwa tu?",
        "a": "Inategemea kazi, si ukubwa wa kampuni: kazi ya saa moja kila siku ya kusoma data na kuchukua hatua inastahili kufanywa kiotomatiki."
      },
      {
        "q": "Je, wakala wa AI atafanya maamuzi bila sisi?",
        "a": "Pale tu utakapoamua. Mawakala wetu wengi huandaa rasimu na mtu anaidhinisha; otomatiki kamili ni kwa hatua zenye hatari ndogo."
      },
      {
        "q": "Gharama ya kuendesha wakala wa AI ni kiasi gani hasa?",
        "a": "Gharama ya kumjenga, kisha gharama ya uendeshaji inayotegemea data anayochakata. Tunazikadiria zote mbili kabla hujaamua."
      }
    ]
  }
];
