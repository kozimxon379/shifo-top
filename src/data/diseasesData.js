export const diseasesDirectory = [
  {
    id: "dis-1",
    name: "Bosh og'rig'i va Migren",
    nameRu: "Головная боль и Мигрень",
    nameEn: "Headache and Migraine",
    category: "Nevrologiya",
    keywords: ["bosh", "migren", "ogriq", "peshona", "bosh aylanishi", "голова", "мигрень", "headache", "migraine", "pain"],
    urgency: "O'rtacha (Kuchli bo'lsa zudlik bilan)",
    causes: [
      "Surunkali asabiy zo'riqish, stress va uyqusizlik",
      "Miya qon-tomirlarining spazmi yoki kengayishi",
      "Bo'yin umurtqalari osteoxondrozi tufayli qon aylanishi buzilishi",
      "Uzoq vaqt kompyuter/telefon ekraniga qarab turish (ko'z toliqishi)",
      "Qon bosimining keskin ko'tarilishi yoki tushishi (arterial gipertoniya/gipotoniya)"
    ],
    symptoms: [
      "Boshning bir yoki ikki tomonida pulsatsiyalovchi kuchli og'riq",
      "Yorug'lik va baland tovushlarga sezuvchanlik (fotofobiya, fonofobiya)",
      "Ko'ngil aynishi, holsizlik, bosh aylanishi",
      "Ko'z oldida miltillovchi nuqtalar (aura)"
    ],
    treatments: [
      "Tinch, qorong'i va salqin xonada yotib dam olish",
      "Bo'yin va yelka sohasiga engil tinchlantiruvchi massaj qilish",
      "Shifokor tavsiyasi bilan nosteroid yallig'lanishga qarshi vositalar (Ibuprofen, Paratsetamol) yoki triptanlar qabul qilish",
      "Kuniga kamida 1.5 - 2 litr toza suv ichish (degidratsiyaning oldini olish)",
      "Agar og'riq to'satdan kuchaysa yoki hushdan ketish kuzatilsa, zudlik bilan 103 ga murojaat qilish"
    ],
    doctorSpecialty: "Nevropatolog",
    recommendedDoctorId: "doc-2",
    recommendedClinicIds: ["clinic-1", "clinic-3", "clinic-2"]
  },
  {
    id: "dis-2",
    name: "O'tkir Gastrit va Oshqozon Og'rig'i",
    nameRu: "Острый Гастрит и Боль в желудке",
    nameEn: "Acute Gastritis and Stomach Pain",
    category: "Gastroenterologiya",
    keywords: ["gastrit", "oshqozon", "jigildak qaynashi", "qorin", "hazm", "гастрит", "желудок", "gastritis", "stomach", "abdomen"],
    urgency: "O'rtacha",
    causes: [
      "Helicobacter pylori bakteriyasi bilan zararlanish",
      "Noto'g'ri, tartibsiz ovqatlanish, achchiq, qovurilgan va yog'li taomlarni ko'p iste'mol qilish",
      "Spirtli ichimliklar, kashandalik va kofeinni ortiqcha iste'mol qilish",
      "Dori vositalarini (ayniqsa aspirin, diklofenak) och qoringa qabul qilish",
      "Doimiy stress va asabiylashish"
    ],
    symptoms: [
      "Qorinning yuqori qismida (epigastriya) achishish, sanchiq yoki og'irlik hissi",
      "Jigildak qaynashi (zjxoga), nordon kekirish",
      "Ko'ngil aynishi, ishtahasizlik, og'izda noxush ta'm",
      "Ovqatdan keyin qorin shishi va noqulaylik"
    ],
    treatments: [
      "Qattiq parhezga o'tish (sho'rva, bo'tqalar, qovurilmagan qaynatma taomlar)",
      "Proton pompasi ingibitorlari (Omeprazol, Pantoprazol) orqali kislotalilikni kamaytirish",
      "Antatsid preparatlar (Almagel, Fosfalyugel) bilan oshqozon shilliq qavatini himoyalash",
      "Gazlangan ichimliklar, tamaki, qahva va sho'r ovqatlardan butunlay voz kechish",
      "Gastroenterolog ko'rigidan o'tib, gastroskopiya (FGDS) qildirish"
    ],
    doctorSpecialty: "Gastroenterolog / Terapevt",
    recommendedDoctorId: "doc-3",
    recommendedClinicIds: ["clinic-5", "clinic-1", "clinic-3"]
  },
  {
    id: "dis-3",
    name: "Gripp, Shamollash va O'RVI",
    nameRu: "Грипп, Простуда и ОРВИ",
    nameEn: "Flu, Common Cold and ARVI",
    category: "Terapiya / Infeksion",
    keywords: ["gripp", "shamollash", "harorat", "isitma", "tomoq", "yo'tal", "burun oqishi", "грипп", "простуда", "температура", "flu", "cold", "fever", "cough"],
    urgency: "Pastdan O'rtachagacha",
    causes: [
      "Havo-tomchi yo'li orqali gripp yoki respirator viruslar (A, B tiplari, rinoviruslar) yuqishi",
      "Mavsumiy immunitet zaiflashishi, gipovitaminoz",
      "Sovuq qotish, nam havo va organizmning charchashi",
      "Odamlar gavjum jamoat joylarida virus tashuvchilar bilan yaqin muloqot"
    ],
    symptoms: [
      "Tana haroratining 38°C dan yuqoriga ko'tarilishi, titroq",
      "Burun bitishi, kuchli burun oqishi va aksirish",
      "Tomoqda qichishish, achishish va quruq yo'tal",
      "Mushaklarda, bo'g'imlarda va ko'z sohasida qaqshash, bosh og'rig'i, lanjlik"
    ],
    treatments: [
      "To'liq yotoq rejimi (kamida 3-5 kun) va mo'l-ko'l iliq suyuqlik ichish (malina, limonli choy)",
      "Tana harorati 38.5°C dan oshganda Paratsetamol yoki Ibuprofen qabul qilish",
      "Burunni tuzli eritma (Akvamaris, natriy xlorid 0.9%) bilan muntazam chayish",
      "Tomoqni antiseptiklar (Furatsilin, Xlorgeksidin) bilan chayqash va so'riluvchi tabletkalar",
      "Vitamin C va rux (Zinc) qabul qilib organizmni quvvatlash"
    ],
    doctorSpecialty: "Terapevt / LOR",
    recommendedDoctorId: "doc-3",
    recommendedClinicIds: ["clinic-3", "clinic-6", "clinic-7"]
  },
  {
    id: "dis-4",
    name: "Yurak Sanchishi va Gipertonik Inqiroz",
    nameRu: "Боль в области сердца и Гипертонический криз",
    nameEn: "Chest Pain and Hypertensive Crisis",
    category: "Kardiologiya",
    keywords: ["yurak", "sanchiq", "qon bosimi", "davleniye", "bosim", "сердце", "давление", "heart", "chest pain", "hypertension"],
    urgency: "Yuqori / Zudlik bilan shoshilinch",
    causes: [
      "Yurak toj tomirlarining torayishi (ateroskleroz) tufayli miokardga kislorod yetishmasligi",
      "Kuchli ruhiy asabiylashish va jismoniy zo'riqish",
      "Qon bosimining keskin oshishi (160/100 mm simob ustunidan yuqori)",
      "Tuzli taomlar, chekish, ortiqcha vazn va jismoniy kamharakatlik"
    ],
    symptoms: [
      "Ko'krak qafasi orqasida siquvchi, ezuvchi yoki achishtiruvchi og'riq",
      "Og'riqning chap yelkaga, chap qo'lga yoki pastki jag'ga tarqalishi",
      "Havo yetishmasligi, nafas qisishi, sovuq ter bosishi",
      "Yurak urishining tezlashishi yoki notekis urishi (aritmiya), o'lim qo'rquvi"
    ],
    treatments: [
      "Bemorga darhol yarim o'tirgan holat berish, tor yoqalarni yechish va toza havo kiritish",
      "ZUDLIK BILAN 103 (Tez yordam) chaqirish!",
      "Qon bosimini o'lchash; agar buyurilgan bo'lsa Nitroglitserinni til ostiga qo'yish",
      "Aspirin (150-300 mg) chaynab ichish tavsiya etiladi (qon quyulishining oldini olish uchun)",
      "Hech qanday og'ir harakat qilmaslik, qat'iy tinchlik saqlash"
    ],
    doctorSpecialty: "Kardiolog",
    recommendedDoctorId: "doc-1",
    recommendedClinicIds: ["clinic-4", "clinic-2", "clinic-1"]
  },
  {
    id: "dis-5",
    name: "Tish Og'rig'i, Pulpit va Karies",
    nameRu: "Зубная боль, Пульпит и Кариес",
    nameEn: "Toothache, Pulpitis and Caries",
    category: "Stomatologiya",
    keywords: ["tish", "milk", "karies", "pulpit", "tish ogriq", "зуб", "кариес", "пульпит", "tooth", "dentist", "toothache"],
    urgency: "O'rtacha",
    causes: [
      "Og'iz bo'shlig'i gigiyenasiga rioya qilmaslik, bakterial blyashka to'planishi",
      "Shirinlik va uglevodlarni ko'p iste'mol qilish natijasida emalning yemirilishi",
      "Davolanmagan chuqur kariesning nerv tolalariga (pulpa) o'tishi",
      "Tishning sinishi, mikrotravmalar yoki noto'g'ri plomba qo'yilishi"
    ],
    symptoms: [
      "Issiq, sovuq yoki shirin narsalar tekkanda o'tkir og'riq",
      "Kechasi kuchayuvchi o'z-o'zidan paydo bo'ladigan lunjga uruvchi og'riq",
      "Milkning qizarishi, shishishi va qonashi",
      "Chaynaganda tish tubida qattiq noqulaylik"
    ],
    treatments: [
      "Iliq tuz va istemol sodasi aralashmasi (1 choy qoshiqdan 1 stakan suvga) bilan og'izni chayish",
      "Og'riq qoldiruvchi dorilar (Ibuprofen, Ketorol yoki Nimesil) ichish",
      "Og'riyotgan tish ustiga hech qachon issiq kompress yoki aspirin qo'ymaslik!",
      "Zudlik bilan stomatolog qabuliga borib, kanalni tozalash va davolash"
    ],
    doctorSpecialty: "Stomatolog",
    recommendedDoctorId: "doc-6",
    recommendedClinicIds: ["clinic-7", "clinic-3", "clinic-5"]
  },
  {
    id: "dis-6",
    name: "Bel Og'rig'i, Ishias va Osteoxondroz",
    nameRu: "Боль в пояснице, Радикулит и Остеохондроз",
    nameEn: "Lower Back Pain, Sciatica and Osteochondrosis",
    category: "Nevrologiya / Ortopediya",
    keywords: ["bel", "umurtqa", "grija", "oyoq tortishishi", "osteoxondroz", "поясница", "спина", "грыжа", "back", "spine", "sciatica"],
    urgency: "O'rtacha",
    causes: [
      "Umurtqa pog'onasi disklarining yemirilishi yoki churra (diskovaya grija)",
      "Og'ir yuklarni noto'g'ri ko'tarish va birdan harakat qilish",
      "Uzoq vaqt noqulay holatda o'tirish (ofis ishi, haydovchilik)",
      "Mushaklarning sovuq qotishi yoki spazmi"
    ],
    symptoms: [
      "Bel sohasida simillovchi yoki qimirlatmaydigan o'tkir 'o'q uzgandek' og'riq",
      "Og'riqning son va tovon bo'ylab pastga tarqalishi, oyoqda uvishish hissi",
      "Belingizni bukib-yozishda cheklanish, qad rostlay olmaslik"
    ],
    treatments: [
      "Qattiq to'shakda tizzalar ostiga yostiq qo'yib gorizontal yotish",
      "Yallig'lanishga qarshi nosteroid malhamlar (Voltaren, Diklofenak gel) surtish",
      "Nevropatolog ko'rigi va bel umurtqasi MRT tekshiruvidan o'tish",
      "O'tkir davr o'tgach, davolovchi gimnastika va suzish bilan shug'ullanish"
    ],
    doctorSpecialty: "Nevropatolog / Travmatolog",
    recommendedDoctorId: "doc-2",
    recommendedClinicIds: ["clinic-1", "clinic-2", "clinic-4"]
  },
  {
    id: "dis-7",
    name: "Qandli Diabet va Moddalar Almashinuvi",
    nameRu: "Сахарный диабет и Нарушения обмена веществ",
    nameEn: "Diabetes Mellitus and Metabolic Disorders",
    category: "Endokrinologiya",
    keywords: ["qand", "diabet", "shakar", "chanqash", "saxar", "диабет", "сахар", "diabetes", "blood sugar"],
    urgency: "Surunkali / Nazorat talab etiladi",
    causes: [
      "Oshqozon osti bezi orqali insulin ishlab chiqarilishi kamayishi yoki to'qimalarning insulinga sezuvchanligi pasayishi",
      "Irsiy moyillik va genetik omillar",
      "Ortiqcha vazn, semizlik va kamharakat hayot tarzi",
      "Doimiy stress va tozalangan uglevodlarni me'yordan ortiq iste'mol qilish"
    ],
    symptoms: [
      "Doimiy og'iz qurishi, kuchli chanqoq hissi (polidipsiya)",
      "Tez-tez va ko'p siyish, ayniqsa tunda (poliuriya)",
      "Tez charchash, surunkali holsizlik, sababsiz vazn yo'qotish yoki ortishi",
      "Teri qichishishi va mayda yaralarning uzoq vaqt bitmasligi"
    ],
    treatments: [
      "Qondagi glyukoza miqdorini muntazam glyukometrda o'lchab borish",
      "Past glikemik indeksli maxsus 9-stol parheziga qat'iy amal qilish",
      "Endokrinolog tomonidan tavsiya etilgan qand tushiruvchi preparatlar yoki insulin terapiyasi",
      "Har kuni kamida 30-40 daqiqa piyoda yurish va mo''tadil jismoniy faollik"
    ],
    doctorSpecialty: "Endokrinolog",
    recommendedDoctorId: "doc-7",
    recommendedClinicIds: ["clinic-5", "clinic-1", "clinic-3"]
  }
];
