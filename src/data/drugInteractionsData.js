/**
 * Drug Compatibility & Interaction Knowledge Base
 * Crucial safety recommendations for combined drug intake in Uzbekistan
 */

export const commonDrugs = [
  { id: 'aspirin', name: 'Aspirin (Atsetilsalitsil kislota)', category: 'Yurak / Qon suyultiruvchi', typicalUse: 'Yurak xurujining oldini olish, isitma' },
  { id: 'kardiomagnil', name: 'Kardiomagnil (Aspirin + Magniy)', category: 'Kardiologik', typicalUse: 'Qon suyultirish, insult va infarkt profilaktikasi' },
  { id: 'ibuprofen', name: 'Ibuprofen (Nurofen)', category: 'Og\'riq qoldiruvchi / Yallig\'lanishga qarshi', typicalUse: 'Bosh og\'rig\'i, tish og\'rig\'i, yuqori harorat' },
  { id: 'paracetamol', name: 'Paratsetamol (Panadol)', category: 'Isitma tushiruvchi', typicalUse: 'Isitma, shamollash, o\'rtacha og\'riq' },
  { id: 'citramon', name: 'Sitramon (Paratsetamol + Kofein + Aspirin)', category: 'Kombinatsiyalangan og\'riq qoldiruvchi', typicalUse: 'Bosh og\'rig\'i, past qon bosimi' },
  { id: 'spazmalgon', name: 'Spazmalgon', category: 'Spazmolitik va og\'riq qoldiruvchi', typicalUse: 'Qorin, buyrak sanchig\'i, spazmlar' },
  { id: 'amoxicillin', name: 'Amoksitsillin (Amoksiklav)', category: 'Antibiotik (Penitsillinlar)', typicalUse: 'Bakterial infeksiyalar, tomoq, o\'pka shamollashi' },
  { id: 'azithromycin', name: 'Azitromitsin (Azitro, Sumamed)', category: 'Antibiotik (Makrolidlar)', typicalUse: 'Bronxit, zotiljam, nafas yo\'llari infeksiyasi' },
  { id: 'omeprazole', name: 'Omeprazol (Omez)', category: 'Oshqozon himoyasi', typicalUse: 'Gastrit, oshqozon yarasi, kislotalilik' },
  { id: 'metformin', name: 'Metformin (Siofor)', category: 'Diabetga qarshi', typicalUse: '2-toifa qandli diabet, qandni pasaytirish' },
  { id: 'enalapril', name: 'Enalapril (Enap)', category: 'Qon bosimini tushiruvchi', typicalUse: 'Arterial gipertoniya' },
  { id: 'noshpa', name: 'No-shpa (Drotaverin)', category: 'Spazmolitik', typicalUse: 'Mushak spazmlari, o\'t yo\'li sanchig\'i' },
  { id: 'calcium', name: 'Kalsiy D3 (Osteogenon)', category: 'Mineral va vitamin', typicalUse: 'Suyak mustahkamligi, osteoporoz' },
  { id: 'probiotic', name: 'Probiotik (Laktobakteriya / Lineks)', category: 'Ichak mikroflorasi', typicalUse: 'Ich ketishi, antibiotikdan keyin mikrofloranikayta tiklash' }
];

export const interactionsMatrix = [
  // Aspirin + Ibuprofen
  {
    drug1: 'aspirin',
    drug2: 'ibuprofen',
    severity: 'danger', // 'danger' | 'warning' | 'safe'
    title: "Jiddiy xavf: Oshqozondan qon ketishi va Aspirin samarasining yo'qolishi!",
    details: "Ibuprofen va Aspirin birgalikda qabul qilinganda oshqozon shilliq qavatini qattiq shikastlaydi, yara paydo bo'lishi va qon ketishi xavfini 4 barobarga oshiradi. Shuningdek, Ibuprofen Aspirinning yurakni himoyalash ta'sirini to'sib qo'yadi.",
    recommendation: "Ularni bir vaqtda qabul qilmang! Agar og'riq bo'lsa, Paratsetamolni tanlang yoki shifokor bilan maslahatlashib qabul oralig'ini kamida 8 soat qiling."
  },
  // Kardiomagnil + Ibuprofen
  {
    drug1: 'kardiomagnil',
    drug2: 'ibuprofen',
    severity: 'danger',
    title: "Oshqozon yarasi xavfi va tromboz profilaktikasining buzilishi",
    details: "Kardiomagnil tarkibida ham Aspirin mavjud. Ibuprofen bilan qo'shilganda qon quyulishiga qarshi kardiologik ta'sir susayadi va oshqozon kislotaliligi keskin buziladi.",
    recommendation: "Kardiomagnil ichayotgan bo'lsangiz, og'riq qoldiruvchi sifatida Ibuprofen o'rniga Paratsetamol yoki No-shpa tavsiya etiladi."
  },
  // Paratsetamol + Sitramon
  {
    drug1: 'paracetamol',
    drug2: 'citramon',
    severity: 'danger',
    title: "Jigar zaharlanishi (Paratsetamolning doza oshib ketishi)!",
    details: "Sitramon tarkibida allaqachon paratsetamol mavjud. Ularni birga ichish organizmda paratsetamolning sutkalik xavfsiz me'yori (4 gramm) dan oshib ketishiga va o'tkir jigar yetishmovchiligiga sabab bo'lishi mumkin.",
    recommendation: "Sitramon va Paratsetamolni hech qachon birga yoki ketma-ket ichmang! Biri tanlangani ma'qul."
  },
  // Antibiotik + Probiotik
  {
    drug1: 'amoxicillin',
    drug2: 'probiotic',
    severity: 'warning',
    title: "Vaqt bo'yicha ehtiyotkorlik: Probiotik samarasiz bo'lib qoladi",
    details: "Amoksitsillin kuchli antibiotik bo'lgani uchun probiotik tarkibidagi tirik foydali bakteriyalarni darhol o'ldiradi. Agar ularni bir vaqtda ichsangiz, probiotik hech qanday foyda bermaydi.",
    recommendation: "Probiotikni antibiotik ichilgandan kamida 2-3 soat keyin yoki antibiotik kursi tugagandan so'ng ichish shart!"
  },
  {
    drug1: 'azithromycin',
    drug2: 'probiotic',
    severity: 'warning',
    title: "Antibiotik va probiotikni alohida vaqtlarda qabul qiling",
    details: "Azitromitsin ta'siri ostida probiotik bakteriyalari parchalanadi.",
    recommendation: "Antibiotik va probiotik o'rtasida kamida 3 soatlik tanaffus bo'lishi zarur."
  },
  // Antibiotik + Kalsiy
  {
    drug1: 'amoxicillin',
    drug2: 'calcium',
    severity: 'warning',
    title: "So'rilishning pasayishi: Antibiotik kuchi kamayadi",
    details: "Kalsiy ionlari antibiotik molekulalari bilan erimaydigan birikmalar hosil qilib, uning ichakdan qonga so'rilishini 50-70% gacha pasaytiradi.",
    recommendation: "Kalsiy preparatlarini antibiotikdan 3 soat oldin yoki 3 soat keyin qabul qiling."
  },
  // Omeprazol + Kardiomagnil / Aspirin
  {
    drug1: 'omeprazole',
    drug2: 'kardiomagnil',
    severity: 'safe',
    title: "Himoyalovchi ijobiy kombinatsiya (Xavfsiz)",
    details: "Omeprazol oshqozon shilliq qavatini kislotadan himoya qiladi va Kardiomagnilning oshqozonga salbiy ta'sirini kamaytiradi. Ko'pincha kardiologlar tomonidan birgalikda buyuriladi.",
    recommendation: "Omeprazol ertalab nahorda ovqatdan 30 daqiqa oldin, Kardiomagnil esa kechqurun ovqatdan keyin ichilishi maqsadga muvofiq."
  },
  // Enalapril + Kardiomagnil
  {
    drug1: 'enalapril',
    drug2: 'kardiomagnil',
    severity: 'warning',
    title: "Qon bosimi nazorati va buyrak faoliyati monitoringi",
    details: "Yuqori dozalarda Aspirin Enalaprilning qon bosimini tushirish samaradorligini biroz kamaytirishi mumkin. Kichik kardiologik dozalarda (75-100 mg) esa xavfsiz hisoblanadi.",
    recommendation: "Kardiolog ko'rsatmasi bo'yicha qon bosimini muntazam o'lchab boring."
  },
  // No-shpa + Spazmalgon
  {
    drug1: 'noshpa',
    drug2: 'spazmalgon',
    severity: 'warning',
    title: "Bir xil ta'sirli dorilar: Qon bosimi tushib ketishi xavfi",
    details: "Ikkalasi ham silliq mushaklarni bo'shashtiradi. Birga qabul qilish qon bosimining haddan tashqari pasayishi, bosh aylanishi va lanjlikka olib kelishi mumkin.",
    recommendation: "Ularni birga ichish tavsiya etilmaydi. Shifokor bilan bitta optimal spazmolitikni tanlang."
  },
  // Metformin + Alkogol (Umumiy ogohlantirish)
  {
    drug1: 'metformin',
    drug2: 'aspirin',
    severity: 'safe',
    title: "Mos keladi, lekin qand miqdorini nazorat qiling",
    details: "Odatda diabet va yurak xastaligi bo'lgan bemorlarga birgalikda tayinlanadi. Salbiy to'qnashuv aniqlanmagan.",
    recommendation: "Qand va qon bosimi ko'rsatkichlarini me'yorda saqlang."
  }
];

export const foodInteractions = [
  {
    id: 'grapefruit',
    title: "Greypfrut va Greypfrut sharbati (Juda xavfli!)",
    badge: "Xavfli to'qnashuv",
    color: "rose",
    rules: "Greypfrut jigaridagi CYP3A4 fermentini bloklaydi. Natijada bosim tushiruvchi, xolesterin dorilari (statinlar) va yurak dorilari qonda 3-5 barobar to'planib, zaharli krizga sabab bo'lishi mumkin.",
    prohibitedWith: "Statinlar (Atorvastatin), Amlodipin, Antiaritmik dorilar."
  },
  {
    id: 'milk',
    title: "Sut va Sut mahsulotlari (Qatiq, Tvorog, Pishloq)",
    badge: "So'rilishni to'sadi",
    color: "amber",
    rules: "Sut tarkibidagi kalsiy temir moddasi (anemiya dorilari) va ko'plab antibiotiklar (tetratsiklin, siprofloksatsin) bilan birikib, so'rilmasdan chiqib ketadi.",
    prohibitedWith: "Antibiotiklar, Temir preparatlari (Sorbifer, Maltofer)."
  },
  {
    id: 'coffee_tea',
    title: "Kofe va To'q Qora Choy",
    badge: "Yurak va Oshqozon",
    color: "amber",
    rules: "Tarkibidagi tanin va kofein dorilar ta'sirini o'zgartiradi. Sedativ (tinchlantiruvchi) dorilar samarasini nolga tushiradi, yurak urishini haddan tashqari oshiradi va temir so'rilishini 80% ga pasaytiradi.",
    prohibitedWith: "Tinchlantiruvchi dorilar, Temir moddasi, Bosim dorilari."
  },
  {
    id: 'timing_rules',
    title: "Ovqatdan oldin yoki keyin ichish oltin qoidalari",
    badge: "Muhim ko'rsatma",
    color: "teal",
    rules: "Oshqozonni bezovta qiluvchi barcha og'riq qoldiruvchilar (Aspirin, Ibuprofen, Diklofenak) FAQAT ovqatdan so'ng ichiladi. Oshqozon himoyalovchilar (Omeprazol) esa ovqatdan 30 daqiqa OLDIN ichiladi. Antibiotiklar ko'rsatma bo'yicha aniq soatlarda qabul qilinadi.",
    prohibitedWith: "Och qoringa og'riq qoldiruvchi dorilarni ichish qat'iyan man etiladi!"
  }
];
