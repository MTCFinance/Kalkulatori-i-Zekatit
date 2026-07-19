export type CalculatorLanguage = "sq" | "en";

export type TranslationVars = Record<string, string | number>;

type TranslationDictionary = Record<string, string>;

export const calculatorTranslations: Record<
  CalculatorLanguage,
  TranslationDictionary
> = {
  sq: {
    "language.label": "Gjuha",
    "language.sq": "Shqip",
    "language.en": "English",
    "nav.back": "← Kthehu në ballinë",
    "nav.primaryAria": "Navigimi kryesor",
    "nav.fullCalculation": "Kalkulim i plotë",
    "brand.homeAria": "Zekat - Ballina",
    "brand.tagline": "Kalkulator i besueshëm",
    "hero.kicker": "Kalkulim i shpejtë pa regjistrim",
    "hero.title": "Kalkulatori i Zekatit",
    "hero.description":
      "Zgjidh vetëm pasuritë që i ke. Seksionet e tjera mbeten të mbyllura.",
    "hero.simpleMode": "Kalkulim i thjeshtë: para, ar dhe stoli — pa login.",
    "hero.fullMode":
      "Kalkulim i plotë: të gjitha kategoritë dhe raporti i detajuar.",
    "hero.openFull": "Hap kalkulimin e plotë →",
    "hero.featuresAria": "Karakteristikat kryesore",
    "hero.feature.clear": "I qartë",
    "hero.feature.secure": "I sigurt",
    "hero.feature.steps": "Hap pas hapi",
    "preferences.title": "Preferencat",
    "preferences.start": "Fillo kalkulimin",
    "privacy.device": "Të dhënat e kalkulimit qëndrojnë në pajisjen tënde.",
    "usageGuide.title": "Si ta përdorësh programin",
    "usageGuide.step1":
      "Së pari plotëso datën e kalkulimit dhe të dhënat e nisabit.",
    "usageGuide.step2":
      "Aktivizo vetëm kategoritë e pasurisë që i ke dhe plotëso fushat obligative.",
    "usageGuide.step3":
      "Kontrollo përmbledhjen dhe seksionin “Kontrollo kalkulimin” para se ta ruash ose printosh raportin.",
    "usageGuide.note":
      "Mos e fut të njëjtën pasuri në dy seksione të ndryshme.",
    "install.title": "Instalo aplikacionin",
    "install.text":
      "Mund ta shtosh kalkulatorin në ekranin kryesor të telefonit për qasje më të shpejtë.",
    "install.android":
      "Android / Chrome: Hap menynë ⋮ dhe zgjidh ‘Install app’ ose ‘Add to Home screen’.",
    "install.iphone":
      "iPhone / Safari: Shtyp Share dhe zgjidh ‘Add to Home Screen’.",
    "install.offlineNote":
      "Faqet që ke hapur më parë mund të mbeten të përdorshme edhe kur lidhja ndërpritet.",
    "install.open": "Hap instalimin për telefon",
    "summary.jump": "Shko te përmbledhja",
    "simple.lockedTitle": "Kategoritë e tjera janë të kufizuara",
    "simple.lockedText":
      "Argjendi, valutat, borxhet, kripto, biznesi, bagëtia, bujqësia, ruajtja dhe raporti gjenden në versionin e plotë.",
    "footer.preparedBy": "Përgatitur nga",
    "common.activate": "Aktivizo",
    "common.choose": "Zgjidh",
    "common.remove": "Hiq",
    "common.yes": "Po",
    "common.no": "Jo",
    "common.unsure": "Nuk jam i sigurt",
    "common.other": "Tjetër",
    "common.description": "Përshkrimi",
    "common.optionalDescription": "Përshkrim opsional",
    "common.value": "Vlera e llogaritur: {value}",
    "common.required": "Obligative të plotësohet",
    "placeholder.example70": "Shembull: 70",
    "placeholder.example085": "Shembull: 0.85",
    "placeholder.example5000": "Shembull: 5000",
    "placeholder.exampleJpy": "Shembull: JPY",
    "placeholder.example092": "Shembull: 0.92",
    "placeholder.example95": "Shembull: 95",
    "placeholder.example110": "Shembull: 1.10",
    "inventory.title": "Mallra tregtare dhe inventar biznesi",
    "inventory.helper":
      "Fut vetëm mallrat ose asetet që mbahen kryesisht për rishitje. Përdor vlerën aktuale të tregut në datën e zekatit, jo domosdoshmërisht çmimin fillestar të blerjes.",
    "inventory.reminder":
      "Mos fut këtu para në arkë/bankë, bagëti për tregti, ar, argjend, kripto ose të arkëtueshme që i ke shtuar në seksionet e tyre.",
    "inventory.item": "Mall tregtar {index}",
    "inventory.type": "Lloji",
    "inventory.resaleGoods": "Mall për rishitje",
    "inventory.rawMaterial": "Lëndë e parë për produkt që do të shitet",
    "inventory.finishedGoods": "Produkt i përfunduar për shitje",
    "inventory.resaleProperty": "Tokë / pronë e blerë vetëm për rishitje",
    "inventory.descriptionPlaceholder": "Stok veshmbathjesh",
    "inventory.marketValue": "Vlera aktuale e tregut ({currency})",
    "inventory.heldForResale": "A mbahet kryesisht për rishitje?",
    "inventory.excludedNote":
      "Ky aset nuk është përfshirë si mall tregtar sepse nuk është shënuar si i mbajtur kryesisht për rishitje.",
    "inventory.add": "+ Shto mall tregtar",
    "inventory.note":
      "Mallrat e mbajtura për rishitje përfshihen me vlerën e tregut në datën e zekatit. Mos fut këtu pajisje, makineri, mobilie ose automjete që përdoren si mjete pune në biznes.",
    "otherAssets.title": "Pasuri të tjera dhe investime",
    "otherAssets.helper":
      "Përdore këtë seksion vetëm për pasuri që nuk i ke futur te paraja, ari, argjendi, kripto, mallrat tregtare, të arkëtueshmet ose kategoritë tjera. Mos e fut të njëjtën vlerë dy herë.",
    "otherAssets.item": "Pasuri {index}",
    "otherAssets.type": "Lloji",
    "otherAssets.type.stocks": "Aksione / fonde investimi",
    "otherAssets.type.financialDeposit":
      "Depozitë ose investim financiar",
    "otherAssets.type.businessParticipation": "Pjesëmarrje në biznes",
    "otherAssets.type.otherFinancial": "Pasuri tjetër financiare",
    "otherAssets.type.other": "Tjetër",
    "otherAssets.description": "Përshkrimi",
    "otherAssets.descriptionPlaceholder": "P.sh. fond investimi ose pjesë biznesi",
    "otherAssets.currentValue": "Vlera aktuale (EUR)",
    "otherAssets.investmentPurpose": "Qëllimi i investimit",
    "otherAssets.purpose.placeholder": "Zgjidh qëllimin",
    "otherAssets.purpose.trade": "Për tregti / rishitje",
    "otherAssets.purpose.longTerm": "Investim afatgjatë / dividendë",
    "otherAssets.purpose.companyPays": "Kompania e paguan zekatin",
    "otherAssets.purpose.includeFull": "Përfshi vlerën e plotë për siguri",
    "otherAssets.purpose.unsure": "Nuk jam i sigurt",
    "otherAssets.investmentCurrentValue": "Vlera aktuale e investimit (EUR)",
    "otherAssets.zakatablePercentage": "Pjesa e aseteve të zekatueshme (%)",
    "otherAssets.percentageVerification":
      "Përqindja duhet të jetë nga 0 deri në 100. Pa një përqindje të vlefshme, vlera nuk përfshihet automatikisht dhe kërkon verifikim.",
    "otherAssets.companyPaysNote":
      "Kompania shënon se e paguan zekatin. Mos e dyfisho të njëjtën pasuri.",
    "otherAssets.dividendsHeld":
      "Dividendë të pranuara dhe ende të mbajtura (EUR)",
    "otherAssets.dividendsInCash":
      "A janë këto dividendë futur tashmë te paraja/banka?",
    "otherAssets.loanQuestion":
      "A është financuar ky investim me kredi/borxh?",
    "otherAssets.loan.none": "Jo",
    "otherAssets.loan.interestFree": "Po, kredi pa kamatë / hallall",
    "otherAssets.loan.conventional": "Po, kredi me kamatë / konvencionale",
    "otherAssets.loan.unsure": "Nuk jam i sigurt",
    "otherAssets.totalLoanOutstanding":
      "Shuma totale e borxhit të mbetur (informative)",
    "otherAssets.totalLoanInformative":
      "Kjo shumë është vetëm informative dhe nuk ndikon automatikisht në total.",
    "otherAssets.principalDue":
      "Principali që duhet paguar brenda 12 muajve (EUR)",
    "otherAssets.principalAlreadyInDebts":
      "A e ke futur këtë principal tashmë te Borxhet e zbritshme?",
    "otherAssets.interestDue":
      "Interesi/kamata që pritet të paguhet brenda 12 muajve (EUR)",
    "otherAssets.ribaWarning":
      "Kjo kredi përmban kamatë/riba. Aplikacioni nuk e trajton kamatën si vlerë të zbritshme automatike dhe nuk e llogarit si zekat. Kërkohet pendim dhe konsultim me dijetar të besueshëm.",
    "otherAssets.loanUnsureWarning":
      "Lloji i kredisë kërkon verifikim. Asnjë shumë e lidhur me kredinë nuk zbritet automatikisht.",
    "otherAssets.treatment": "Trajtimi në kalkulim",
    "otherAssets.treatment.include": "Përfshi në zekatin monetar",
    "otherAssets.treatment.exclude":
      "Mos e përfshi - përdorim personal ose aset operativ",
    "otherAssets.treatment.verify": "Kërkon verifikim metodologjik",
    "otherAssets.add": "+ Shto pasuri",
    "otherAssets.descriptionRequired":
      "Përshkrimi duhet plotësuar kur vendoset një vlerë.",
    "otherAssets.note":
      "Për aksione, fonde, pjesëmarrje biznesi dhe pasuri të ngjashme mund të kërkohet verifikim. Aplikacioni përfshin vetëm vlerën që ke zgjedhur shprehimisht ta përfshish.",
    "otherAssets.reportTitle": "Pasuri të tjera dhe investime",
    "nisab.title": "1. Nisabi dhe viti hënor",
    "nisab.currency": "Valuta",
    "nisab.basis": "Baza e nisabit",
    "nisab.gold": "Ari",
    "nisab.silver": "Argjendi",
    "nisab.manual": "Vlerë manuale",
    "nisab.goldOption": "Ari — 85 g ar i pastër (24K)",
    "nisab.silverOption": "Argjendi — 595 g argjend i pastër",
    "nisab.manualOption": "Vlerë e vendosur nga dijetar / organizatë",
    "nisab.goldSummary": "Ari — 85 g",
    "nisab.silverSummary": "Argjendi — 595 g",
    "nisab.goldAmount": "Nisabi në ar",
    "nisab.silverAmount": "Nisabi në argjend",
    "nisab.goldPrice": "Çmimi i arit 24K në {currency} për gram",
    "nisab.silverPrice": "Çmimi i argjendit në {currency} për gram",
    "nisab.manualValue": "Nisabi monetar i vendosur ({currency})",
    "nisab.manualHelper":
      "Përdore këtë opsion kur ndjek vlerën e përcaktuar nga dijetari ose organizata jote.",
    "nisab.monetary": "Nisabi monetar ({currency})",
    "nisab.helper":
      "Vendose vlerën e nisabit që përdor për kalkulim. Çmimet automatike do të shtohen më vonë.",
    "nisab.lunarYear":
      "A ka kaluar një vit hënor mbi pasurinë e llogaritshme?",
    "nisab.needNisab": "Vendose nisabin për të përfunduar kalkulimin monetar.",
    "nisab.needYear":
      "Kalkulimi monetar kërkon konfirmimin e vitit hënor.",
    "nisab.note":
      "Për paratë moderne mund të përdoret baza e arit ose e argjendit. Aplikacioni e shfaq zgjedhjen qartë dhe nuk merr çmime automatike në këtë fazë.",
    "assets.title": "2. Çfarë pasurie ke?",
    "assets.money": "Para dhe kursime",
    "assets.goldJewelry": "Ari",
    "assets.silver": "Argjend",
    "assets.personalJewelry": "Stoli personale",
    "assets.crypto": "Kripto",
    "assets.livestock": "Bagëti",
    "assets.crops": "Bujqësi dhe të korra",
    "money.title": "3. Para dhe kursime",
    "money.cash": "Para në dorë",
    "money.bank": "Para në bankë",
    "money.savings": "Kursime",
    "money.receivablesOld": "Borxhe që pritet t’i marrësh",
    "fx.title": "Valuta të tjera",
    "fx.helper":
      "Vendos paratë që i mban në valuta të tjera. Kursi vendoset manualisht sipas vlerës në datën e llogaritjes së zekatit. Mos i shto këtu paratë që tashmë i ke futur në fushat ekzistuese në {currency}. Më vonë mund të shtohet kurs referencë nga API si XE ose shërbim i ngjashëm, por kursi përfundimtar mbetet për verifikim manual.",
    "fx.row": "Valutë {index}",
    "fx.currency": "Valuta",
    "fx.custom": "Kodi ose emri i valutës",
    "fx.amount": "Shuma në valutën përkatëse",
    "fx.rate": "1 njësi e kësaj valute = sa {currency}?",
    "fx.equivalent": "Ekuivalenti: {value}",
    "fx.incomplete": "Plotëso shumën dhe kursin në {currency}.",
    "fx.add": "+ Shto valutë",
    "fx.source": "Burimi",
    "fx.loading": "Duke marrë kurset...",
    "fx.button": "Merr kurset automatike",
    "fx.unavailable": "Kurset nuk u morën. Mund t’i vendosësh manualisht.",
    "debts.title": "Borxhet dhe të arkëtueshmet",
    "debts.receivablesTitle": "Paratë që të tjerët të kanë borxh",
    "debts.receivablesHelper":
      "Fut vetëm shuma që pritet t’i marrësh. Shumat e pasigurta nuk hyjnë automatikisht në kalkulimin monetar.",
    "debts.receivableRow": "E arkëtueshme {index}",
    "debts.receivablePlaceholder": "Hua për mikun",
    "debts.amount": "Shuma në {currency}",
    "debts.status": "Statusi",
    "debts.secure": "E sigurt për arkëtim",
    "debts.doubtful": "E pasigurt / e kontestuar",
    "debts.doubtfulNote":
      "Nuk është përfshirë në pasurinë monetare sepse arkëtimi nuk është i sigurt.",
    "debts.addReceivable": "+ Shto të arkëtueshme",
    "debts.includedReceivables": "Të arkëtueshme të përfshira: {value}",
    "debts.liabilitiesTitle": "Borxhet e tua të zbritshme",
    "debts.liabilitiesHelper":
      "Vendos vetëm shumën që duhet paguar tani ose brenda 12 muajve të ardhshëm. Mos vendos tërë borxhin afatgjatë, p.sh. tërë detyrimin afatgjatë për banesë ose shtëpi.",
    "debts.liabilityRow": "Detyrim {index}",
    "debts.type": "Lloji",
    "debts.personalLoan": "Hua personale",
    "debts.installment": "Detyrim me këste / borxh brenda 12 muajve",
    "debts.businessBill": "Faturë ose detyrim biznesi",
    "debts.card": "Detyrim karte",
    "debts.dueWithinYear":
      "Shuma që duhet paguar brenda 12 muajve ({currency})",
    "debts.addLiability": "+ Shto detyrim",
    "debts.deductible": "Borxhe të zbritshme: {value}",
    "debts.methodologyNote":
      "Rregullat për borxhet dhe të arkëtueshmet mund të ndryshojnë mes medhhebeve sunite. Ky kalkulim përdor vetëm borxhet që duhen paguar brenda 12 muajve dhe të arkëtueshmet e sigurta për arkëtim.",
    "gold.title": "4. Ari",
    "gold.type": "Lloji i arit",
    "gold.investment": "Ar për investim ose tregti",
    "gold.personalJewelry": "Stoli për përdorim personal",
    "gold.treatment": "Trajtimi në kalkulim",
    "gold.include": "Përfshije në kalkulimin e zekatit",
    "gold.exclude": "Mos i përfshi stolitë personale",
    "gold.warning": "Kërkon verifikim me dijetar.",
    "gold.price": "Çmimi i arit të pastër për 1 gram në {currency}",
    "gold.grams": "Ari {karat} në gram",
    "gold.note": "Ari 14K llogaritet automatikisht si 14/24 ari i pastër.",
    "metals.button": "Merr çmimet e arit dhe argjendit",
    "metals.loading": "Duke marrë çmimet...",
    "metals.source": "Burimi: Metals.Dev",
    "metals.updated": "Përditësuar",
    "metals.notConfigured":
      "Çelësi i Metals.Dev nuk është vendosur. Çmimet mund t’i vendosësh manualisht.",
    "metals.unavailable": "Çmimet nuk u morën. Vlerat manuale mbeten aktive.",
    "metals.title": "Ari dhe argjendi",
    "silver.title": "5. Argjendi",
    "silver.grams": "Argjend në gram",
    "silver.price": "Çmimi për gram në {currency}",
    "jewelry.title": "Stoli personale",
    "jewelry.helper":
      "Stolitë personale kanë dallim në trajtim. Zgjidh metodën që ndjek ose konsultohu me dijetar.",
    "jewelry.includePersonal": "Përfshi stolitë personale në zekat",
    "jewelry.hanafi": "Pozicion Hanefi",
    "jewelry.excludePersonal":
      "Përjashto stolitë e lejuara për përdorim personal",
    "jewelry.malikiShafiHanbali":
      "Pozicion i njohur në Maliki, Shafi dhe Hanbeli",
    "jewelry.unsureHelper":
      "Nuk e di cilën metodë të ndjek për stolitë personale.",
    "jewelry.warning":
      "Nëse nuk je i sigurt, mos u mbështet vetëm në këtë rezultat. Pyet një hoxhë ose person të ditur për rastin tënd.",
    "jewelry.item": "Stoli {index}",
    "jewelry.material": "Materiali",
    "jewelry.purity": "Pastërtia",
    "jewelry.weight": "Pesha në gram",
    "jewelry.purpose": "Qëllimi",
    "jewelry.personalUse": "Përdorim personal",
    "jewelry.savings": "Kursim / ruajtje vlere",
    "jewelry.trade": "Për tregti",
    "jewelry.goldPrice": "Çmimi i 24K në {currency} për gram",
    "jewelry.silverPrice": "Çmimi në {currency} për gram",
    "jewelry.add": "+ Shto stoli",
    "jewelry.note":
      "Stolitë për kursim, ruajtje vlere ose tregti përfshihen në pasurinë monetare. Për stolitë e përdorimit personal ekziston dallim në trajtim; aplikacioni zbaton vetëm zgjedhjen e bërë më sipër.",
    "crypto.title": "Kripto",
    "crypto.amount": "{asset} sasi",
    "crypto.price": "Çmimi manual për 1 {asset} në {currency}",
    "crypto.usdtPrice": "Çmimi për 1 USDT në {currency}",
    "crypto.other": "Tjetër (vlerë totale manuale)",
    "crypto.warning": "Kërkon verifikim me dijetar.",
    "crypto.methodologyTitle": "Trajtimi i kriptove në kalkulim",
    "crypto.include": "Përfshi sipas vlerës së tregut",
    "crypto.verify": "Kërkon verifikim — mos e përfshi automatikisht",
    "crypto.unsure": "Nuk jam i sigurt",
    "crypto.marketValue": "Vlera aktuale e kriptove ({currency})",
    "crypto.unsureWarning":
      "Zgjidh trajtimin e kriptove para rezultatit final.",
    "crypto.note":
      "Kriptot kanë çështje bashkëkohore që mund të kërkojnë verifikim. Aplikacioni nuk vendos vetë gjykim për lejueshmërinë e një aseti.",
    "livestock.title": "Bagëti",
    "livestock.group": "Grup bagëtie {index}",
    "livestock.addGroup": "+ Shto grup bagëtie",
    "livestock.noType": "Pa lloj",
    "livestock.animalType": "Lloji i kafshës",
    "livestock.otherAnimal": "Shkruaj llojin e kafshës",
    "livestock.otherAnimalPlaceholder": "Lloji i kafshës",
    "livestock.grazingCount": "Frymë kullotëse",
    "livestock.tradeCount": "Frymë për tregti",
    "livestock.totalAnimals": "Numri total i frymëve",
    "livestock.grazesMostYear": "A kullosin shumicën e vitit?",
    "livestock.grazingYes": "Po, kullosin shumicën e vitit",
    "livestock.grazingNo":
      "Jo / ushqehen kryesisht me ushqim të blerë ose në fermë",
    "livestock.tradeMarketValue":
      "Vlera totale e tregut për frymët për tregti",
    "livestock.animal.Dele": "Dele",
    "livestock.animal.Dhi": "Dhi",
    "livestock.animal.Lopë": "Lopë",
    "livestock.animal.Buaj": "Buaj",
    "livestock.animal.Deve": "Deve",
    "livestock.animal.Tjetër": "Tjetër",
    "livestock.fedMethodologyShortTitle":
      "Metodologjia për bagëtinë e ushqyer",
    "livestock.fedMajorityShort": "Shumica sunite",
    "livestock.fedMalikiShortOption": "Maliki",
    "livestock.fedMethodologyTitle":
      "Metodologjia për bagëtinë e ushqyer kryesisht me ushqim të blerë",
    "livestock.fedMajority":
      "Shumica sunite — mos e llogarit sipas frymëve",
    "livestock.fedMaliki": "Maliki — llogarite sipas frymëve",
    "livestock.fedMajorityNote":
      "Bagëtia e ushqyer nuk llogaritet sipas frymëve me metodën e shumicës sunite.",
    "livestock.fedMalikiNote":
      "Kjo pjesë përfshihet në llogaritjen sipas metodologjisë Maliki.",
    "livestock.fedUnsureNote":
      "Zgjidh trajtimin për bagëtinë e ushqyer.",
    "livestock.otherVerification":
      "Kjo kategori kërkon verifikim për llogaritje fizike.",
    "livestock.fedMalikiShort": "të ushqyera sipas Maliki",
    "livestock.countableAnimals": "frymë të llogaritshme",
    "livestock.methodologyNote":
      "Bagëtia për tregti llogaritet me vlerën e tregut dhe hyn në zekatin monetar. Bagëtia kullotëse ruhet veçmas dhe zekati i saj sipas numrit të frymëve llogaritet sipas zgjedhjes më sipër. Bagëtia e ushqyer me “Jo” përfshihet vetëm kur zgjidhet Maliki; te shumica sunite nuk shënohet si gabim, ndërsa “Nuk jam i sigurt” kalon te verifikimi.",
    "livestock.sheepTradeNote":
      "Delet dhe dhitë për tregti nuk hyjnë në këtë tabelë. Ato llogariten vetëm sipas vlerës së tregut dhe përfshihen në zekatin monetar 2.5%.",
    "livestock.cattleBuffaloNote":
      "Lopët dhe buajt kullotës bashkohen për nisab dhe llogaritje. Bagëtia për tregti hyn vetëm me vlerën e tregut në zekatin monetar. Rezultati vlen kur plotësohen kushtet e vitit hënor dhe zgjedhjet e bëra në kalkulator.",
    "livestock.camelNote":
      "Devetë për tregti llogariten vetëm me vlerën e tregut dhe hyjnë në zekatin monetar. Devetë kullotëse llogariten veçmas sipas numrit të frymëve.",
    "crop.sectionTitle": "Bujqësi dhe të korra",
    "crop.item": "E korrë {index}",
    "crop.add": "+ Shto të korrë",
    "crop.noType": "Pa lloj",
    "crop.noIrrigation": "Pa mënyrë ujitjeje",
    "crop.type": "Lloji i të korrës",
    "crop.otherType": "Shkruaj llojin e të korrës",
    "crop.otherTypePlaceholder": "Lloji i të korrës",
    "crop.quantity": "Sasia e korrur",
    "crop.nisabKg": "Nisabi i zgjedhur në kg",
    "crop.nisabHelper":
      "Nisabi bazë është 5 wasq. Konvertimi në kg mund të ndryshojë sipas produktit dhe metodologjisë.",
    "crop.irrigation": "Mënyra e ujitjes",
    "crop.irrigation.natural": "Natyrale",
    "crop.irrigation.cost": "Me shpenzim",
    "crop.irrigation.mixed": "E përzier",
    "crop.irrigation.unsure": "Nuk jam i sigurt",
    "crop.type.Grurë": "Grurë",
    "crop.type.Elb": "Elb",
    "crop.type.Oriz": "Oriz",
    "crop.type.Misër": "Misër",
    "crop.type.Bishtajore": "Bishtajore",
    "crop.type.Hurma": "Hurma",
    "crop.type.Rrush / rrush i thatë": "Rrush / rrush i thatë",
    "crop.type.Ullinj": "Ullinj",
    "crop.type.Tjetër": "Tjetër",
    "crop.otherVerification":
      "Ky produkt kërkon verifikim për llogaritje.",
    "crop.chooseTypeMessage": "Zgjidh llojin e të korrës për llogaritje.",
    "crop.belowNisab": "Nuk ka zekat — nën nisabin e zgjedhur",
    "crop.unsureIrrigationNote":
      "Për ujitje të paqartë, aplikacioni nuk jep rezultat automatik. Nëse e di se janë përdorur të dyja mënyrat e ujitjes, zgjidh ‘E përzier — 7.5%’. Për të shmangur rrezikun e nënllogaritjes, mund të zgjedhësh ‘Natyrale — 10%’ ose të konsultohesh me dijetar.",
    "crop.chooseIrrigationMessage":
      "Zgjidh mënyrën e ujitjes për llogaritje.",
    "crop.note":
      "Zekati i të korrave llogaritet në kohën e korrjes dhe nuk hyn në zekatin monetar 2.5%. Rregullat për llojet e të korrave mund të ndryshojnë mes medhhebeve sunite.",
    "crop.mixedRateNote":
      "7.5% përdoret si vlerë e mesme operative kur janë përdorur ujitja natyrale dhe ujitja me shpenzim, por raporti i saktë nuk dihet. Nëse dihet se dominon ujitja natyrale, përdor 10%; nëse dominon ujitja me shpenzim, përdor 5%. Ky rezultat është orientues dhe mund të kërkojë verifikim.",
    "deductible.title": "6. Detyrime të zbritshme",
    "deductible.label": "Borxhe / detyrime që i ke",
    "summary.title": "Përmbledhja",
    "summary.cashSavings": "Para dhe kursime",
    "summary.foreignCurrencies": "Valuta të tjera në {currency}",
    "summary.pureGold": "Ari i pastër",
    "summary.goldValue": "Vlera e arit",
    "summary.silverValue": "Vlera e argjendit",
    "summary.personalJewelryIncluded": "Stoli personale të përfshira",
    "summary.personalJewelryExcluded": "Stoli personale të përjashtuara",
    "summary.jewelryNeedsMethod": "Stoli që kërkojnë metodologji",
    "summary.jewelryTrade": "Ari/argjendi për kursim ose tregti",
    "summary.crypto": "Vlera e kriptove",
    "summary.cryptoIncluded": "Kripto e përfshirë",
    "summary.cryptoVerification": "Kripto që kërkon verifikim",
    "summary.tradeLivestock": "Bagëti për tregti",
    "summary.businessInventory": "Mallra tregtare të përfshira",
    "summary.otherAssetsIncluded": "Pasuri të tjera të përfshira",
    "summary.otherAssetsExcluded": "Pasuri të tjera të përjashtuara",
    "summary.otherAssetsVerification":
      "Pasuri të tjera që kërkojnë verifikim",
    "summary.investmentsIncluded": "Investime të përfshira",
    "summary.dividendsIncluded": "Dividendë të përfshira",
    "summary.investmentPrincipalDeducted":
      "Principal kredie i zbritur nga investimet",
    "summary.interestLoanVerification": "Kredi me kamatë: kërkon verifikim",
    "summary.interestNotDeducted": "Interes/kamatë e pazbritur",
    "summary.sheepGoats": "Dele dhe dhi kullotëse",
    "summary.sheepGoatsCountable": "Dele/dhi të llogaritshme",
    "summary.sheepGoatZakat": "Zekati i deleve/dhive kullotëse",
    "summary.sheepGoatZakatCountable": "Zekati i deleve/dhive të llogaritshme",
    "summary.cattleBuffalo": "Lopë dhe buaj kullotës",
    "summary.cattleBuffaloCountable": "Lopë/buaj të llogaritshëm",
    "summary.cattleBuffaloZakat": "Zekati i lopëve/buajve kullotës",
    "summary.cattleBuffaloZakatCountable":
      "Zekati i lopëve/buajve të llogaritshëm",
    "summary.camels": "Deve kullotëse",
    "summary.camelsCountable": "Deve të llogaritshme",
    "summary.camelZakat": "Zekati i deveve kullotëse",
    "summary.camelZakatCountable": "Zekati i deveve të llogaritshme",
    "summary.needsVerification": "Kërkon verifikim",
    "summary.assetsBeforeDebts": "Pasuria monetare para borxheve",
    "summary.includedReceivables": "Të arkëtueshme të përfshira",
    "summary.deductibleDebts": "Borxhe të zbritshme",
    "summary.nisabBasis": "Baza e nisabit",
    "summary.selectedNisab": "Nisabi i zgjedhur",
    "summary.needsCompletion": "Kërkon plotësim",
    "summary.netAssets": "Pasuria neto e llogaritshme",
    "summary.lunarYear": "Viti hënor",
    "summary.status": "Statusi",
    "summary.monetaryZakat": "Zekati monetar 2.5%",
    "summary.calculatedMonetary": "Zekati monetar i llogaritur",
    "summary.formula": "Formula",
    "summary.zakatReport": "Raporti i zekatit",
    "summary.countableAssets": "Pasuria e llogaritshme",
    "summary.youOwe": "Ju duhet të jepni",
    "readiness.title": "Kontrollo kalkulimin",
    "readiness.status.ready": "Gati për rezultat",
    "readiness.status.incomplete": "Kërkon plotësim",
    "readiness.status.verification": "Kërkon verifikim",
    "readiness.group.completion": "Për t'u plotësuar",
    "readiness.group.verification": "Për verifikim",
    "readiness.goToSection": "Shko te seksioni",
    "readiness.note":
      "Rezultati përdor vetëm vlerat që janë përfshirë sipas zgjedhjeve dhe metodologjive të bëra në kalkulator.",
    "readiness.issue.nisab":
      "Plotëso vlerën e nisabit ose çmimin e kërkuar për bazën e zgjedhur.",
    "readiness.issue.lunarYear":
      "Konfirmo nëse ka kaluar një vit hënor për pasurinë.",
    "readiness.issue.fx":
      "Plotëso valutën, shumën dhe kursin EUR për rreshtin e valutës së huaj.",
    "readiness.issue.gold":
      "Plotëso peshën e arit dhe çmimin e arit 24K për gram.",
    "readiness.issue.silver":
      "Plotëso peshën e argjendit dhe çmimin për gram.",
    "readiness.issue.jewelryFields":
      "Plotëso peshën dhe çmimin për stolitë e futura.",
    "readiness.issue.cryptoValue": "Plotëso vlerën aktuale të kriptove.",
    "readiness.issue.inventory":
      "Plotëso vlerën, përshkrimin ose zgjedhjen e nevojshme për mallrat tregtare.",
    "readiness.issue.otherAssets":
      "Plotëso fushat e kërkuara për pasurinë ose investimin.",
    "readiness.issue.tradeLivestock":
      "Plotëso vlerën e tregut për bagëtinë e shënuar për tregti.",
    "readiness.issue.grazingLivestock":
      "Plotëso llojin e bagëtisë dhe përgjigjen për kullotjen.",
    "readiness.issue.crops":
      "Plotëso llojin, nisabin dhe ujitjen për të korrat e futura.",
    "readiness.issue.cryptoMethodology":
      "Zgjedhja e kriptove kërkon verifikim metodologjik.",
    "readiness.issue.jewelryMethodology":
      "Metodologjia për stolitë personale është e paqartë.",
    "readiness.issue.fedLivestock":
      "Bagëtia e ushqyer kërkon zgjedhje metodologjie.",
    "readiness.issue.otherLivestock":
      "Bagëtia e shënuar si 'Tjetër' kërkon verifikim.",
    "readiness.issue.otherCrop":
      "E korra e shënuar si 'Tjetër' kërkon verifikim.",
    "readiness.issue.unclearIrrigation":
      "Ujitja e paqartë kërkon verifikim para llogaritjes automatike.",
    "readiness.issue.doubtfulReceivables":
      "Të arkëtueshmet e dyshimta nuk përfshihen automatikisht.",
    "readiness.issue.goldJewelry":
      "Ari personal kërkon verifikim sipas metodologjisë së zgjedhur.",
    "readiness.issue.otherAssetsMethodology":
      "Pasuritë e tjera të shënuara për verifikim nuk përfshihen automatikisht.",
    "readiness.issue.investmentPurpose":
      "Plotëso qëllimin e investimit.",
    "readiness.issue.investmentPercentage":
      "Investimi afatgjatë kërkon një përqindje të vlefshme të aseteve të zekatueshme.",
    "readiness.issue.investmentLoanInterest":
      "Kredia me kamatë/riba kërkon verifikim dhe konsultim me dijetar.",
    "readiness.issue.investmentLoanUnsure":
      "Lloji i kredisë së investimit kërkon verifikim.",
    "readiness.issue.investmentPrincipalDuplicate":
      "Kontrollo që principali i kredisë të mos zbritet dy herë; është shënuar si i futur te borxhet e zbritshme.",
    "methodology.title": "Metodologjia e zgjedhur",
    "methodology.included": "E përfshirë",
    "methodology.excluded": "E përjashtuar",
    "methodology.needsMethodology": "Kërkon metodologji",
    "methodology.needsVerification": "Kërkon verifikim",
    "methodology.cropsIrrigation": "Të korra: mënyra e ujitjes",
    "methodology.reportNote":
      "Ky raport bazohet në zgjedhjet e bëra në kalkulator. Për raste të paqarta, konsultohu me dijetar të besueshëm.",
    "sources.title": "Burimet sunite të kalkulimit",
    "sources.open": "Hape burimin",
    "sources.verificationTitle": "Çështje moderne ose të veçanta",
    "sources.cryptoVerification":
      "Kripto: Kërkon verifikim / konsultim me dijetar.",
    "sources.jewelryVerification":
      "Bizhuteri personale: Kërkon verifikim / konsultim me dijetar.",
    "sources.debtsVerification":
      "Borxhe: Kërkon verifikim / konsultim me dijetar.",
    "sources.fedLivestockVerification":
      "Bagëti të ushqyera: Kërkon verifikim / konsultim me dijetar.",
    "sources.specialCropsVerification":
      "Produkte të veçanta bujqësore: Kërkon verifikim / konsultim me dijetar.",
    "calculationDate.title": "Data e kalkulimit",
    "calculationDate.label": "Data kur po e llogarit zekatin",
    "calculationDate.helper":
      "Përdore datën kur kontrollon pasurinë dhe detyrimin e zekatit.",
    "calculationDate.savedLabel": "Data e kalkulimit",
    "calculationDate.notSaved": "Data nuk është ruajtur",
    "saved.title": "Ruaj kalkulimin",
    "saved.nameLabel": "Emri i kalkulimit",
    "saved.saveButton": "Ruaj këtë kalkulim",
    "saved.helper":
      "Kalkulimet ruhen vetëm në këtë pajisje dhe shfletues. Nuk dërgohen në server.",
    "saved.listTitle": "Llogaritjet e ruajtura",
    "saved.unnamed": "Kalkulim pa emër",
    "saved.open": "Hap",
    "saved.delete": "Fshi",
    "saved.deleteAll": "Fshi të gjitha",
    "saved.export": "Eksporto kalkulimet",
    "saved.import": "Importo kalkulimet",
    "saved.backupPrivacy":
      "Backup-i përmban vetëm llogaritjet që ke ruajtur në këtë pajisje. Mos e dërgo skedarin te persona të tjerë nëse përmban të dhëna personale ose financiare.",
    "saved.empty": "Nuk ka ende kalkulime të ruajtura.",
    "saved.limitMessage":
      "Mund të ruhen më së shumti 10 kalkulime. Fshi një kalkulim të vjetër për të ruajtur një të ri.",
    "saved.savedMessage": "Kalkulimi u ruajt në këtë shfletues.",
    "saved.openedMessage": "Kalkulimi i ruajtur u hap.",
    "saved.deletedMessage": "Kalkulimi i ruajtur u fshi.",
    "saved.deletedAllMessage": "Të gjitha kalkulimet e ruajtura u fshinë.",
    "saved.exportEmpty": "Nuk ka kalkulime të ruajtura për eksport.",
    "saved.exportedMessage": "Backup-i i kalkulimeve u shkarkua.",
    "saved.importedMessage": "U importuan {count} kalkulime të ruajtura.",
    "saved.importNoNew":
      "Ky backup nuk përmban kalkulime të reja për t'u importuar.",
    "saved.importInvalidJson":
      "Skedari nuk është JSON i vlefshëm. Zgjidh një backup të eksportuar nga kalkulatori.",
    "saved.importInvalidBackup":
      "Skedari nuk përputhet me strukturën e backup-it të kalkulatorit.",
    "saved.importLimitMessage":
      "Importi do ta kalonte kufirin prej 10 kalkulimesh të ruajtura. Fshi disa kalkulime dhe provo përsëri.",
    "saved.importReadError":
      "Skedari nuk u lexua. Provo përsëri me një skedar JSON të vlefshëm.",
    "saved.saveError":
      "Kalkulimi nuk u ruajt. Kontrollo nëse shfletuesi lejon ruajtje lokale.",
    "saved.loadError":
      "Kalkulimet e ruajtura nuk u lexuan nga ky shfletues.",
    "saved.savedAt": "Ruajtur më",
    "saved.deleteConfirm": "A je i sigurt që dëshiron ta fshish këtë kalkulim?",
    "saved.deleteAllConfirm":
      "A je i sigurt që dëshiron t’i fshish të gjitha kalkulimet e ruajtura?",
    "saved.localStorageLabel":
      "Ruajtje lokale — këto kalkulime qëndrojnë vetëm në këtë pajisje dhe shfletues.",
    "cloud.title": "Kalkulimet në cloud",
    "cloud.helper":
      "Ruajtje e veçantë në llogarinë tënde. Kalkulimet lokale nuk bashkohen me këtë listë.",
    "cloud.checking": "Duke kontrolluar llogarinë...",
    "cloud.signedOutSummary": "Kërkohet kyçja",
    "cloud.count": "{count} kalkulime në cloud",
    "cloud.loginMessage":
      "Kyçu për t’i ruajtur kalkulimet në cloud.",
    "cloud.loginButton": "Hyr / Regjistrohu",
    "cloud.account": "Ruajtur në llogarinë: {email}",
    "cloud.nameLabel": "Emri i kalkulimit",
    "cloud.unnamed": "Kalkulim pa emër",
    "cloud.saveButton": "Ruaj në cloud",
    "cloud.saving": "Duke ruajtur...",
    "cloud.refreshButton": "Rifresko listën",
    "cloud.loading": "Duke ngarkuar kalkulimet...",
    "cloud.manualSaveNote":
      "Ruajtja në cloud bëhet vetëm kur shtyp butonin “Ruaj në cloud”.",
    "cloud.listTitle": "Kalkulimet e ruajtura në cloud",
    "cloud.empty": "Nuk ka ende kalkulime të ruajtura në cloud.",
    "cloud.updatedAt": "Përditësuar më",
    "cloud.open": "Hap",
    "cloud.delete": "Fshi",
    "cloud.saved": "Kalkulimi u ruajt në cloud.",
    "cloud.opened": "Kalkulimi u hap nga cloud.",
    "cloud.deleted": "Kalkulimi u fshi nga cloud.",
    "cloud.deleteConfirm":
      "A je i sigurt që dëshiron ta fshish këtë kalkulim nga cloud?",
    "cloud.error.unauthenticated":
      "Duhet të kyçesh para se të ruash në cloud.",
    "cloud.error.load":
      "Kalkulimet në cloud nuk u ngarkuan. Provo përsëri.",
    "cloud.error.save":
      "Kalkulimi nuk u ruajt në cloud. Provo përsëri.",
    "cloud.error.delete":
      "Kalkulimi nuk u fshi nga cloud. Provo përsëri.",
    "cloud.error.invalidPayload":
      "Ky kalkulim në cloud ka të dhëna të pavlefshme ose të papajtueshme dhe nuk mund të hapet.",
    "reset.startNew": "Fillo kalkulim të ri",
    "reset.confirm":
      "A je i sigurt që dëshiron të pastrosh kalkulimin aktual?",
    "reset.confirmButton": "Po, pastro",
    "reset.cancelButton": "Anulo",
    "summary.aboveNisab":
      "Pasuria neto e kalon nisabin. Zekati është llogaritur me 2.5%.",
    "summary.belowNisab": "Nuk ka zekat monetar — pasuria neto është nën nisab.",
    "status.above": "Mbi nisab",
    "status.below": "Nën nisab",
    "status.incomplete": "Kërkon plotësim",
    "livestock.noSheepGoatZakat":
      "Nuk ka zekat — nën nisabin prej 40 frymëve",
    "livestock.sheepGoatZakat":
      "{count} dele/dhi (nga {total} frymë të vlefshme)",
    "livestock.noCattleZakat":
      "Nuk ka zekat — nën nisabin prej 30 frymëve",
    "livestock.noCamelZakat": "Nuk ka zekat — nën nisabin prej 5 frymëve",
    "livestock.validCount": "{total} frymë të vlefshme",
    "crop.title": "Zekati i të korrave",
    "report.title": "Raporti i kalkulimit",
    "report.date": "Data e kalkulimit: {date}",
    "report.print": "Printo / Ruaj si PDF",
    "report.monetaryTitle": "Zekati monetar",
    "report.calculatedNisab": "Nisabi i llogaritur",
    "report.livestockTitle": "Zekati i bagëtisë kullotëse",
    "report.livestockCountableTitle": "Zekati i bagëtisë së llogaritshme",
    "report.sheepGoats": "Dele dhe dhi",
    "report.cattleBuffalo": "Lopë dhe buaj",
    "report.camels": "Deve",
    "report.grazingAnimals": "frymë kullotëse",
    "report.cropTitle": "Zekati i të korrave",
    "report.zakat": "zekat",
    "report.verificationTitle": "Kërkon verifikim",
    "report.livestockVerification": "Bagëti që kërkon verifikim",
    "report.jewelryVerification": "Stoli që kërkojnë metodologji",
    "report.cryptoVerification": "Kripto që kërkon verifikim",
    "report.otherAssetsVerification": "Pasuri të tjera që kërkojnë verifikim",
    "report.investmentTreatment": "Trajtimi i investimit",
    "report.investmentIncluded": "Vlera e investimit e përfshirë",
    "report.investmentExcluded": "Vlera e përjashtuar / për verifikim",
    "report.loanType": "Lloji i kredisë",
    "report.principalDeduction": "Principali 12-mujor i zbritur",
    "report.interestNotDeducted": "Interes/kamatë e pazbritur",
    "report.ribaNote":
      "Kredia me kamatë/riba është çështje e ndaluar dhe kërkon konsultim me dijetar. Kalkulatori e ndan principalin nga kamata dhe nuk e llogarit kamatën si zekat.",
    "report.needsCheck": "Kërkon verifikim",
    "report.disclaimer":
      "Ky raport është ndihmës për kalkulim. Për raste të veçanta ose të paqarta, konsultohu me dijetar të besueshëm.",
    "payments.title": "Pagesat e zekatit monetar",
    "payments.required": "Zekati monetar i detyrueshëm",
    "payments.totalPaid": "Totali i paguar",
    "payments.remaining": "Mbetja për pagesë",
    "payments.date": "Data e pagesës",
    "payments.amount": "Shuma e paguar (EUR)",
    "payments.note": "Shënim opsional",
    "payments.add": "+ Regjistro pagesë",
    "payments.remove": "Hiq pagesën",
    "payments.item": "Pagesë {index}",
    "payments.exceeds":
      "Pagesat e regjistruara janë më të larta se rezultati monetar i kalkuluar.",
    "payments.inactive":
      "Regjistrimi i pagesës aktivizohet kur kalkulimi monetar është i plotë.",
    "payments.noteText":
      "Ky seksion shërben vetëm për regjistrimin e pagesave. Për mënyrën dhe kohën e pagesës, konsultohu me dijetar të besueshëm.",
    "plannedPayments.title": "Planifiko pagesën",
    "plannedPayments.amount": "Shuma që dëshiron të paguash tani (EUR)",
    "plannedPayments.date": "Data e planifikuar e pagesës",
    "plannedPayments.note": "Shënim opsional",
    "plannedPayments.register": "Regjistro pagesën e planifikuar",
    "plannedPayments.total": "Pagesa të planifikuara",
    "plannedPayments.exceeds":
      "Pagesat e planifikuara tejkalojnë mbetjen aktuale për pagesë.",
    "plannedPayments.markPaid": "Shëno si të paguar",
    "plannedPayments.remove": "Hiq",
    "plannedPayments.confirmMarkPaid":
      "A je i sigurt që dëshiron ta shënosh këtë pagesë të planifikuar si të paguar?",
    "plannedPayments.noteText":
      "Pagesat e planifikuara janë vetëm kujtesë personale dhe nuk konsiderohen pagesë e kryer derisa të regjistrohen si të paguara.",
    "allocations.title": "Planifiko shpërndarjen e zekatit",
    "allocations.helper":
      "Kjo është vetëm një planifikim i shpërndarjes. Verifiko përputhshmërinë e përfituesit para pagesës.",
    "allocations.add": "+ Shto përfitues / ndarje",
    "allocations.item": "Ndarje {index}",
    "allocations.remove": "Hiq",
    "allocations.category": "Kategoria",
    "allocations.category.poorNeedy": "Të varfrit dhe nevojtarët",
    "allocations.category.poorNeedyHelper":
      "Mbulon dy kategoritë kuranore: Fuqarā’ dhe Masākīn.",
    "allocations.category.administrators": "Administratorët e zekatit",
    "allocations.category.hearts": "Muallafët / afrimi i zemrave",
    "allocations.category.slavery": "Lirimi nga robëria",
    "allocations.category.debtors": "Borxhlinjtë",
    "allocations.category.cause": "Në rrugën e Allahut",
    "allocations.category.traveler": "Udhëtari i mbetur pa mjete",
    "allocations.description": "Emri ose përshkrimi",
    "allocations.descriptionPlaceholder": "Familje në nevojë",
    "allocations.amount": "Shuma e planifikuar (EUR)",
    "allocations.note": "Shënim",
    "allocations.required": "Zekati monetar i detyrueshëm",
    "allocations.planned": "Shpërndarja e planifikuar",
    "allocations.remaining": "Për t’u shpërndarë",
    "allocations.exceeds":
      "Shpërndarja e planifikuar tejkalon zekatin monetar të kalkuluar.",
    "allocations.empty": "Nuk ke shtuar ende ndarje të planifikuara.",
    "allocations.categoryVerification":
      "Kjo kategori kërkon verifikim për rastin konkret.",
    "allocations.transparencyNote":
      "Kurani 9:60 përmend 8 kategori. Në këtë kalkulator, ‘Të varfrit dhe nevojtarët’ janë bashkuar në një grup praktik për planifikim, por mbulojnë dy kategoritë e veçanta kuranore.",
    "allocations.sourceNote": "Kategoritë bazohen në Kurani 9:60.",
    "allocations.reportTitle":
      "Shpërndarja e planifikuar e zekatit monetar",
    "allocations.reportCoverage":
      "7 grupe planifikimi që mbulojnë 8 kategoritë e përmendura në Kurani 9:60.",
  },
  en: {
    "language.label": "Language",
    "language.sq": "Shqip",
    "language.en": "English",
    "nav.back": "← Back to home",
    "nav.primaryAria": "Primary navigation",
    "nav.fullCalculation": "Full calculation",
    "brand.homeAria": "Zakat - Home",
    "brand.tagline": "Trusted calculator",
    "hero.kicker": "Quick calculation without registration",
    "hero.title": "Zakat Calculator",
    "hero.description":
      "Select only the assets you have. Other sections remain closed.",
    "hero.simpleMode":
      "Simple calculation: cash, gold, and jewelry — no login required.",
    "hero.fullMode":
      "Full calculation: all categories and the detailed report.",
    "hero.openFull": "Open the full calculation →",
    "hero.featuresAria": "Key features",
    "hero.feature.clear": "Clear",
    "hero.feature.secure": "Secure",
    "hero.feature.steps": "Step by step",
    "preferences.title": "Preferences",
    "preferences.start": "Start calculating",
    "privacy.device": "Your calculation data stays on your device.",
    "usageGuide.title": "How to use the app",
    "usageGuide.step1":
      "First fill in the calculation date and Nisab details.",
    "usageGuide.step2":
      "Activate only the asset categories you have and complete the required fields.",
    "usageGuide.step3":
      "Review the summary and the calculation check section before saving or printing the report.",
    "usageGuide.note":
      "Do not enter the same asset in two different sections.",
    "install.title": "Install the app",
    "install.text":
      "You can add the calculator to your phone home screen for faster access.",
    "install.android":
      "Android / Chrome: Open the ⋮ menu and choose ‘Install app’ or ‘Add to Home screen’.",
    "install.iphone":
      "iPhone / Safari: Tap Share and choose ‘Add to Home Screen’.",
    "install.offlineNote":
      "Pages you have opened before may remain available when your connection drops.",
    "install.open": "Open phone installation",
    "summary.jump": "Go to summary",
    "simple.lockedTitle": "Other categories are limited",
    "simple.lockedText":
      "Silver, currencies, debts, crypto, business, livestock, crops, saved calculations, and the report are available in the full version.",
    "footer.preparedBy": "Prepared by",
    "common.activate": "Enable",
    "common.choose": "Select",
    "common.remove": "Remove",
    "common.yes": "Yes",
    "common.no": "No",
    "common.unsure": "I am not sure",
    "common.other": "Other",
    "common.description": "Description",
    "common.optionalDescription": "Optional description",
    "common.value": "Calculated value: {value}",
    "common.required": "Required",
    "placeholder.example70": "Example: 70",
    "placeholder.example085": "Example: 0.85",
    "placeholder.example5000": "Example: 5000",
    "placeholder.exampleJpy": "Example: JPY",
    "placeholder.example092": "Example: 0.92",
    "placeholder.example95": "Example: 95",
    "placeholder.example110": "Example: 1.10",
    "inventory.title": "Trade Goods and Business Inventory",
    "inventory.helper":
      "Enter only goods or assets held mainly for resale. Use the current market value on the Zakat date, not necessarily the original purchase price.",
    "inventory.reminder":
      "Do not enter cash/bank money, trade livestock, gold, silver, crypto, or receivables here if you already added them in their own sections.",
    "inventory.item": "Trade item {index}",
    "inventory.type": "Type",
    "inventory.resaleGoods": "Goods for resale",
    "inventory.rawMaterial": "Raw material for a product to be sold",
    "inventory.finishedGoods": "Finished product for sale",
    "inventory.resaleProperty": "Land/property bought only for resale",
    "inventory.descriptionPlaceholder": "Clothing stock",
    "inventory.marketValue": "Current market value ({currency})",
    "inventory.heldForResale": "Is it mainly held for resale?",
    "inventory.excludedNote":
      "This asset was not included as trade inventory because it was not marked as mainly held for resale.",
    "inventory.add": "+ Add trade item",
    "inventory.note":
      "Goods held for resale are included at their market value on the Zakat date. Do not enter equipment, machinery, furniture, or vehicles used as operating tools in the business.",
    "otherAssets.title": "Other assets and investments",
    "otherAssets.helper":
      "Use this section only for assets you have not entered under cash, gold, silver, crypto, trade inventory, receivables, or other categories. Do not enter the same value twice.",
    "otherAssets.item": "Asset {index}",
    "otherAssets.type": "Type",
    "otherAssets.type.stocks": "Shares / investment funds",
    "otherAssets.type.financialDeposit": "Deposit or financial investment",
    "otherAssets.type.businessParticipation": "Business participation",
    "otherAssets.type.otherFinancial": "Other financial asset",
    "otherAssets.type.other": "Other",
    "otherAssets.description": "Description",
    "otherAssets.descriptionPlaceholder": "E.g. investment fund or business share",
    "otherAssets.currentValue": "Current value (EUR)",
    "otherAssets.investmentPurpose": "Investment purpose",
    "otherAssets.purpose.placeholder": "Select the purpose",
    "otherAssets.purpose.trade": "For trade / resale",
    "otherAssets.purpose.longTerm": "Long-term investment / dividends",
    "otherAssets.purpose.companyPays": "The company pays Zakat",
    "otherAssets.purpose.includeFull": "Include the full value for caution",
    "otherAssets.purpose.unsure": "I am not sure",
    "otherAssets.investmentCurrentValue": "Current investment value (EUR)",
    "otherAssets.zakatablePercentage": "Zakatable assets portion (%)",
    "otherAssets.percentageVerification":
      "The percentage must be from 0 to 100. Without a valid percentage, the value is not included automatically and needs verification.",
    "otherAssets.companyPaysNote":
      "The company indicates that it pays Zakat. Do not count the same asset twice.",
    "otherAssets.dividendsHeld": "Dividends received and still held (EUR)",
    "otherAssets.dividendsInCash":
      "Have these dividends already been entered under cash/bank?",
    "otherAssets.loanQuestion":
      "Was this investment financed with a loan/debt?",
    "otherAssets.loan.none": "No",
    "otherAssets.loan.interestFree": "Yes, interest-free / halal loan",
    "otherAssets.loan.conventional": "Yes, interest-bearing / conventional loan",
    "otherAssets.loan.unsure": "I am not sure",
    "otherAssets.totalLoanOutstanding": "Total remaining debt (informational)",
    "otherAssets.totalLoanInformative":
      "This amount is informational only and does not affect totals automatically.",
    "otherAssets.principalDue": "Principal due within 12 months (EUR)",
    "otherAssets.principalAlreadyInDebts":
      "Have you already entered this principal under Deductible debts?",
    "otherAssets.interestDue": "Interest expected within 12 months (EUR)",
    "otherAssets.ribaWarning":
      "This loan contains interest/riba. The application does not automatically treat interest as deductible and does not calculate it as Zakat. Repentance and consultation with a trusted scholar are required.",
    "otherAssets.loanUnsureWarning":
      "The loan type needs verification. No loan-related amount is deducted automatically.",
    "otherAssets.treatment": "Treatment in calculation",
    "otherAssets.treatment.include": "Include in monetary Zakat",
    "otherAssets.treatment.exclude":
      "Do not include - personal use or operating asset",
    "otherAssets.treatment.verify": "Needs methodology verification",
    "otherAssets.add": "+ Add asset",
    "otherAssets.descriptionRequired":
      "Description is required when a value is entered.",
    "otherAssets.note":
      "Shares, funds, business participation, and similar assets may require verification. The app includes only the value you explicitly chose to include.",
    "otherAssets.reportTitle": "Other assets and investments",
    "nisab.title": "1. Nisab and Lunar Year",
    "nisab.currency": "Currency",
    "nisab.basis": "Nisab basis",
    "nisab.gold": "Gold",
    "nisab.silver": "Silver",
    "nisab.manual": "Manual value",
    "nisab.goldOption": "Gold — 85 g pure gold (24K)",
    "nisab.silverOption": "Silver — 595 g pure silver",
    "nisab.manualOption": "Value set by scholar / organization",
    "nisab.goldSummary": "Gold — 85 g",
    "nisab.silverSummary": "Silver — 595 g",
    "nisab.goldAmount": "Gold nisab",
    "nisab.silverAmount": "Silver nisab",
    "nisab.goldPrice": "24K gold price in {currency} per gram",
    "nisab.silverPrice": "Silver price in {currency} per gram",
    "nisab.manualValue": "Set monetary nisab ({currency})",
    "nisab.manualHelper":
      "Use this option when you follow a value defined by your scholar or organization.",
    "nisab.monetary": "Monetary nisab ({currency})",
    "nisab.helper":
      "Enter the nisab value you use for calculation. Automatic prices will be added later.",
    "nisab.lunarYear":
      "Has one lunar year passed over the zakatable assets?",
    "nisab.needNisab": "Enter the nisab to complete the monetary calculation.",
    "nisab.needYear":
      "The monetary calculation requires lunar-year confirmation.",
    "nisab.note":
      "For modern money, the gold or silver basis can be used. The app shows the choice clearly and does not fetch automatic prices at this stage.",
    "assets.title": "2. Which assets do you have?",
    "assets.money": "Cash and savings",
    "assets.goldJewelry": "Gold",
    "assets.silver": "Silver",
    "assets.personalJewelry": "Personal jewelry",
    "assets.crypto": "Crypto",
    "assets.livestock": "Livestock",
    "assets.crops": "Agriculture and crops",
    "money.title": "3. Cash and savings",
    "money.cash": "Cash on hand",
    "money.bank": "Bank balance",
    "money.savings": "Savings",
    "money.receivablesOld": "Debts expected to be received",
    "fx.title": "Other currencies",
    "fx.helper":
      "Enter money held in other currencies. The rate is entered manually based on the value on the Zakat calculation date. Do not add money here if you already entered it in the existing {currency} fields. A reference exchange-rate API such as XE or a similar service may be added later, but the final rate remains for manual verification.",
    "fx.row": "Currency {index}",
    "fx.currency": "Currency",
    "fx.custom": "Currency code or name",
    "fx.amount": "Amount in that currency",
    "fx.rate": "How many {currency} is 1 unit of this currency?",
    "fx.equivalent": "Equivalent: {value}",
    "fx.incomplete": "Enter the amount and the rate in {currency}.",
    "fx.add": "+ Add currency",
    "fx.source": "Source",
    "fx.loading": "Fetching rates...",
    "fx.button": "Get automatic rates",
    "fx.unavailable": "Rates could not be fetched. You can enter them manually.",
    "debts.title": "Debts and Receivables",
    "debts.receivablesTitle": "Money others owe you",
    "debts.receivablesHelper":
      "Enter only amounts expected to be collected. Uncertain amounts are not automatically included in the monetary calculation.",
    "debts.receivableRow": "Receivable {index}",
    "debts.receivablePlaceholder": "Loan to a friend",
    "debts.amount": "Amount in {currency}",
    "debts.status": "Status",
    "debts.secure": "Secure to collect",
    "debts.doubtful": "Uncertain / disputed",
    "debts.doubtfulNote":
      "This was not included in monetary assets because collection is not certain.",
    "debts.addReceivable": "+ Add receivable",
    "debts.includedReceivables": "Included receivables: {value}",
    "debts.liabilitiesTitle": "Your deductible debts",
    "debts.liabilitiesHelper":
      "Enter only the amount due now or within the next 12 months. Do not enter the entire long-term obligation, such as the full obligation for a home.",
    "debts.liabilityRow": "Liability {index}",
    "debts.type": "Type",
    "debts.personalLoan": "Personal debt",
    "debts.installment": "Installment obligation / debt within 12 months",
    "debts.businessBill": "Business bill or liability",
    "debts.card": "Card liability",
    "debts.dueWithinYear": "Amount due within 12 months ({currency})",
    "debts.addLiability": "+ Add liability",
    "debts.deductible": "Deductible debts: {value}",
    "debts.methodologyNote":
      "Rules for debts and receivables can differ among Sunni schools. This calculator uses only debts due within 12 months and receivables that are secure to collect.",
    "gold.title": "4. Gold",
    "gold.type": "Gold type",
    "gold.investment": "Gold for investment or trade",
    "gold.personalJewelry": "Jewelry for personal use",
    "gold.treatment": "Treatment in calculation",
    "gold.include": "Include it in Zakat calculation",
    "gold.exclude": "Do not include personal jewelry",
    "gold.warning": "Requires scholar verification.",
    "gold.price": "Pure gold price per gram in {currency}",
    "gold.grams": "{karat} gold in grams",
    "gold.note": "14K gold is automatically calculated as 14/24 pure gold.",
    "metals.button": "Get gold and silver prices",
    "metals.loading": "Fetching prices...",
    "metals.source": "Source: Metals.Dev",
    "metals.updated": "Updated",
    "metals.notConfigured":
      "The Metals.Dev key is not configured. You can enter prices manually.",
    "metals.unavailable": "Prices could not be fetched. Manual values remain active.",
    "metals.title": "Gold and silver",
    "silver.title": "5. Silver",
    "silver.grams": "Silver in grams",
    "silver.price": "Price per gram in {currency}",
    "jewelry.title": "Personal jewelry",
    "jewelry.helper":
      "Personal jewelry differs in treatment. Choose the method you follow or consult a scholar.",
    "jewelry.includePersonal": "Include personal jewelry in Zakat",
    "jewelry.hanafi": "Hanafi position",
    "jewelry.excludePersonal": "Exclude permitted personal-use jewelry",
    "jewelry.malikiShafiHanbali":
      "A known position in the Maliki, Shafi'i, and Hanbali schools",
    "jewelry.unsureHelper":
      "I do not know which method to follow for personal jewelry.",
    "jewelry.warning":
      "If you are not sure, do not rely only on this result. Ask a qualified scholar or knowledgeable person about your case.",
    "jewelry.item": "Jewelry item {index}",
    "jewelry.material": "Material",
    "jewelry.purity": "Purity",
    "jewelry.weight": "Weight in grams",
    "jewelry.purpose": "Purpose",
    "jewelry.personalUse": "Personal use",
    "jewelry.savings": "Savings / store of value",
    "jewelry.trade": "For trade",
    "jewelry.goldPrice": "24K price in {currency} per gram",
    "jewelry.silverPrice": "Price in {currency} per gram",
    "jewelry.add": "+ Add jewelry",
    "jewelry.note":
      "Jewelry held for savings, store of value, or trade is included in monetary assets. Personal-use jewelry differs in treatment; the app applies only the choice made above.",
    "crypto.title": "Crypto",
    "crypto.amount": "{asset} amount",
    "crypto.price": "Manual price for 1 {asset} in {currency}",
    "crypto.usdtPrice": "Price for 1 USDT in {currency}",
    "crypto.other": "Other (manual total value)",
    "crypto.warning": "Requires scholar verification.",
    "crypto.methodologyTitle": "Crypto treatment in calculation",
    "crypto.include": "Include by market value",
    "crypto.verify": "Needs verification — do not include automatically",
    "crypto.unsure": "I am not sure",
    "crypto.marketValue": "Current crypto value ({currency})",
    "crypto.unsureWarning":
      "Choose the crypto treatment before the final result.",
    "crypto.note":
      "Crypto assets involve contemporary issues that may require verification. The app does not decide the permissibility ruling for an asset.",
    "livestock.title": "Livestock",
    "livestock.group": "Livestock group {index}",
    "livestock.addGroup": "+ Add livestock group",
    "livestock.noType": "No type",
    "livestock.animalType": "Animal type",
    "livestock.otherAnimal": "Enter animal type",
    "livestock.otherAnimalPlaceholder": "Animal type",
    "livestock.grazingCount": "Grazing animals",
    "livestock.tradeCount": "Trade animals",
    "livestock.totalAnimals": "Total animal count",
    "livestock.grazesMostYear": "Do they graze most of the year?",
    "livestock.grazingYes": "Yes, they graze most of the year",
    "livestock.grazingNo":
      "No / mostly fed with purchased or farm feed",
    "livestock.tradeMarketValue": "Total market value for trade animals",
    "livestock.animal.Dele": "Sheep",
    "livestock.animal.Dhi": "Goats",
    "livestock.animal.Lopë": "Cattle",
    "livestock.animal.Buaj": "Buffalo",
    "livestock.animal.Deve": "Camels",
    "livestock.animal.Tjetër": "Other",
    "livestock.fedMethodologyShortTitle": "Methodology for fed livestock",
    "livestock.fedMajorityShort": "Sunni majority",
    "livestock.fedMalikiShortOption": "Maliki",
    "livestock.fedMethodologyTitle":
      "Methodology for livestock mostly fed with purchased feed",
    "livestock.fedMajority":
      "Sunni majority — do not calculate by animal count",
    "livestock.fedMaliki": "Maliki — calculate by animal count",
    "livestock.fedMajorityNote":
      "Fed livestock is not calculated by animal count under the Sunni majority method.",
    "livestock.fedMalikiNote":
      "This portion is included in the physical calculation under the Maliki methodology.",
    "livestock.fedUnsureNote":
      "Choose the treatment for fed livestock.",
    "livestock.otherVerification":
      "This category needs verification for physical calculation.",
    "livestock.fedMalikiShort": "fed under Maliki",
    "livestock.countableAnimals": "countable animals",
    "livestock.methodologyNote":
      "Trade livestock is calculated by market value and enters monetary Zakat. Grazing livestock is kept separate and its animal-count Zakat is calculated according to the choice selected above. Livestock marked “No” is included only when Maliki is selected; under the Sunni majority it is not shown as an error, while “I am not sure” goes to verification.",
    "livestock.sheepTradeNote":
      "Sheep and goats for trade do not enter this table. They are calculated only by market value and included in monetary Zakat at 2.5%.",
    "livestock.cattleBuffaloNote":
      "Grazing cattle and buffalo are combined for nisab and calculation. Trade livestock enters monetary Zakat only by market value. The result applies when the lunar-year condition and calculator choices are met.",
    "livestock.camelNote":
      "Camels for trade are calculated only by market value and enter monetary Zakat. Grazing camels are calculated separately by animal count.",
    "crop.sectionTitle": "Agriculture and crops",
    "crop.item": "Crop {index}",
    "crop.add": "+ Add crop",
    "crop.noType": "No type",
    "crop.noIrrigation": "No irrigation method",
    "crop.type": "Crop type",
    "crop.otherType": "Enter crop type",
    "crop.otherTypePlaceholder": "Crop type",
    "crop.quantity": "Harvested quantity",
    "crop.nisabKg": "Selected nisab in kg",
    "crop.nisabHelper":
      "The base nisab is 5 wasq. Conversion to kg can differ by product and methodology.",
    "crop.irrigation": "Irrigation method",
    "crop.irrigation.natural": "Natural",
    "crop.irrigation.cost": "With cost",
    "crop.irrigation.mixed": "Mixed",
    "crop.irrigation.unsure": "I am not sure",
    "crop.type.Grurë": "Wheat",
    "crop.type.Elb": "Barley",
    "crop.type.Oriz": "Rice",
    "crop.type.Misër": "Corn",
    "crop.type.Bishtajore": "Legumes",
    "crop.type.Hurma": "Dates",
    "crop.type.Rrush / rrush i thatë": "Grapes / raisins",
    "crop.type.Ullinj": "Olives",
    "crop.type.Tjetër": "Other",
    "crop.otherVerification":
      "This product requires verification for calculation.",
    "crop.chooseTypeMessage": "Choose the crop type for calculation.",
    "crop.belowNisab": "No Zakat — below the selected nisab",
    "crop.unsureIrrigationNote":
      "For unclear irrigation, the app does not give an automatic result. If you know both irrigation methods were used, choose ‘Mixed — 7.5%’. To avoid under-calculation risk, you may choose ‘Natural — 10%’ or consult a scholar.",
    "crop.chooseIrrigationMessage": "Choose the irrigation method for calculation.",
    "crop.note":
      "Crop Zakat is calculated at harvest time and does not enter monetary Zakat at 2.5%. Rules for crop types may differ among Sunni schools.",
    "crop.mixedRateNote":
      "7.5% is used as an operational middle value when natural irrigation and irrigation with cost were both used, but the exact ratio is unknown. If natural irrigation predominates, use 10%; if cost irrigation predominates, use 5%. This result is indicative and may require verification.",
    "deductible.title": "6. Deductible liabilities",
    "deductible.label": "Debts / liabilities you owe",
    "summary.title": "Summary",
    "summary.cashSavings": "Cash and savings",
    "summary.foreignCurrencies": "Other currencies in {currency}",
    "summary.pureGold": "Pure gold",
    "summary.goldValue": "Gold value",
    "summary.silverValue": "Silver value",
    "summary.personalJewelryIncluded": "Personal jewelry included",
    "summary.personalJewelryExcluded": "Personal jewelry excluded",
    "summary.jewelryNeedsMethod": "Jewelry needing methodology",
    "summary.jewelryTrade": "Gold/silver for savings or trade",
    "summary.crypto": "Crypto value",
    "summary.cryptoIncluded": "Crypto included",
    "summary.cryptoVerification": "Crypto needing verification",
    "summary.tradeLivestock": "Trade livestock",
    "summary.businessInventory": "Included trade inventory",
    "summary.otherAssetsIncluded": "Other assets included",
    "summary.otherAssetsExcluded": "Other assets excluded",
    "summary.otherAssetsVerification": "Other assets needing verification",
    "summary.investmentsIncluded": "Investments included",
    "summary.dividendsIncluded": "Dividends included",
    "summary.investmentPrincipalDeducted":
      "Loan principal deducted from investments",
    "summary.interestLoanVerification": "Interest-bearing loan: needs verification",
    "summary.interestNotDeducted": "Interest not deducted",
    "summary.sheepGoats": "Grazing sheep and goats",
    "summary.sheepGoatsCountable": "Countable sheep/goats",
    "summary.sheepGoatZakat": "Zakat on grazing sheep/goats",
    "summary.sheepGoatZakatCountable": "Zakat on countable sheep/goats",
    "summary.cattleBuffalo": "Grazing cattle and buffalo",
    "summary.cattleBuffaloCountable": "Countable cattle/buffalo",
    "summary.cattleBuffaloZakat": "Zakat on grazing cattle/buffalo",
    "summary.cattleBuffaloZakatCountable": "Zakat on countable cattle/buffalo",
    "summary.camels": "Grazing camels",
    "summary.camelsCountable": "Countable camels",
    "summary.camelZakat": "Zakat on grazing camels",
    "summary.camelZakatCountable": "Zakat on countable camels",
    "summary.needsVerification": "Needs verification",
    "summary.assetsBeforeDebts": "Monetary assets before debts",
    "summary.includedReceivables": "Included receivables",
    "summary.deductibleDebts": "Deductible debts",
    "summary.nisabBasis": "Nisab basis",
    "summary.selectedNisab": "Selected nisab",
    "summary.needsCompletion": "Needs completion",
    "summary.netAssets": "Zakatable net assets",
    "summary.lunarYear": "Lunar year",
    "summary.status": "Status",
    "summary.monetaryZakat": "Monetary Zakat 2.5%",
    "summary.calculatedMonetary": "Calculated monetary Zakat",
    "summary.formula": "Formula",
    "summary.zakatReport": "Zakat report",
    "summary.countableAssets": "Countable assets",
    "summary.youOwe": "You should give",
    "readiness.title": "Check calculation",
    "readiness.status.ready": "Ready for result",
    "readiness.status.incomplete": "Needs completion",
    "readiness.status.verification": "Needs verification",
    "readiness.group.completion": "To complete",
    "readiness.group.verification": "To verify",
    "readiness.goToSection": "Go to section",
    "readiness.note":
      "The result uses only the values included according to the choices and methodologies selected in the calculator.",
    "readiness.issue.nisab":
      "Complete the nisab value or the required price for the selected basis.",
    "readiness.issue.lunarYear":
      "Confirm whether one lunar year has passed for the wealth.",
    "readiness.issue.fx":
      "Complete the currency, amount, and EUR rate for the foreign-currency row.",
    "readiness.issue.gold":
      "Complete the gold weight and the 24K gold price per gram.",
    "readiness.issue.silver":
      "Complete the silver weight and price per gram.",
    "readiness.issue.jewelryFields":
      "Complete the weight and price for the jewelry entered.",
    "readiness.issue.cryptoValue": "Complete the current crypto value.",
    "readiness.issue.inventory":
      "Complete the needed value, description, or choice for trade inventory.",
    "readiness.issue.otherAssets":
      "Complete the required fields for the asset or investment.",
    "readiness.issue.tradeLivestock":
      "Complete the market value for livestock marked for trade.",
    "readiness.issue.grazingLivestock":
      "Complete the livestock type and grazing answer.",
    "readiness.issue.crops":
      "Complete the type, nisab, and irrigation for the crops entered.",
    "readiness.issue.cryptoMethodology":
      "The crypto choice needs methodology verification.",
    "readiness.issue.jewelryMethodology":
      "The methodology for personal jewelry is unclear.",
    "readiness.issue.fedLivestock":
      "Fed livestock needs a methodology choice.",
    "readiness.issue.otherLivestock":
      "Livestock marked as 'Other' needs verification.",
    "readiness.issue.otherCrop": "A crop marked as 'Other' needs verification.",
    "readiness.issue.unclearIrrigation":
      "Unclear irrigation needs verification before automatic calculation.",
    "readiness.issue.doubtfulReceivables":
      "Doubtful receivables are not included automatically.",
    "readiness.issue.goldJewelry":
      "Personal gold needs verification according to the selected methodology.",
    "readiness.issue.otherAssetsMethodology":
      "Other assets marked for verification are not included automatically.",
    "readiness.issue.investmentPurpose": "Complete the investment purpose.",
    "readiness.issue.investmentPercentage":
      "A long-term investment needs a valid zakatable-assets percentage.",
    "readiness.issue.investmentLoanInterest":
      "The interest/riba-based loan needs verification and consultation with a scholar.",
    "readiness.issue.investmentLoanUnsure":
      "The investment loan type needs verification.",
    "readiness.issue.investmentPrincipalDuplicate":
      "Check that the loan principal is not deducted twice; it is marked as already entered under deductible debts.",
    "methodology.title": "Selected methodology",
    "methodology.included": "Included",
    "methodology.excluded": "Excluded",
    "methodology.needsMethodology": "Needs methodology",
    "methodology.needsVerification": "Needs verification",
    "methodology.cropsIrrigation": "Crops: irrigation method",
    "methodology.reportNote":
      "This report is based on the choices made in the calculator. For unclear cases, consult a trusted scholar.",
    "sources.title": "Sunni calculation sources",
    "sources.open": "Open source",
    "sources.verificationTitle": "Modern or special issues",
    "sources.cryptoVerification":
      "Crypto: Requires verification / consultation with a scholar.",
    "sources.jewelryVerification":
      "Personal jewelry: Requires verification / consultation with a scholar.",
    "sources.debtsVerification":
      "Debts: Requires verification / consultation with a scholar.",
    "sources.fedLivestockVerification":
      "Fed livestock: Requires verification / consultation with a scholar.",
    "sources.specialCropsVerification":
      "Special agricultural products: Requires verification / consultation with a scholar.",
    "calculationDate.title": "Calculation date",
    "calculationDate.label": "Date when you are calculating Zakat",
    "calculationDate.helper":
      "Use the date when you check your wealth and Zakat obligation.",
    "calculationDate.savedLabel": "Calculation date",
    "calculationDate.notSaved": "Date was not saved",
    "saved.title": "Save calculation",
    "saved.nameLabel": "Calculation name",
    "saved.saveButton": "Save this calculation",
    "saved.helper":
      "Calculations are saved only on this device and browser. They are not sent to the server.",
    "saved.listTitle": "Saved calculations",
    "saved.unnamed": "Unnamed calculation",
    "saved.open": "Open",
    "saved.delete": "Delete",
    "saved.deleteAll": "Delete all",
    "saved.export": "Export calculations",
    "saved.import": "Import calculations",
    "saved.backupPrivacy":
      "The backup contains only calculations you saved on this device. Do not send the file to other people if it contains personal or financial data.",
    "saved.empty": "There are no saved calculations yet.",
    "saved.limitMessage":
      "At most 10 calculations can be saved. Delete an old calculation to save a new one.",
    "saved.savedMessage": "The calculation was saved in this browser.",
    "saved.openedMessage": "The saved calculation was opened.",
    "saved.deletedMessage": "The saved calculation was deleted.",
    "saved.deletedAllMessage": "All saved calculations were deleted.",
    "saved.exportEmpty": "There are no saved calculations to export.",
    "saved.exportedMessage": "The calculations backup was downloaded.",
    "saved.importedMessage": "Imported {count} saved calculations.",
    "saved.importNoNew":
      "This backup does not contain new calculations to import.",
    "saved.importInvalidJson":
      "The file is not valid JSON. Choose a backup exported from the calculator.",
    "saved.importInvalidBackup":
      "The file does not match the calculator backup structure.",
    "saved.importLimitMessage":
      "The import would exceed the limit of 10 saved calculations. Delete some calculations and try again.",
    "saved.importReadError":
      "The file could not be read. Try again with a valid JSON file.",
    "saved.saveError":
      "The calculation was not saved. Check whether the browser allows local storage.",
    "saved.loadError":
      "Saved calculations could not be read from this browser.",
    "saved.savedAt": "Saved at",
    "saved.deleteConfirm": "Are you sure you want to delete this calculation?",
    "saved.deleteAllConfirm":
      "Are you sure you want to delete all saved calculations?",
    "saved.localStorageLabel":
      "Local storage — these calculations stay only on this device and browser.",
    "cloud.title": "Cloud calculations",
    "cloud.helper":
      "Separate storage in your account. Local calculations are not merged into this list.",
    "cloud.checking": "Checking the account...",
    "cloud.signedOutSummary": "Sign-in required",
    "cloud.count": "{count} cloud calculations",
    "cloud.loginMessage":
      "Sign in to save calculations in the cloud.",
    "cloud.loginButton": "Sign in / Register",
    "cloud.account": "Saved in account: {email}",
    "cloud.nameLabel": "Calculation name",
    "cloud.unnamed": "Unnamed calculation",
    "cloud.saveButton": "Save to cloud",
    "cloud.saving": "Saving...",
    "cloud.refreshButton": "Refresh list",
    "cloud.loading": "Loading calculations...",
    "cloud.manualSaveNote":
      "Cloud storage occurs only when you press “Save to cloud”.",
    "cloud.listTitle": "Calculations saved in the cloud",
    "cloud.empty": "There are no cloud calculations yet.",
    "cloud.updatedAt": "Last updated",
    "cloud.open": "Open",
    "cloud.delete": "Delete",
    "cloud.saved": "The calculation was saved to the cloud.",
    "cloud.opened": "The calculation was opened from the cloud.",
    "cloud.deleted": "The calculation was deleted from the cloud.",
    "cloud.deleteConfirm":
      "Are you sure you want to delete this cloud calculation?",
    "cloud.error.unauthenticated":
      "You must sign in before saving to the cloud.",
    "cloud.error.load":
      "Cloud calculations could not be loaded. Try again.",
    "cloud.error.save":
      "The calculation was not saved to the cloud. Try again.",
    "cloud.error.delete":
      "The cloud calculation was not deleted. Try again.",
    "cloud.error.invalidPayload":
      "This cloud calculation contains invalid or incompatible data and cannot be opened.",
    "reset.startNew": "Start a new calculation",
    "reset.confirm":
      "Are you sure you want to clear the current calculation?",
    "reset.confirmButton": "Yes, clear",
    "reset.cancelButton": "Cancel",
    "summary.aboveNisab":
      "Net assets are above nisab. Zakat was calculated at 2.5%.",
    "summary.belowNisab": "No monetary Zakat — net assets are below nisab.",
    "status.above": "Above nisab",
    "status.below": "Below nisab",
    "status.incomplete": "Needs completion",
    "livestock.noSheepGoatZakat": "No Zakat — below the 40-animal nisab",
    "livestock.sheepGoatZakat":
      "{count} sheep/goat (from {total} valid animals)",
    "livestock.noCattleZakat": "No Zakat — below the 30-animal nisab",
    "livestock.noCamelZakat": "No Zakat — below the 5-camel nisab",
    "livestock.validCount": "{total} valid animals",
    "crop.title": "Crop Zakat",
    "report.title": "Calculation report",
    "report.date": "Calculation date: {date}",
    "report.print": "Print / Save as PDF",
    "report.monetaryTitle": "Monetary Zakat",
    "report.calculatedNisab": "Calculated nisab",
    "report.livestockTitle": "Zakat on grazing livestock",
    "report.livestockCountableTitle": "Zakat on countable livestock",
    "report.sheepGoats": "Sheep and goats",
    "report.cattleBuffalo": "Cattle and buffalo",
    "report.camels": "Camels",
    "report.grazingAnimals": "grazing animals",
    "report.cropTitle": "Crop Zakat",
    "report.zakat": "Zakat",
    "report.verificationTitle": "Needs verification",
    "report.livestockVerification": "Livestock needing verification",
    "report.jewelryVerification": "Jewelry needing methodology",
    "report.cryptoVerification": "Crypto needing verification",
    "report.otherAssetsVerification": "Other assets needing verification",
    "report.investmentTreatment": "Investment treatment",
    "report.investmentIncluded": "Included investment value",
    "report.investmentExcluded": "Excluded / verification value",
    "report.loanType": "Loan type",
    "report.principalDeduction": "12-month principal deduction",
    "report.interestNotDeducted": "Interest not deducted",
    "report.ribaNote":
      "An interest/riba-based loan is prohibited and requires consultation with a scholar. The calculator separates principal from interest and does not calculate interest as Zakat.",
    "report.needsCheck": "Needs verification",
    "report.disclaimer":
      "This report helps with calculation. For special or unclear cases, consult a trusted scholar.",
    "payments.title": "Monetary Zakat payments",
    "payments.required": "Required monetary Zakat",
    "payments.totalPaid": "Total paid",
    "payments.remaining": "Remaining to pay",
    "payments.date": "Payment date",
    "payments.amount": "Amount paid (EUR)",
    "payments.note": "Optional note",
    "payments.add": "+ Register payment",
    "payments.remove": "Remove payment",
    "payments.item": "Payment {index}",
    "payments.exceeds":
      "Registered payments are higher than the calculated monetary result.",
    "payments.inactive":
      "Payment registration is enabled when the monetary calculation is complete.",
    "payments.noteText":
      "This section is only for recording payments. For the method and timing of payment, consult a trusted scholar.",
    "plannedPayments.title": "Plan payment",
    "plannedPayments.amount": "Amount you want to pay now (EUR)",
    "plannedPayments.date": "Planned payment date",
    "plannedPayments.note": "Optional note",
    "plannedPayments.register": "Register planned payment",
    "plannedPayments.total": "Planned payments",
    "plannedPayments.exceeds":
      "Planned payments exceed the current remaining balance.",
    "plannedPayments.markPaid": "Mark as paid",
    "plannedPayments.remove": "Remove",
    "plannedPayments.confirmMarkPaid":
      "Are you sure you want to mark this planned payment as paid?",
    "plannedPayments.noteText":
      "Planned payments are only a personal reminder and are not considered completed payment until registered as paid.",
    "allocations.title": "Plan Zakat distribution",
    "allocations.helper":
      "This is only distribution planning. Verify recipient eligibility before payment.",
    "allocations.add": "+ Add recipient / allocation",
    "allocations.item": "Allocation {index}",
    "allocations.remove": "Remove",
    "allocations.category": "Category",
    "allocations.category.poorNeedy": "The poor and the needy",
    "allocations.category.poorNeedyHelper":
      "Covers two Quranic categories: Fuqarā’ and Masākīn.",
    "allocations.category.administrators": "Zakat administrators",
    "allocations.category.hearts": "Those whose hearts are reconciled",
    "allocations.category.slavery": "Freeing from bondage",
    "allocations.category.debtors": "Debtors",
    "allocations.category.cause": "In the path of Allah",
    "allocations.category.traveler": "Stranded traveler",
    "allocations.description": "Name or description",
    "allocations.descriptionPlaceholder": "Family in need",
    "allocations.amount": "Planned amount (EUR)",
    "allocations.note": "Note",
    "allocations.required": "Required monetary Zakat",
    "allocations.planned": "Planned distribution",
    "allocations.remaining": "Remaining to distribute",
    "allocations.exceeds":
      "The planned distribution exceeds the calculated monetary Zakat.",
    "allocations.empty": "You have not added planned allocations yet.",
    "allocations.categoryVerification":
      "This category needs verification for the specific case.",
    "allocations.transparencyNote":
      "Quran 9:60 mentions 8 categories. In this calculator, 'The poor and the needy' are combined into one practical planning group, but they cover two distinct Quranic categories.",
    "allocations.sourceNote": "Categories are based on Quran 9:60.",
    "allocations.reportTitle": "Planned distribution of monetary Zakat",
    "allocations.reportCoverage":
      "7 planning groups covering the 8 categories mentioned in Quran 9:60.",
  },
};

export const translateCalculator = (
  language: CalculatorLanguage,
  key: string,
  vars: TranslationVars = {},
) => {
  const template =
    calculatorTranslations[language][key] ?? calculatorTranslations.sq[key] ?? key;

  return Object.entries(vars).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
    template,
  );
};
