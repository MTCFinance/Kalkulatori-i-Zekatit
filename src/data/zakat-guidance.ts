export type GuidanceKind = "Ajet" | "Hadith";
export const appLocales = [
  "sq",
  "en",
  "de",
  "tr",
  "ar",
  "bs",
  "fr",
  "it",
  "mk",
  "sr",
] as const;

export type AppLocale = (typeof appLocales)[number];

export type LocalizedText = Partial<Record<AppLocale, string>>;

export const getLocalizedText = (
  translations: LocalizedText,
  locale: AppLocale,
) => {
  return translations[locale] ?? translations.sq ?? "";
};
export type GuidanceSlide = {
  id: string;
  kind: "Ajet" | "Hadith";
  title: string;
  arabicText?: string;
  translations: LocalizedText;
  reference: string;
  sourceUrl: string;
  topicId: string;
};

export type GuidanceEvidence = {
  kind: "Ajet" | "Hadith";
  arabicText?: string;
  translations: LocalizedText;
  reference: string;
  sourceUrl: string;
};

export type ScholarNote = {
  scholar: string;
  arabic?: string;
  translationSq: string;
  reference: string;
  scope: string;
};

export type GuidanceTopic = {
  id: string;
  title: string;
  description: string;
  sections?: {
    title: string;
    items: string[];
  }[];
  evidences?: GuidanceEvidence[];
  scholars?: ScholarNote[];
  caution?: string;
};

export const guidanceSlides: GuidanceSlide[] = [
  {
    id: "quran-2-43",
    kind: "Ajet",
    title: "Zekati është pjesë e adhurimit",
    arabicText:
      "وَأَقِيمُوا۟ ٱلصَّلَوٰةَ وَءَاتُوا۟ ٱلزَّكَوٰةَ وَٱرْكَعُوا۟ مَعَ ٱلرَّٰكِعِينَ",
    translations: {
      sq: "Përkthim kuptimor: Kryeni namazin, jepeni zekatin dhe përuluni me ata që përulen.",
      en: "Establish prayer, give zakah, and bow with those who bow.",
    },
    reference: "Kur’an, El-Bekare 2:43",
    sourceUrl: "https://quran.com/2/43",
    topicId: "obligimi",
  },
  {
    id: "quran-9-103",
    kind: "Ajet",
    title: "Zekati pastron pasurinë",
    arabicText:
      "خُذْ مِنْ أَمْوَٰلِهِمْ صَدَقَةًۭ تُطَهِّرُهُمْ وَتُزَكِّيهِم بِهَا وَصَلِّ عَلَيْهِمْ ۖ إِنَّ صَلَوٰتَكَ سَكَنٌۭ لَّهُمْ ۗ وَٱللَّهُ سَمِيعٌ عَلِيمٌ",
    translations: {
      sq: "Përkthim kuptimor: Merr prej pasurisë së tyre sadaka, me të cilën i pastron dhe i begaton.",
      en: "Take from their wealth charity by which you purify and bless them.",
    },
    reference: "Kur’an, Et-Teube 9:103",
    sourceUrl: "https://quran.com/9/103",
    topicId: "obligimi",
  },
  {
    id: "hadith-bukhari-8",
    kind: "Hadith",
    title: "Një prej shtyllave të Islamit",
    translations: {
      sq: "Përkthim kuptimor: Islami është ndërtuar mbi pesë shtylla, ndër to edhe dhënia e zekatit.",
      en: "Islam is built on five pillars, including giving zakah.",
    },
    reference: "Sahih Buhari, 8",
    sourceUrl: "https://sunnah.com/bukhari:8",
    topicId: "obligimi",
  },
  {
    id: "hadith-bukhari-1395",
    kind: "Hadith",
    title: "Nga të pasurit te nevojtarët",
    translations: {
      sq: "Përkthim kuptimor: Zekati merret nga të pasurit dhe u jepet të varfërve.",
      en: "It is taken from their wealthy and given to their poor.",
    },
    reference: "Sahih Buhari, 1395",
    sourceUrl: "https://sunnah.com/bukhari:1395",
    topicId: "perfituesit",
  },
];
export const guidanceTopics: GuidanceTopic[] = [
  {
    id: "obligimi",
    title: "Obligimi i zekatit",
    description:
      "Zekati është adhurim dhe e drejtë e caktuar në pasuri. Ai lidhet me pastrimin shpirtëror, pastrimin e pasurisë dhe kujdesin për nevojtarët.",
    sections: [
      {
        title: "Çfarë duhet të kuptojmë",
        items: [
          "Zekati nuk është vetëm ndihmë vullnetare; ai është obligim kur plotësohen kushtet.",
          "Llogaritja ndryshon sipas llojit të pasurisë: para, tregti, ari, bagëti dhe bereqete.",
          "Kjo platformë ofron ndihmë në llogaritje, por nuk zëvendëson këshillën e dijetarit për raste të veçanta.",
        ],
      },
    ],
    evidences: [
      {
        kind: "Ajet",
        text: "Përkthim kuptimor: Kryeni namazin dhe jepeni zekatin.",
        reference: "Kur’an, El-Bekare 2:43",
        sourceUrl: "https://quran.com/en/al-baqarah/43",
      },
      {
        kind: "Ajet",
        text: "Përkthim kuptimor: Merr prej pasurisë së tyre sadaka, me të cilën i pastron dhe i begaton.",
        reference: "Kur’an, Et-Teube 9:103",
        sourceUrl: "https://quran.com/en/at-tawbah/103",
      },
      {
        kind: "Hadith",
        text: "Përkthim kuptimor: Islami është ndërtuar mbi pesë shtylla, ndër to edhe zekati.",
        reference: "Sahih Buhari, 8",
        sourceUrl: "https://sunnah.com/bukhari:8",
      },
    ],
    scholars: [
      {
        scholar: "Ibn Kajimi",
        arabic:
          "أوجب الشارع الزكاة مواساةً للفقراء، وطهرةً للمال، وعبوديةً للرب.",
        translationSq:
          "Ligjvënësi e bëri zekatin mbështetje për të varfrit, pastrim të pasurisë dhe adhurim ndaj Zotit.",
        reference: "I'lam al-Muwaqqi'in, 3/333",
        scope: "Urtësia dhe qëllimi i zekatit.",
      },
    ],
  },
  {
    id: "kush-e-ka-obligim",
    title: "Kush e ka obligim zekatin",
    description:
      "Në përgjithësi, zekati lidhet me muslimanin që zotëron pasuri të plotë dhe arrin nisabin. Disa kushte ndryshojnë sipas kategorisë së pasurisë.",
    sections: [
      {
        title: "Kushtet orientuese",
        items: [
          "Të jetë musliman dhe të ketë pronësi të plotë mbi pasurinë.",
          "Pasuria të arrijë nisabin e zgjedhur sipas arit ose argjendit.",
          "Për para, tregti, ari dhe disa pasuri të tjera zakonisht merret parasysh kalimi i një viti hënor.",
          "Për bereqetet e tokës, llogaritja lidhet me korrjen; për bagëtinë vlejnë kushte të veçanta.",
          "Borxhet, bizhuteria personale dhe llojet moderne të pasurisë duhet të trajtohen sipas metodës së zgjedhur dhe këshillës fetare.",
        ],
      },
    ],
    evidences: [
      {
        kind: "Hadith",
        text: "Përkthim kuptimor: Allahu e ka bërë zekatin obligim në pasurinë e tyre.",
        reference: "Sahih Buhari, 1395",
        sourceUrl: "https://sunnah.com/bukhari:1395",
      },
    ],
    caution:
      "Mos e përdor këtë faqe për të shpallur dikë automatikisht si të detyruar ose jo të detyruar; rastet personale mund të ndryshojnë.",
  },
  {
    id: "perfituesit",
    title: "Kujt i jepet zekati",
    description:
      "Kur’ani përmend tetë kategori përfituesish. Para pagesës, përdoruesi duhet të verifikojë gjendjen reale të personit ose institucionit.",
    sections: [
      {
        
        title: "Tetë kategoritë e përmendura në Kur’an",
        items: [
          "Të varfrit.",
          "Nevojtarët.",
          "Ata që angazhohen në administrimin e zekatit.",
          "Ata zemrat e të cilëve synohet të afrohen.",
          "Lirimi nga robëria.",
          "Borxhlinjtë që plotësojnë kushtet.",
          "Në rrugë të Allahut.",
          "Udhëtari i mbetur pa mjete.",
        ],
      },
      
      {
        title: "Praktikisht",
        items: [
          "Ruaj dëshmi ose shënim për personin apo organizatën që e ka marrë zekatin.",
          "Mos u mjafto vetëm me përshtypje; verifiko nevojën kur është e mundur.",
          "Organizata përfituese duhet të tregojë qartë se si e ndan zekatin.",
        ],
      },
    ],
    evidences: [
      {
        kind: "Ajet",
        text: "Përkthim kuptimor: Zekati është për të varfrit, nevojtarët dhe kategoritë e tjera të përcaktuara.",
        reference: "Kur’an, Et-Teube 9:60",
        sourceUrl: "https://quran.com/en/at-tawbah/60",
      },
      {
        kind: "Hadith",
        text: "Përkthim kuptimor: Merret nga të pasurit e tyre dhe u jepet të varfërve të tyre.",
        reference: "Sahih Buhari, 1395",
        sourceUrl: "https://sunnah.com/bukhari:1395",
      },
    ],
    scholars: [
      {
        scholar: "Imam Shafiu",
        arabic:
          "ولا وقت فيما يعطى الفقير إلا ما يخرجه من حد الفقر إلى الغنى.",
        translationSq:
          "Nuk ka kufi të ngurtë në atë që i jepet të varfrit, përveç asaj që e nxjerr nga varfëria drejt mjaftueshmërisë.",
        reference: "El-Umm, 8/256",
        scope: "Qëllimi i ndihmës së përfituesit të zekatit.",
      },
    ],
  },
  {
    id: "kush-nuk-perfiton",
    title: "Kujt nuk i jepet zekati",
    description:
      "Kjo temë duhet të trajtohet me kujdes. Aplikacioni nuk duhet të vendosë ndalime automatike pa pyetur për rrethanat familjare dhe financiare.",
    sections: [
      {
        title: "Rregulla të përgjithshme orientuese",
        items: [
          "Nuk i jepet atij që nuk hyn në kategoritë e përfituesve të përmendura në Kur’an.",
          "Zakonisht nuk i jepet personit financiarisht të mjaftueshëm që nuk ka nevojë ose borxh të vlefshëm.",
          "Prindërit, gjyshërit, fëmijët dhe nipërit kërkojnë kujdes të veçantë, sidomos kur dhënësi ka detyrim të drejtpërdrejtë për shpenzimet e tyre.",
          "Mos e shfaq bashkëshortin ose bashkëshorten si ndalim absolut; rastet familjare mund të ndryshojnë dhe duhen verifikuar.",
          "Mos e përdor zekatin për përfitim personal, p.sh. duke fshirë një borxh tëndin ndaj një personi pa e dorëzuar realisht zekatin.",
        ],
      },
    ],
    evidences: [
      {
        kind: "Hadith",
        text: "Rasti i Zejnebes tregon se çështjet e dhënies së zekatit brenda familjes duhen trajtuar me kujdes dhe sipas rrethanave.",
        reference: "Sahih Buhari, 1462",
        sourceUrl: "https://sunnah.com/bukhari:1462",
      },
    ],
    scholars: [
      {
        scholar: "Imam Ahmed ibn Hanbel",
        arabic: "لا يجزيه ذلك",
        translationSq:
          "Nuk mjafton që një borxh ndaj një të varfri thjesht të fshihet dhe të llogaritet si zekat.",
        reference: "El-Mugni, 2/487, duke transmetuar një çështje nga Imam Ahmedi",
        scope: "Rasti i fshirjes së borxhit ndaj një përfituesi të mundshëm.",
      },
    ],
    caution:
      "Përpara se të japësh zekat familjarëve ose të fshish borxhe, konsultohu me dijetar të kualifikuar që njeh rastin tënd.",
  },
  {
    id: "dijetaret",
    title: "Fjalë të dijetarëve mbi zekatin",
    description:
      "Këto janë shënime juridike dhe edukative. Nuk duhet të përdoren si vendim automatik për çdo rast modern.",
    scholars: [
      {
        scholar: "Ibn Kajimi",
        arabic:
          "أوجب الشارع الزكاة مواساةً للفقراء، وطهرةً للمال، وعبوديةً للرب.",
        translationSq:
          "Zekati është mbështetje për të varfrit, pastrim i pasurisë dhe adhurim ndaj Allahut.",
        reference: "I'lam al-Muwaqqi'in, 3/333",
        scope: "Urtësia e përgjithshme e zekatit.",
      },
      {
        scholar: "Ibn Tejmije",
        arabic:
          "الأئمة الأربعة وسائر الأمة إلا من شذ متفقون على وجوبها في عرض التجارة.",
        translationSq:
          "Katër imamët dhe shumica e dijetarëve pranojnë obligimin e zekatit në mallrat e tregtisë.",
        reference: "Mexhmu' el-Fetava, 25/45",
        scope: "Zekati në mallrat e tregtisë.",
      },
      {
        scholar: "Imam Maliku",
        arabic:
          "ولا تكون الصدقة إلا في ثلاثة أشياء: في الحرث والعين والماشية.",
        translationSq:
          "Në formulimin klasik, zekati lidhet me bujqësinë, pasurinë monetare dhe bagëtinë.",
        reference: "El-Muvatta, Libri i Zekatit",
        scope: "Kategoritë klasike të pasurisë së zekatueshme.",
      },
      {
        scholar: "Imam Shafiu",
        arabic:
          "ولا وقت فيما يعطى الفقير إلا ما يخرجه من حد الفقر إلى الغنى.",
        translationSq:
          "Nuk ka kufi të ngurtë në ndihmën e të varfrit, përveç asaj që e nxjerr nga varfëria drejt mjaftueshmërisë.",
        reference: "El-Umm, 8/256",
        scope: "Synimi i ndihmës së përfituesit.",
      },
      {
        scholar: "Imam Ahmed ibn Hanbel",
        arabic: "لا يجزيه ذلك",
        translationSq:
          "Nuk mjafton që fshirja e një borxhi të llogaritet automatikisht si pagesë zekati.",
        reference: "El-Mugni, 2/487",
        scope: "Shënim juridik për fshirjen e borxhit ndaj një të varfri.",
      },
    ],
    caution:
      "Për çështje të debatueshme si bizhuteria, borxhet, aksionet, kripto dhe pagesa për të afërmit, aplikacioni duhet të shfaqë metodën e zgjedhur dhe të sugjerojë këshillim fetar.",
  },
];