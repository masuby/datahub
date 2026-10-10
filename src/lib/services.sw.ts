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
    "tagline": "Sehemu moja ambapo timu yako hufanya maamuzi",
    "intro": [
      "Taasisi nyingi nchini Tanzania hazikosi data. Kinachokosekana ni sehemu moja ya kuaminika ya kuiangalia. Takwimu zipo — kwenye mfumo mkuu, kwenye mafaili ya Excel ya matawi, kwenye ripoti ambayo mtu huitoa kwenye mfumo kila Jumatatu — lakini hakuna anayeweza kujibu swali rahisi bila watu watatu kukagua mafaili matatu.",
      "Tunajenga dashibodi inayomaliza tatizo hilo. Takwimu za moja kwa moja, zenye rangi zinazoonyesha hali ikilinganishwa na lengo, zilizochambuliwa kwa tawi, idara au afisa, na zinazosomeka vizuri kwenye simu ukiwa njiani kuelekea kikaoni."
    ],
    "signals": [
      "Watu wawili wanajibu swali moja kwa takwimu mbili tofauti",
      "Ripoti ya uongozi inaandaliwa kwa mkono, na inapofika tayari imepitwa na wakati",
      "Hakuna anayeweza kuona utendaji wa tawi au idara bila kumwomba mtu atoe taarifa kwenye mfumo",
      "Maamuzi yanasubiri faili la Excel ambalo mtu mmoja tu ndiye anayejua kulisasisha"
    ],
    "deliverables": [
      {
        "title": "Mwonekano wa uongozi na wa idara",
        "desc": "Muhtasari unaoeleweka kwa kutazama mara moja kwa ajili ya uongozi, na mwonekano wa kina kwa wale wanaopaswa kuchukua hatua kwenye undani wa mambo."
      },
      {
        "title": "KPI zinazopimwa kiotomatiki",
        "desc": "Malengo, matokeo halisi na pengo lililopo kati yao, kwa rangi tofauti ili matatizo yajitokeze yenyewe bila mtu kuyatafuta."
      },
      {
        "title": "Kufuatilia hadi kwenye rekodi husika",
        "desc": "Anza na jumla kuu, kisha bofya hadi kwenye tawi, afisa, na muamala wenyewe. Hakuna mahali unapokwama."
      },
      {
        "title": "Mfumo mmoja, jibu moja",
        "desc": "Kila mwonekano unakokotolewa kwa mantiki ileile, hivyo idara za fedha na uendeshaji zinaacha kubishana kuhusu faili lipi ndilo sahihi."
      }
    ],
    "faq": [
      {
        "q": "Mnatengeneza dashibodi maalum au mnatumia Power BI?",
        "a": "Tunafanya yote mawili, kulingana na mahitaji yenu. Power BI na zana zinazofanana zinafaa pale ambapo data tayari iko safi na maswali ni ya kawaida. Pale ambapo mantiki ya ripoti zenu, mtiririko wa idhini au muundo wa matawi ni wa kipekee kwa taasisi yenu, dashibodi maalum inafaa zaidi na ni nafuu zaidi kuiendesha kwa muda mrefu."
      },
      {
        "q": "Data inatoka wapi?",
        "a": "Popote ilipo sasa hivi — kwenye mfumo wenu wa core banking au ERP, database ya SQL, mafaili ya Excel yanayotolewa kwenye mifumo, au mchanganyiko wa yote matatu. Sehemu ya kazi ni kujenga mfumo unaoikusanya data hiyo pamoja kwa uhakika, ili mtu yeyote asilazimike tena kuiunganisha kwa mkono."
      },
      {
        "q": "Timu yetu inaweza kuitumia bila mafunzo?",
        "a": "Dashibodi imeundwa ili isomeke na kueleweka bila mwongozo, na tunaifundisha timu yenu kuitumia kama sehemu ya makabidhiano. Kama mtu anahitaji maelezo ili kuelewa chati, basi chati hiyo ndiyo yenye kasoro."
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
      "Kuna mtu ofisini kwako anayefungua faili lile lile kila wiki, anachuja kolamu zile zile, ananakili namba zile zile kwenye slaidi ile ile, anaipanga vizuri, kisha anaituma kwa barua pepe kwa watu wale wale. Inachukua saa kadhaa. Mara moja moja makosa hutokea. Na wiki ijayo kazi hiyo hiyo inarudiwa.",
      "Mchakato huo wote unaweza kufanywa na mfumo. Ripoti inajitengeneza yenyewe, ikiwa imepangiliwa sawasawa kila mara, na inafika kwenye barua pepe za wahusika kwa wakati uliopangwa — awepo mtu ofisini au asiwepo."
    ],
    "signals": [
      "Ripoti ya kila wiki au kila mwezi inamchukua mtu saa kadhaa za kunakili na kubandika",
      "Ripoti zinachelewa kwa sababu mtu anayeziandaa hakuwepo kazini",
      "Namba ile ile inaandikwa kwenye mafaili kadhaa, na baada ya muda mafaili hayo hayalingani tena",
      "Mwisho wa mwezi ni kukesha ofisini mkitengeneza upya faili lile lile la Excel"
    ],
    "deliverables": [
      {
        "title": "Ripoti kwa ratiba au papo hapo",
        "desc": "Ripoti zinatengenezwa kwa ratiba iliyopangwa, au papo hapo mtu anapoomba ripoti — bila kumsubiri mtu yeyote."
      },
      {
        "title": "Ripoti za Excel na PowerPoint",
        "desc": "Ripoti zilizopangiliwa vizuri, katika miundo ile ile ambayo taasisi yako tayari inaitumia, kwa kubofya mara moja tu."
      },
      {
        "title": "Kutuma kiotomatiki",
        "desc": "Kila mhusika anatumiwa ripoti yake kwa barua pepe, na kila mmoja anaona kile tu kinachomhusu kulingana na nafasi yake."
      },
      {
        "title": "Matokeo yale yale kila mara",
        "desc": "Mantiki ile ile inatumika kila ripoti inapotengenezwa, hivyo namba zinaweza kuthibitishwa tena wakati wowote, na makosa hayawi tena jambo la kawaida kila mwezi."
      }
    ],
    "faq": [
      {
        "q": "Mnaweza kufanya ripoti tunazoandaa sasa kwenye Excel zijitengeneze kiotomatiki?",
        "a": "Ndiyo, na mara nyingi hapo ndipo tunapoanzia. Tunachukua faili la Excel ambalo timu yako inalitunza sasa, tunaielewa mantiki iliyomo ndani yake, kisha tunaijenga upya kama mfumo unaotoa matokeo yale yale kiotomatiki. Ripoti yako inabaki na muonekano ule ule ambao watu wameshauzoea."
      },
      {
        "q": "Je, timu yetu itapoteza udhibiti wa ripoti?",
        "a": "Hapana, ni kinyume chake. Mfumo unaondoa kazi ya kuchapa, si maamuzi. Timu yako bado ndiyo inayoamua ripoti iseme nini, na inaweza kubadilisha malengo, viwango na wapokeaji yenyewe — ila tu haitalazimika tena kuiandaa kwa mkono."
      },
      {
        "q": "Itakuwaje tukihitaji ripoti mpya?",
        "a": "Mfumo ukishawekwa, kuongeza ripoti mpya ni kazi ndogo, si mradi mpya, kwa sababu data tayari inapita kwenye mfumo na imeshahakikiwa."
      }
    ]
  },
  {
    "slug": "ai-agents",
    "navLabel": "Mawakala wa AI",
    "title": "Kubuni Mawakala wa AI na Uendeshaji wa Kiotomatiki Tanzania",
    "metaTitle": "Mawakala wa AI (AI Agents) kwa Biashara Tanzania",
    "metaDescription": "Mawakala wa AI kwa biashara Tanzania: wanasoma data za uendeshaji, wanafupisha kilichobadilika, wanaandaa ripoti na kufuatilia kazi zilizosalia. Dar es Salaam.",
    "tagline": "Mfumo unaosoma, unaoamua na unaochukua hatua",
    "intro": [
      "Mazungumzo mengi kuhusu AI kwenye biashara huishia bila matokeo kwa sababu huanza na teknolojia badala ya kazi yenyewe. Wakala wa AI anastahili kujengwa pale tu panapokuwa na kazi mahususi ambayo mtu anaifanya kwa sasa kwa kusoma taarifa fulani kisha kuchukua hatua kutokana nayo.",
      "Mawakala wa aina hiyo ndio tunaowajenga: mawakala wanaofuatilia data zenu za uendeshaji, hugundua kilichobadilika, hukieleza kwa lugha rahisi, kisha huchukua hatua inayofuata. Wanaweza kuashiria mambo yasiyo ya kawaida, kuandaa ujumbe wa ufuatiliaji, au kuandika ripoti ambayo kwa sasa mtu anaiandika mwenyewe."
    ],
    "signals": [
      "Kila asubuhi mtu anapitia data zilezile akitafuta mambo yasiyo ya kawaida",
      "Ufuatiliaji husahaulika kwa sababu hakuna mtu aliyepewa jukumu hilo rasmi",
      "Kila wiki mtu anaandika muhtasari uleule kutoka kwenye takwimu zilezile",
      "Mnataka kutumia AI, lakini kila pendekezo mlilowahi kuona halielezi wazi litafanya nini hasa"
    ],
    "deliverables": [
      {
        "title": "Mawakala wanaolenga kazi halisi",
        "desc": "Tunaanzia kwenye kazi ambayo mtu anaifanya leo, si kwenye maonyesho. Kama kazi haistahili wakala wa AI, tunawaambia wazi."
      },
      {
        "title": "Wanategemea data zenu wenyewe",
        "desc": "Mawakala wanafanya kazi kwa kutumia mifumo na takwimu zenu, si maarifa ya jumla, hivyo matokeo yao yanaweza kuhakikiwa kwa kulinganisha na chanzo."
      },
      {
        "title": "Mtu anakagua pale inapohitajika",
        "desc": "Jambo lolote lenye uzito huandaliwa kwanza ili liidhinishwe, halitumwi bila kukaguliwa. Ninyi ndio mnaoamua mpaka huo uwe wapi."
      },
      {
        "title": "Wamejengwa juu ya msingi uleule wa usalama",
        "desc": "Ruhusa hutolewa kulingana na nafasi ya mtumiaji, taarifa zinazoingizwa huhakikiwa, na nywila na funguo za kuingia husimbwa kwa njia fiche. Wakala hapati mamlaka zaidi ya mtu anayemfanyia kazi."
      }
    ],
    "faq": [
      {
        "q": "Je, huduma hii inafaa kwa biashara ya Kitanzania, au ni kwa makampuni makubwa tu?",
        "a": "Inategemea kazi yenyewe, si ukubwa wa kampuni. Kama mtu anatumia saa moja kila siku kusoma data na kuchukua hatua kutokana nazo, kazi hiyo inastahili kufanywa kiotomatiki, iwe taasisi ina wafanyakazi kumi na watano au mia tano."
      },
      {
        "q": "Je, wakala wa AI atafanya maamuzi bila sisi?",
        "a": "Pale tu mtakapoamua iwe hivyo. Mawakala wengi tunaowajenga huandaa na kupendekeza, kisha mtu anaidhinisha. Hatua za kiotomatiki kabisa tunazitumia tu kwa kazi zenye hatari ndogo na zilizo wazi."
      },
      {
        "q": "Gharama ya kuendesha wakala wa AI ni kiasi gani hasa?",
        "a": "Kuna gharama ya kumjenga, kisha gharama ya uendeshaji inayotegemea kiasi cha data anachochakata. Tunaikadiria gharama hiyo kwa uwazi kabla hamjaamua, kwa sababu wakala anayegharimu zaidi ya thamani ya kazi anayoifanya hana faida."
      }
    ]
  }
];
