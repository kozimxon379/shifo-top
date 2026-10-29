/**
 * Interactive Emergency First Aid Knowledge Base
 * Actionable, life-saving steps verified by emergency physicians
 */

export const emergencyProtocols = [
  {
    id: 'heart_attack',
    title: "Yurak Xuruji (Infarkt)",
    subtitle: "Ko'krak qafasida qisuvchi, achishtiruvchi og'riq",
    severity: "critical",
    signs: [
      "Ko'krak markazida kuchli bosim, qisilish yoki yonish hissi (15 daqiqadan ortiq)",
      "Og'riq chap qo'l, yelka, bo'yin, pastki jag' yoki orqa kurakka tarqalishi",
      "Sovuq ter bosishi, nafas qisishi, havo yetishmasligi",
      "Bosh aylanishi, o'lim qo'rquvi, kuchli holsizlik"
    ],
    actionSteps: [
      "Zudlik bilan 103 (Tez yordam) chaqiring! Operatorga «Yurak xurujiga shubha» deb ayting.",
      "Bemorga yarim o'tirgan holat bering (bosh va yelka balandroq, tizzalar bukilgan). Mutlaqo yotqizib yoki yurgizib qo'ymang!",
      "Bo'yinbog', yoqa, kamar va tor kiyimlarni yeching yoki bo'shating, derazani ochib toza havo kiriting.",
      "Agar allergiyasi bo'lmasa va oshqozon qon ketishi xavfi yo'q bo'lsa, 1 dona Aspirin (250-300 mg) tabletkasini chaynab yutishni bering (qon laxtasini to'xtatish uchun).",
      "Bemorning xushidan ketishini nazorat qiling. Agar hushdan ketsa va nafas to'xtasa, darhol yurak massajiga (CPR) o'ting!"
    ],
    prohibited: [
      "Bemorni o'rnidan turg'azish, yurgizish yoki jismoniy harakat qildirish qat'iyan man etiladi!",
      "Qon bosimini o'lchamasdan turib Nitroglitserin berish xavfli (bosim keskin tushib ketishi mumkin).",
      "Ko'krak ustiga qizdiruvchi banka, xantal yoki issiq grelka qo'ymang!"
    ]
  },
  {
    id: 'stroke',
    title: "Insult (Miya qon aylanishi buzilishi)",
    subtitle: "«FAST» tezkor xalqaro testi orqali 3 daqiqada aniqlash",
    severity: "critical",
    signs: [
      "F (Face / Yuz): Bemorga jilmayishni ayting. Yuzning bir tomoni (og'iz burchagi) pastga osilib qoladimi?",
      "A (Arms / Qo'llar): Ikkala qo'lni oldinga ko'tarishni so'rang. Bir qo'l holsizlanib, o'z-o'zidan pastga tushib ketadimi?",
      "S (Speech / Nutq): Oddiy gapni takrorlashni ayting (masalan: «Bugun havo yaxshi»). Nutq tushunarsiz, g'o'ldirab qoldimi?",
      "T (Time / Vaqt): Agar shu belgilardan hatto BITTASI bo'lsa ham — vaqt juda oz! «Oltin 4.5 soat» ichida kasalxonaga yetkazish shart!"
    ],
    actionSteps: [
      "Darhol 103 raqamiga qo'ng'iroq qiling va aniq «Insult belgilari bor» deb ayting.",
      "Bemorni boshini 30 gradus ko'targan holda qulay yotqizing.",
      "Nafas olishni erkinlashtirish uchun yoqani bo'shating, xonani shamollating.",
      "Agar qusish boshlansa, nafas yo'liga qusuq massasi ketib qolmasligi uchun bemorni YONBOSH holatga o'giring.",
      "Insult belgilari boshlangan aniq daqiqani eslab qoling (shifokorlar trombolizis qilishi uchun bu hayotiy muhim)."
    ],
    prohibited: [
      "Bemorga ovqat yoki suv berish taqiqlanadi (yutish refleksi buzilgan bo'lsa, o'pkaga tiqilib bo'g'adi).",
      "Spazmalgon, Sitramon kabi og'riq qoldiruvchilarni ichirmang.",
      "Qon bosimini birdaniga haddan tashqari tushirib yubormang (bu miyada qon oqimini to'xtatib qo'yishi mumkin)."
    ]
  },
  {
    id: 'choking',
    title: "Bo'g'ilish (Nafas yo'liga narsa tiqilishi)",
    subtitle: "Geymlix (Heimlich) usuli orqali zudlik bilan qutqarish",
    severity: "critical",
    signs: [
      "Inson birdaniga gapira olmay, nafas ololmay qolishi",
      "Ikkala qo'li bilan tomog'ini changallashi (Xalqaro bo'g'ilish belgisi)",
      "Yuz va lablarning ko'karishi (sianoz), ko'zlarining chaqchayishi",
      "Ovoz chiqmasdan samarasiz yo'talish yoki xirillash"
    ],
    actionSteps: [
      "Bemorning orqasiga o'ting, qo'llaringizni uning qorin sohasiga o'rang.",
      "Bir qo'lingizni musht qiling va bosh barmog'i tomonini bemorning kindigi bilan to'sh suyagi o'rtasiga qo'ying.",
      "Ikkinchi qo'lingiz bilan bu mushtni mahkam ushlang.",
      "Kuch bilan orqaga va YUQORIGA (o'zingizga va tepaga) qarab tez-tez keskin turtki bering (5 marta).",
      "Tiqilgan jism chiqquncha yoki bemor yo'tala olguncha takrorlang."
    ],
    prohibited: [
      "Bemor tik turgan holatda uning orqasiga shunchaki bexosdan urish taqiqlanadi (bu narsani chuqurroq tiqib yuborishi mumkin)!",
      "Og'iz bo'shlig'ida jism ko'rinmasa, ko'r-ko'rona barmoq tiqib qidirmang.",
      "Bemorga suv ichirishga urinmang."
    ]
  },
  {
    id: 'seizure',
    title: "Talvasa va Tutqanoq (Sudorogi)",
    subtitle: "Bosh miya zo'riqishi va tananing qattiq titrashi",
    severity: "high",
    signs: [
      "To'satdan hushdan ketish va yiqilish",
      "Tana, qo'l va oyoqlarning keskin tortilishi va titrashi",
      "Og'izdan ko'pik kelishi, jag'larning qisilib qolishi",
      "Ko'zlarning orqaga ketishi, lablarning ko'karishi"
    ],
    actionSteps: [
      "Bemorni qattiq ushlab turishga urinmang! Erkin harakatlanishiga xalaqit bermang.",
      "Boshining tagiga yumshoq narsa (yostiq, kurtka) qo'ying, atrofdagi qattiq va xavfli buyumlarni chetga suring.",
      "Talvasa to'xtashi bilan bemorni darhol YONBOSH holatga yotqizing (til orqaga ketmasligi va so'lak oqishi uchun).",
      "Tutqanoq necha daqiqa davom etganini aniq belgilang.",
      "103 ga qo'ng'iroq qiling (agar tutqanoq birinchi marta bo'layotgan bo'lsa yoki 5 daqiqadan oshsa)."
    ],
    prohibited: [
      "QAT'IYAN MAN ETILADI: Bemorning og'ziga qoshiq, tayoqcha yoki barmoq tiqmang! Bu tishlarni sindiradi va nafas yo'lini to'sadi.",
      "Bemorni kuch bilan bosib turmang (suyak sinishi xavfi bor).",
      "Hushiga kelmaguncha suv ichirmang va dori bermang."
    ]
  },
  {
    id: 'burns',
    title: "Kuyish (Qaynoq suv, olov yoki kimyoviy)",
    subtitle: "To'qimalarning shikastlanishini to'xtatish",
    severity: "medium",
    signs: [
      "Teri qizarishi, kuchli achishish va shish",
      "Suvli pufakchalar (qavariqlar) hosil bo'lishi",
      "Terining qorayishi yoki oqarishi"
    ],
    actionSteps: [
      "Kuygan joyni zudlik bilan OQAR SOVUQ SUV tagiga tuting (kamida 15-20 daqiqa davomida!). Bu to'qimalarning chuqur kuyishini to'xtatadi.",
      "Sovutgandan keyin toza, quruq, qisilmaydigan steril bint yoki toza mato bilan yengil yoping.",
      "Kuchli og'riqda Paratsetamol yoki Ibuprofen bering.",
      "Katta maydon kuyganda yoki yosh bolalarda darhol shifokorga murojaat qiling."
    ],
    prohibited: [
      "Kuygan joyga sariyog', o'simlik moyi, qatiq, yog'li malham yoki spirt SURTMANG! Bu issiqlikni qamab, kuyishni chuqurlashtiradi.",
      "Paydo bo'lgan suvli pufakchalarni (qavariqlarni) yormang (infeksiya tushadi)!",
      "Kuygan teriga yopishib qolgan kiyimni kuch bilan yulib olmang, faqat atrofdan qaychi bilan kesib oling."
    ]
  }
];
