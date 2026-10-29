/**
 * Comprehensive Medical Lab Tests Database
 * Scientifically backed reference ranges for general health screening in Uzbekistan
 */

export const labCategories = [
  { id: 'blood', name: "Umumiy qon tahlili (CBC)", icon: 'Droplet' },
  { id: 'glucose', name: "Qand va Metabolizm", icon: 'Zap' },
  { id: 'cardio', name: "Xolesterin va Yurak", icon: 'HeartPulse' },
  { id: 'liver_kidney', name: "Jigar va Buyrak", icon: 'Activity' },
  { id: 'vitamins', name: "Vitamin va Minerallar", icon: 'Sparkles' }
];

export const labTests = [
  // 1. Umumiy qon tahlili
  {
    id: 'hemoglobin',
    categoryId: 'blood',
    name: "Gemoglobin (Hb)",
    fullName: "Qondagi gemoglobin miqdori",
    unit: "g/l",
    minRange: 70,
    maxRange: 190,
    step: 1,
    defaultVal: 135,
    genderDiff: true,
    maleNormal: { min: 130, max: 165 },
    femaleNormal: { min: 120, max: 150 },
    childNormal: { min: 110, max: 145 },
    description: "Kislorodni o'pkadan to'qimalarga va barcha a'zolarga yetkazib beruvchi oqsil.",
    lowAlert: {
      title: "Gemoglobin normadan past (Anemiya / Kamqonlik xavfi)",
      symptoms: "Doimiy holsizlik, tez charchash, bosh aylanishi, rangparlik, soch to'kilishi, uyquchanlik.",
      causes: "Temir tanqisligi, B12 vitamini yetishmasligi, qon yo'qotish yoki noto'g'ri ovqatlanish.",
      dietAdvice: "Mol go'shti, jigar, anor sharbati, grechka, quritilgan mayiz, olma va yong'oq iste'mol qiling. Choy va kofeni ovqat bilan birga ichmang.",
      recommendedDoctor: "Gematolog yoki Terapevt"
    },
    highAlert: {
      title: "Gemoglobin normadan yuqori (Qon quyuqlashishi)",
      symptoms: "Bosh og'rig'i, qon bosimi oshishi, yuz qizarishi, tromboz (qon laxtasi) xavfi.",
      causes: "Kam suv ichish (degidratsiya), chekish, baland tog'li joyda yashash yoki yurak-o'pka zo'riqishi.",
      dietAdvice: "Kuniga kamida 2-2.5 litr toza suv iching. Chekishni tashlang, qon suyultiruvchi choylarni shifokor maslahati bilan iching.",
      recommendedDoctor: "Kardiolog yoki Gematolog"
    }
  },
  {
    id: 'leukocytes',
    categoryId: 'blood',
    name: "Leykotsitlar (WBC)",
    fullName: "Oq qon tanachalari (Immunitet)",
    unit: "x10^9/l",
    minRange: 1.0,
    maxRange: 20.0,
    step: 0.1,
    defaultVal: 6.8,
    maleNormal: { min: 4.0, max: 9.0 },
    femaleNormal: { min: 4.0, max: 9.0 },
    description: "Organizmning immunitet himoyachilari bo'lib, infeksiya va viruslarga qarshi kurashadi.",
    lowAlert: {
      title: "Leykotsitlar past (Immunitet susayishi / Leykopeniya)",
      symptoms: "Tez-tez shamollash, uzoq davom etuvchi holsizlik, infeksiyalarga tez beriluvchanlik.",
      causes: "Virusli infeksiyalar (gripp, COVID-19 asorati), autoimmun holatlar, ba'zi kuchli dorilar ta'siri.",
      dietAdvice: "Oqsilga boy taomlar, yangi meva-sabzavotlar, na'matak qaynatmasi, immunitetni ko'taruvchi tabiiy mahsulotlar.",
      recommendedDoctor: "Immunolog yoki Terapevt"
    },
    highAlert: {
      title: "Leykotsitlar yuqori (Yallig'lanish yoki infeksiya)",
      symptoms: "Tana harorati ko'tarilishi, qaltirash, tomoq yoki tish og'rig'i, yiringli yallig'lanish.",
      causes: "Bakterial infeksiya, o'tkir bronxit, gaymorit, appenditsit yoki jarohat.",
      dietAdvice: "Ko'p iliq suyuqlik iching, o'zboshimchalik bilan antibiotik ichmang, shoshilinch shifokor ko'rigidan o'ting.",
      recommendedDoctor: "Terapevt yoki LOR"
    }
  },
  {
    id: 'esr',
    categoryId: 'blood',
    name: "SOE (ESR)",
    fullName: "Eritrotsitlarning cho'kish tezligi",
    unit: "mm/soat",
    minRange: 1,
    maxRange: 60,
    step: 1,
    defaultVal: 8,
    genderDiff: true,
    maleNormal: { min: 1, max: 12 },
    femaleNormal: { min: 2, max: 18 },
    description: "Organizmda yashirin yoki ochiq yallig'lanish jarayoni mavjudligini ko'rsatuvchi indikator.",
    lowAlert: {
      title: "SOE juda past (Qon yopishqoqligi oshishi)",
      symptoms: "Odatda jiddiy alomatsiz kechadi, qon aylanish sekinlashishi mumkin.",
      causes: "Suyuqlik tanqisligi, eritrotsitoz.",
      dietAdvice: "Toza ichimlik suvi ichish rejimiga amal qiling.",
      recommendedDoctor: "Terapevt"
    },
    highAlert: {
      title: "SOE yuqori (Faol yallig'lanish reaksiyasi)",
      symptoms: "Bo'g'im og'riqlari, tana harorati, mushaklar qaqshashi, holsizlik.",
      causes: "Revmatizm, o'tkir yoki surunkali infeksiyalar, o'pka yallig'lanishi, tish kasalliklari.",
      dietAdvice: "Yallig'lanish o'chog'ini aniqlash uchun chuqurlashtirilgan tekshiruv zarur.",
      recommendedDoctor: "Revmatolog yoki Terapevt"
    }
  },

  // 2. Qand va Metabolizm
  {
    id: 'glucose_fasting',
    categoryId: 'glucose',
    name: "Qondagi qand (Glyukoza)",
    fullName: "Och qoringa qondagi glyukoza",
    unit: "mmol/l",
    minRange: 2.0,
    maxRange: 16.0,
    step: 0.1,
    defaultVal: 4.8,
    maleNormal: { min: 3.9, max: 5.8 },
    femaleNormal: { min: 3.9, max: 5.8 },
    description: "Organizmning asosiy energiya manbai. Qandli diabetni erta aniqlashning birlamchi ko'rsatkichi.",
    lowAlert: {
      title: "Gipoglikemiya (Qand miqdori xavfli past)",
      symptoms: "Qo'l qaltirashi, sovuq ter bosishi, kuchli ochlik, yurak tez urishi, hushdan ketish xavfi.",
      causes: "Uzoq och yurish, insulin yoki diabet dorilarining ortiqcha dozasi, haddan tashqari og'ir jismoniy zo'riqish.",
      dietAdvice: "Zudlik bilan 1 choy qoshiq asal yoki 1 dona konfet yeyish, shirin choy ichish tavsiya etiladi.",
      recommendedDoctor: "Endokrinolog"
    },
    highAlert: {
      title: "Giperglikemiya (Qand miqdori yuqori — Diabet xavfi)",
      symptoms: "Doimiy chanqoqlik, og'iz qurishi, tez-tez siyish, yaralarning sekin bitishi, ko'rish xiralashishi.",
      causes: "Prediabet, 1 yoki 2-toifa qandli diabet, oshqozonosti bezi zo'riqishi, ortiqcha vazn.",
      dietAdvice: "Oq non, shakar, gazli shirin ichimliklar, shirinliklarni butunlay to'xtatish. Ko'proq ko'katlar, dukkaklilar va yengil piyoda yurish.",
      recommendedDoctor: "Endokrinolog"
    }
  },

  // 3. Xolesterin va Yurak
  {
    id: 'cholesterol_total',
    categoryId: 'cardio',
    name: "Umumiy xolesterin",
    fullName: "Qondagi umumiy xolesterin miqdori",
    unit: "mmol/l",
    minRange: 2.0,
    maxRange: 10.0,
    step: 0.1,
    defaultVal: 4.4,
    maleNormal: { min: 3.2, max: 5.2 },
    femaleNormal: { min: 3.2, max: 5.2 },
    description: "Hujayra pardalari va gormonlar uchun zarur yog'simon modda. Ko'payib ketsa, qon tomirlarda tiqilish hosil qiladi.",
    lowAlert: {
      title: "Xolesterin normadan past",
      symptoms: "Kayfiyat tushishi, gormonal nomutanosiblik, immunitet pasayishi.",
      causes: "Haddan ortiq qattiq parhez, jigar yetishmovchiligi, to'yib ovqatlanmaslik.",
      dietAdvice: "Foydali yog'lar: zaytun moyi, baliq, tuxum va yong'oqni ratsionga qo'shing.",
      recommendedDoctor: "Terapevt yoki Parhezshunos"
    },
    highAlert: {
      title: "Xolesterin yuqori (Ateroskleroz va Infarkt xavfi)",
      symptoms: "Uzoq vaqt belgisiz kechadi! Qon tomir devorlarida xolesterin blyashkalari o'tirib, qon aylanishini qiyinlashtiradi.",
      causes: "Muntazam qovurilgan, yog'li go'shtlar, fastfud iste'moli, kamharakat hayot tarzi, chekish.",
      dietAdvice: "Dengiz balig'i, suli yormasi (ovsyanka), yong'oqlar, zaytun moyi iste'mol qiling. Qovurilgan, dudlangan taomlar va margarinni cheklang.",
      recommendedDoctor: "Kardiolog"
    }
  },

  // 4. Jigar va Buyrak
  {
    id: 'alt_ast',
    categoryId: 'liver_kidney',
    name: "ALT / AST (Jigar fermentlari)",
    fullName: "Alaninaminotransferaza va Aspartataminotransferaza",
    unit: "U/l",
    minRange: 5,
    maxRange: 150,
    step: 1,
    defaultVal: 24,
    maleNormal: { min: 10, max: 41 },
    femaleNormal: { min: 10, max: 32 },
    description: "Jigar hujayralarining butunligi va zo'riqish darajasini aniqlovchi fermentlar.",
    lowAlert: {
      title: "Ko'rsatkich normal me'yorda",
      symptoms: "Jigar hujayralari sog'lom holatda ishlamoqda.",
      causes: "Xavf mavjud emas.",
      dietAdvice: "Sog'lom ovqatlanishni davom ettiring.",
      recommendedDoctor: "Terapevt"
    },
    highAlert: {
      title: "ALT/AST yuqori (Jigar hujayralari shikastlanishi)",
      symptoms: "O'ng qovurg'a ostida og'irlik, ko'ngil aynishi, og'izda achchiq ta'm, tez charchash.",
      causes: "Gepatit, yog'li gepatoz (jigar yog' bosishi), dori vositalaridan zaharlanish, alkogol.",
      dietAdvice: "Qovurilgan, achchiq, nordon taomlardan voz kechish. Bo'g'da pishirilgan taomlar, tvorog, qovoq va ko'k choy foydali.",
      recommendedDoctor: "Gastroenterolog yoki Gepatolog"
    }
  },
  {
    id: 'creatinine',
    categoryId: 'liver_kidney',
    name: "Kreatinin",
    fullName: "Buyrak filtrlash qobiliyati",
    unit: "mkmol/l",
    minRange: 30,
    maxRange: 220,
    step: 1,
    defaultVal: 78,
    genderDiff: true,
    maleNormal: { min: 62, max: 115 },
    femaleNormal: { min: 53, max: 97 },
    description: "Buyraklarning organizmni shlaklar va toksinlardan tozalash qobiliyatining asosiy o'lchovi.",
    lowAlert: {
      title: "Kreatinin past",
      symptoms: "Mushaklar kuchi zaiflashishi.",
      causes: "Kam mushak massasi, uzoq muddatli go'shtsiz parhez.",
      dietAdvice: "Ratsionda oqsil miqdorini oshiring.",
      recommendedDoctor: "Terapevt"
    },
    highAlert: {
      title: "Kreatinin yuqori (Buyrak zo'riqishi / Yetishmovchiligi)",
      symptoms: "Ko'z atrofi va oyoqlarda shishlar, peshob rangining o'zgarishi, bel sohasida simillagan og'riq.",
      causes: "Surunkali glomerulonefrit, piyelonefrit, gipertoniya yoki buyrak toshlari.",
      dietAdvice: "Tuz iste'molini keskin kamaytiring (kuniga 3 grammdan oshmasin). Qaynatilgan go'sht va ko'p miqdorda toza suv iching.",
      recommendedDoctor: "Nefrolog yoki Urolog"
    }
  },

  // 5. Vitaminlar va Minerallar
  {
    id: 'vitamin_d',
    categoryId: 'vitamins',
    name: "Vitamin D (25-OH)",
    fullName: "Quyosh vitamini va Suyak mustahkamligi",
    unit: "ng/ml",
    minRange: 5,
    maxRange: 100,
    step: 1,
    defaultVal: 32,
    maleNormal: { min: 30, max: 80 },
    femaleNormal: { min: 30, max: 80 },
    description: "Immunitet, suyaklar mustahkamligi, tetiklik va asab tizimi uchun eng muhim vitamin.",
    lowAlert: {
      title: "Vitamin D tanqisligi (Aholining 75% da uchraydi)",
      symptoms: "Doimiy holsizlik, kayfiyat tushishi, depressiv holat, suyak va bel og'rig'i, sochlarning to'kilishi.",
      causes: "Quyosh nurida kam bo'lish, ofisda o'tirib ishlash, oziq-ovqatda kamligi.",
      dietAdvice: "Yog'li baliq (losos, skumbriya), tuxum sarig'i, sariyog' iste'mol qiling. Shifokor bilan Vitamin D3 dozasini belgilang.",
      recommendedDoctor: "Endokrinolog yoki Terapevt"
    },
    highAlert: {
      title: "Vitamin D haddan ortiq yuqori (Gipervitaminoz)",
      symptoms: "Ko'ngil aynishi, chanqoqlik, qusish, qonda kalsiy ko'payishi.",
      causes: "Dori vositalari yoki tomchilarni nazoratsiz haddan ziyod ko'p ichish.",
      dietAdvice: "Vitamin D qabulini darhol to'xtating va qondagi kalsiyni tekshiring.",
      recommendedDoctor: "Endokrinolog"
    }
  }
];

// Presets for users to test with 1-click
export const testPresets = [
  {
    id: 'preset_anemia',
    name: "Kamqonlik (Anemiya)",
    desc: "Gemoglobin va eritrotsitlar pasayishi",
    values: { hemoglobin: 92, leukocytes: 5.4, esr: 16, glucose_fasting: 4.6, cholesterol_total: 4.2, alt_ast: 22, creatinine: 72, vitamin_d: 18 }
  },
  {
    id: 'preset_diabetes_risk',
    name: "Qand ko'tarilishi (Prediabet)",
    desc: "Glyukoza va xolesterin xavfli me'yorda",
    values: { hemoglobin: 138, leukocytes: 7.1, esr: 10, glucose_fasting: 7.4, cholesterol_total: 6.5, alt_ast: 35, creatinine: 85, vitamin_d: 22 }
  },
  {
    id: 'preset_healthy',
    name: "Sog'lom ko'rsatkichlar",
    desc: "Barcha asosiy parametrlar ideal me'yorda",
    values: { hemoglobin: 140, leukocytes: 6.5, esr: 7, glucose_fasting: 4.8, cholesterol_total: 4.5, alt_ast: 24, creatinine: 78, vitamin_d: 42 }
  },
  {
    id: 'preset_liver_strain',
    name: "Jigar va Yog' bosishi",
    desc: "ALT/AST va xolesterin miqdori oshgan",
    values: { hemoglobin: 146, leukocytes: 8.2, esr: 14, glucose_fasting: 5.9, cholesterol_total: 6.8, alt_ast: 58, creatinine: 80, vitamin_d: 24 }
  }
];
