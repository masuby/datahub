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
    "metaDescription": "Dashibodi maalum na uchambuzi wa takwimu za biashara kwa taasisi za Tanzania. KPI za moja kwa moja kwa kila tawi na idara, zilizoundwa kulingana na jinsi timu yako inavyofanya maamuzi. Dar es Salaam.",
    "tagline": "Sehemu moja ya kufanyia maamuzi",
    "intro": [
      "Taasisi nyingi nchini Tanzania zina data, lakini hazina sehemu moja ya kuiangalia ambayo kila mtu anaiamini.",
      "Leo swali rahisi linahitaji watu watatu kukagua mafaili matatu. Dashibodi inalijibu kwenye simu, kabla kikao hakijaanza."
    ],
    "signals": [
      "Swali moja linajibiwa kwa namba mbili tofauti",
      "Ripoti ya uongozi inafika ikiwa imeshapitwa na wakati",
      "Maamuzi yanasubiri faili la Excel ambalo mtu mmoja tu anaweza kulisasisha"
    ],
    "deliverables": [
      {
        "title": "Mwonekano wa uongozi na wa idara",
        "desc": "Muhtasari kwa uongozi, na undani kwa wanaochukua hatua."
      },
      {
        "title": "KPI zinazopimwa kiotomatiki",
        "desc": "Malengo, matokeo halisi na pengo, kwa rangi ili matatizo yaonekane haraka."
      },
      {
        "title": "Kufuatilia hadi kwenye rekodi husika",
        "desc": "Kuanzia jumla kuu hadi tawi, afisa na muamala wenyewe."
      },
      {
        "title": "Mfumo mmoja, jibu moja",
        "desc": "Kila mwonekano unatumia mantiki ileile, hivyo idara za fedha na uendeshaji zinaona namba ileile."
      }
    ],
    "faq": [
      {
        "q": "Mnatengeneza dashibodi maalum au mnatumia Power BI?",
        "a": "Vyote viwili. Power BI inafaa pale data iko safi na maswali ni ya kawaida; pale mantiki ya ripoti zako au muundo wa matawi ni wa kipekee, dashibodi maalum ni nafuu zaidi kuiendesha kwa muda mrefu."
      },
      {
        "q": "Data inatoka wapi?",
        "a": "Popote ilipo sasa: mfumo wako wa core banking au ERP, database au mafaili ya Excel. Tunajenga mtiririko wa data unaoiunganisha yote."
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
    "metaDescription": "Ripoti za Excel na PowerPoint mnazoandaa kila wiki zijitengeneze kiotomatiki: kwa ratiba, zikiwa zimepangiliwa na kutumwa kwa wahusika. Dar es Salaam, Tanzania.",
    "tagline": "Kazi ya saa nyingi, sasa kwa sekunde chache",
    "intro": [
      "Kila wiki mtu ananakili namba zilezile kwenye slaidi zilezile na kuzituma kwa barua pepe. Inachukua saa kadhaa, na makosa hujipenyeza.",
      "Tunaigeuza kazi hiyo kuwa mfumo unaotengeneza ripoti na kuituma kwa ratiba, hata kama hakuna mtu ofisini."
    ],
    "signals": [
      "Ripoti zinachelewa mtu mmoja akiwa hayupo",
      "Namba moja inaandikwa kwenye mafaili kadhaa, na hayalingani",
      "Mwisho wa mwezi ni kukesha ukitengeneza upya faili lilelile la Excel"
    ],
    "deliverables": [
      {
        "title": "Ripoti kwa ratiba au papo hapo",
        "desc": "Kwa ratiba, au papo hapo mtu anapoomba."
      },
      {
        "title": "Ripoti za Excel na PowerPoint",
        "desc": "Ripoti zilizopangiliwa, katika mafaili ambayo taasisi yako tayari inayasambaza."
      },
      {
        "title": "Kutuma kiotomatiki",
        "desc": "Kila mpokeaji anapata kile tu ambacho nafasi yake inaruhusu kuona."
      },
      {
        "title": "Matokeo yaleyale kila mara",
        "desc": "Mantiki ileile kila ripoti inapotengenezwa, hivyo namba zinaweza kuthibitishwa tena."
      }
    ],
    "faq": [
      {
        "q": "Mnaweza kufanya ripoti tunazoandaa sasa kwenye Excel zijitengeneze kiotomatiki?",
        "a": "Ndiyo. Tunaielewa mantiki iliyo ndani ya faili lako la Excel na kuijenga upya kama mfumo, na ripoti inabaki na muonekano ambao watu wameuzoea."
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
    "metaDescription": "Mawakala wa AI kwa biashara Tanzania: wanasoma data za uendeshaji, wanafupisha kilichobadilika, wanaandaa ripoti na kufuatilia kazi zilizosalia. Dar es Salaam.",
    "tagline": "Programu inayosoma, kisha inaandaa rasimu ya hatua inayofuata",
    "intro": [
      "Miradi mingi ya AI huanza na teknolojia, kisha hukwama. Wakala anastahili kujengwa pale ambapo kazi ya mtu ni kusoma data na kuchukua hatua.",
      "Mawakala wetu hufuatilia data zako za uendeshaji, hugundua kilichobadilika na kuchukua hatua inayofuata, kama kuonyesha jambo lisilo la kawaida au kuandaa rasimu ya ufuatiliaji."
    ],
    "signals": [
      "Kila asubuhi mtu anapitia data zilezile akitafuta yasiyo ya kawaida",
      "Ufuatiliaji unasahaulika kwa sababu si jukumu la mtu yeyote",
      "Kila wiki mtu anaandika muhtasari uleule kutoka kwenye namba zilezile"
    ],
    "deliverables": [
      {
        "title": "Mawakala wanaolenga kazi halisi",
        "desc": "Tunaanzia kwenye kazi ambayo mtu anaifanya leo, si kwenye maonyesho. Kama haistahili wakala, tunakuambia."
      },
      {
        "title": "Wanategemea data zako mwenyewe",
        "desc": "Wanafanya kazi kwa kutumia mifumo yako, hivyo kazi yao inaweza kuhakikiwa kwenye chanzo."
      },
      {
        "title": "Mtu anakagua pale inapohitajika",
        "desc": "Jambo lolote lenye uzito huandaliwa kama rasimu ili liidhinishwe. Wewe ndiye unayeamua mpaka huo uwe wapi."
      },
      {
        "title": "Wamejengwa juu ya msingi uleule wa usalama",
        "desc": "Mawakala wanafuata kanuni zilezile za ufikiaji kama wafanyakazi wako."
      }
    ],
    "faq": [
      {
        "q": "Je, huduma hii inafaa kwa biashara ya Kitanzania, au ni kwa makampuni makubwa tu?",
        "a": "Inategemea kazi, si ukubwa wa kampuni. Ikiwa mtu anatumia saa moja kila siku kusoma data na kuchukua hatua, kazi hiyo inastahili kufanywa kiotomatiki."
      },
      {
        "q": "Je, wakala wa AI atafanya maamuzi bila sisi?",
        "a": "Pale tu utakapoamua iwe hivyo. Mawakala wetu wengi huandaa rasimu na mtu anaidhinisha; hatua za kiotomatiki kabisa ni kwa kazi zenye hatari ndogo tu."
      },
      {
        "q": "Gharama ya kuendesha wakala wa AI ni kiasi gani hasa?",
        "a": "Kuna gharama ya kumjenga, kisha gharama ya uendeshaji inayotegemea kiasi cha data anachochakata. Tunazikadiria zote mbili kabla hujaamua."
      }
    ]
  }
];
