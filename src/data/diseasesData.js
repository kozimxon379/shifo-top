export const diseasesDirectory = [
  {
    id: "dis-1",
    name: "Bosh og'rig'i va Migren",
    nameRu: "Головная боль и Мигрень",
    nameEn: "Headache and Migraine",
    category: "Nevrologiya",
    keywords: [
      "bosh", "migren", "ogriq", "boshim", "bosh ogriq", "bosh og'rig'i", "peshona", "chakka", "bosh aylanishi", 
      "boshim aylanayapti", "bosh ogriyapti", "boshim ogriyapti", "бош", "мигрень", "голова", "головная боль",
      "головные боли", "висок", "headache", "migraine", "head pain", "dizziness"
    ],
    urgency: "O'rtacha (Kuchli va to'satdan bo'lsa shoshilinch)",
    causes: [
      "Surunkali asabiy zo'riqish, stress va uyqusizlik",
      "Miya qon-tomirlarining spazmi yoki kengayishi",
      "Bo'yin umurtqalari osteoxondrozi tufayli qon aylanishi buzilishi",
      "Uzoq vaqt kompyuter/telefon ekraniga qarab turish (ko'z toliqishi)",
      "Qon bosimining keskin ko'tarilishi yoki tushishi (arterial gipertoniya/gipotoniya)"
    ],
    causesRu: [
      "Хронический стресс, эмоциональное перенапряжение и бессонница",
      "Спазм или расширение сосудов головного мозга",
      "Нарушение кровотока из-за шейного остеохондроза",
      "Зрительное переутомление от экранов компьютеров и смартфонов",
      "Колебания артериального давления (гипертония или гипотония)"
    ],
    causesEn: [
      "Chronic stress, emotional fatigue, and sleep deprivation",
      "Cerebral vascular spasm or abnormal dilation",
      "Impaired blood circulation caused by cervical osteochondrosis",
      "Digital eye strain from prolonged screen use",
      "Fluctuations in arterial blood pressure"
    ],
    symptoms: [
      "Boshning bir yoki ikki tomonida pulsatsiyalovchi kuchli og'riq",
      "Yorug'lik va baland tovushlarga sezuvchanlik (fotofobiya, fonofobiya)",
      "Ko'ngil aynishi, holsizlik, bosh aylanishi",
      "Ko'z oldida miltillovchi nuqtalar (aura)"
    ],
    symptomsRu: [
      "Пульсирующая интенсивная боль в одной или обеих половинах головы",
      "Повышенная чувствительность к свету и звукам",
      "Тошнота, головокружение и общая слабость",
      "Зрительные нарушения (мелькание мушек перед глазами, аура)"
    ],
    symptomsEn: [
      "Throbbing pain on one or both sides of the head",
      "Sensitivity to light and sound (photophobia, phonophobia)",
      "Nausea, fatigue, and lightheadedness",
      "Visual aura and flashing lights"
    ],
    treatments: [
      "Tinch, qorong'i va salqin xonada yotib dam olish",
      "Bo'yin va yelka sohasiga engil tinchlantiruvchi massaj qilish",
      "Shifokor tavsiyasi bilan nosteroid vositalar (Ibuprofen, Paratsetamol) yoki triptanlar qabul qilish",
      "Kuniga kamida 1.5 - 2 litr toza suv ichish (degidratsiyaning oldini olish)",
      "Nevropatolog ko'rigiga yozilib, miya qon-tomirlarini UZDG tekshiruvidan o'tkazish"
    ],
    treatmentsRu: [
      "Отдых в тихой, темной и хорошо проветренной комнате",
      "Легкий расслабляющий массаж воротниковой зоны",
      "Прием обезболивающих препаратов (по рекомендации врача)",
      "Поддержание водного баланса (1.5-2 л чистой воды в день)",
      "Консультация невролога и УЗДГ сосудов головы и шеи"
    ],
    treatmentsEn: [
      "Rest in a quiet, dark, and well-ventilated room",
      "Gentle neck and shoulder massage",
      "Medication as advised by a physician (NSAIDs or triptans)",
      "Adequate hydration (1.5 - 2 liters of water daily)",
      "Consultation with a neurologist and vascular Doppler ultrasound"
    ],
    doctorSpecialty: "Nevropatolog",
    doctorSpecialtyRu: "Врач-невропатолог",
    doctorSpecialtyEn: "Neurologist",
    recommendedDoctorId: "doc-2",
    recommendedClinicIds: ["clinic-1", "clinic-3", "clinic-2"]
  },
  {
    id: "dis-2",
    name: "O'tkir va Surunkali Gastrit",
    nameRu: "Острый и Хронический Гастрит",
    nameEn: "Acute and Chronic Gastritis",
    category: "Gastroenterologiya",
    keywords: [
      "gastrit", "oshqozon", "jigildak qaynashi", "qorin", "qornim", "hazm", "oshqozonim", "qorin ogriq",
      "oshqozon ogriq", "ovqatdan keyin ogriq", "kekirish", "zjxoga", "гастрит", "желудок", "изжога",
      "боль в желудке", "живот", "пищеварение", "gastritis", "stomach", "heartburn", "acid reflux", "indigestion"
    ],
    urgency: "O'rtacha",
    causes: [
      "Helicobacter pylori bakteriyasi bilan oshqozon shilliq qavati zararlanishi",
      "Noto'g'ri, tartibsiz ovqatlanish, achchiq, qovurilgan va o'ta issiq/sovuq taomlar",
      "Spirtli ichimliklar, tamaki chekish va kofeinni me'yordan ortiq iste'mol qilish",
      "Dori vositalarini (aspirin, ibuprofen, diklofenak) och qoringa qabul qilish",
      "Doimiy asabiy zo'riqish va stress (stress-gastrit)"
    ],
    causesRu: [
      "Инфицирование бактерией Helicobacter pylori",
      "Нерегулярное питание, употребление острой, жирной и жареной пищи",
      "Злоупотребление кофе, алкоголем и курение",
      "Прием НПВП (аспирин, ибупрофен) натощак",
      "Хронический стресс и психоэмоциональное напряжение"
    ],
    causesEn: [
      "Infection by Helicobacter pylori bacteria",
      "Irregular diet, excessively spicy, fried, or fatty foods",
      "Excessive alcohol, caffeine consumption, and smoking",
      "Use of NSAIDs (aspirin, ibuprofen) on an empty stomach",
      "Severe physiological or emotional stress"
    ],
    symptoms: [
      "Qorinning yuqori qismida (epigastriya) achishish, sanchiq yoki simillovchi og'riq",
      "Jigildak qaynashi, nordon kekirish va og'izda noxush metall ta'mi",
      "Ko'ngil aynishi, ishtahasizlik va ovqatdan keyin oshqozonda og'irlik hissi",
      "Qorin dam bo'lishi va meteorizm"
    ],
    symptomsRu: [
      "Жгучая или ноющая боль в верхней части живота (эпигастрии)",
      "Изжога, кислая отрыжка и неприятный привкус во рту",
      "Тошнота, потеря аппетита, ощущение тяжести после еды",
      "Вздутие живота и метеоризм"
    ],
    symptomsEn: [
      "Burning or aching pain in the upper abdomen (epigastrium)",
      "Heartburn, acid regurgitation, and unpleasant taste",
      "Nausea, loss of appetite, and fullness after eating",
      "Abdominal bloating and indigestion"
    ],
    treatments: [
      "Qat'iy parhezga o'tish (1-stol: qaynatma sho'rva, bo'tqalar, dimlangan sabzavotlar)",
      "Kislotalilikni kamaytiruvchi vositalar (Omeprazol, Pantoprazol)",
      "Oshqozon shilliq qavatini himoyalovchi antatsidlar (Almagel, Fosfalyugel)",
      "Gazlangan ichimliklar, kofe, spirtli ichimlik va achchiq taomlardan voz kechish",
      "Gastroenterolog qabuliga yozilib, gastroskopiya (FGDS) va H.pylori testini topshirish"
    ],
    treatmentsRu: [
      "Щадящая диета (стол №1: каши на воде, супы-пюре, вареное мясо)",
      "Прием ингибиторов протонной помпы (омепразол, пантопразол)",
      "Антацидные препараты для защиты слизистой (Альмагель, Фосфалюгель)",
      "Исключение газировки, кофе, алкоголя и фастфуда",
      "Консультация гастроэнтеролога и фиброгастроскопия (ФГДС)"
    ],
    treatmentsEn: [
      "Bland protective diet (porridge, clear soups, steamed lean meat)",
      "Proton pump inhibitors (Omeprazole, Pantoprazole) as prescribed",
      "Antacids to soothe gastric mucosa (Almagel, sucralfate)",
      "Avoid coffee, carbonated drinks, alcohol, and spicy foods",
      "Consult a gastroenterologist for an upper endoscopy (EGD)"
    ],
    doctorSpecialty: "Gastroenterolog",
    doctorSpecialtyRu: "Врач-гастроэнтеролог",
    doctorSpecialtyEn: "Gastroenterologist",
    recommendedDoctorId: "doc-8",
    recommendedClinicIds: ["clinic-5", "clinic-1", "clinic-3"]
  },
  {
    id: "dis-3",
    name: "Gripp, Shamollash va O'RVI",
    nameRu: "Грипп, Простуда и ОРВИ",
    nameEn: "Flu, Common Cold and ARVI",
    category: "Terapiya / Infeksion",
    keywords: [
      "gripp", "shamollash", "harorat", "isitma", "tomoq", "yo'tal", "burun oqishi", "shamollabman",
      "isitmayapman", "aksirish", "haroratim", "tomoq ogriq", "tomog'im", "grippman", "грипп", "простуда",
      "температура", "насморк", "кашель", "горло", "озноб", "орви", "flu", "cold", "fever", "cough", "runny nose"
    ],
    urgency: "Pastdan O'rtachagacha (Harorat 39°C dan oshsa zudlik bilan)",
    causes: [
      "Havo-tomchi yo'li orqali respirator viruslar (Gripp A/B, rinovirus, adenovirus) yuqishi",
      "Mavsumiy immunitet zaiflashishi va gipovitaminoz",
      "Sovuq qotish, nam havo va organizmning umumiy charchashi",
      "Odamlar gavjum jamoat joylarida infeksiya tashuvchilar bilan muloqot"
    ],
    causesRu: [
      "Заражение респираторными вирусами (грипп A/B, риновирус, аденовирус)",
      "Сезонное снижение иммунитета и дефицит витаминов",
      "Переохлаждение организма и резкие перепады температур",
      "Контакт с заболевшими в общественных местах"
    ],
    causesEn: [
      "Airborne transmission of respiratory viruses (Influenza, Rhinovirus, Adenovirus)",
      "Seasonal immune deficiency and vitamin depletion",
      "Hypothermia and rapid weather shifts",
      "Close contact in crowded public areas"
    ],
    symptoms: [
      "Tana haroratining ko'tarilishi (37.5°C - 39.5°C), titroq va sovuq qotish",
      "Burun bitishi, kuchli burun oqishi va ketma-ket aksirish",
      "Tomoqda achishish, qichishish va quruq yo'tal",
      "Butun tanada, bo'g'im va mushaklarda qaqshash, bosh og'rig'i, lanjlik"
    ],
    symptomsRu: [
      "Повышение температуры тела (от 37.5°C до 39.5°C), озноб",
      "Заложенность носа, обильный насморк и чихание",
      "Першение и боль в горле, сухой кашель",
      "Ломота в суставах и мышцах, головная боль, выраженная слабость"
    ],
    symptomsEn: [
      "Elevated body temperature (37.5°C - 39.5°C) and chills",
      "Nasal congestion, runny nose, and sneezing",
      "Sore scratchy throat and dry cough",
      "Body aches, muscle pain, headache, and severe fatigue"
    ],
    treatments: [
      "Qat'iy yotoq rejimi (3-5 kun) va mo'l-ko'l iliq suyuqlik (malina, limonli choy, na'matak)",
      "Harorat 38.5°C dan oshganda Paratsetamol yoki Ibuprofen qabul qilish",
      "Burun bo'shlig'ini tuzli eritma (Akvamaris, 0.9% NaCl) bilan kuniga 3-4 marta yuvish",
      "Tomoqni antiseptiklar (Furatsilin, Xlorgeksidin) bilan chayqash",
      "Vitamin C va rux (Zinc) qabul qilib immunitetni quvvatlash"
    ],
    treatmentsRu: [
      "Постельный режим и обильное теплое питье (чай с лимоном, отвар шиповника)",
      "Жаропонижающие (парацетамол, ибупрофен) при температуре выше 38.5°C",
      "Промывание носа солевыми растворами 3-4 раза в день",
      "Полоскание горла антисептиками и рассасывание пастилок",
      "Прием витамина C и цинка для поддержания защитных сил организма"
    ],
    treatmentsEn: [
      "Strict bed rest and abundant warm fluids (lemon tea, herbal infusions)",
      "Antipyretics (Paracetamol, Ibuprofen) if fever exceeds 38.5°C",
      "Saline nasal spray/rinse 3-4 times daily",
      "Antiseptic throat gargles and soothing lozenges",
      "Immune support with Vitamin C and Zinc"
    ],
    doctorSpecialty: "Terapevt",
    doctorSpecialtyRu: "Врач-терапевт",
    doctorSpecialtyEn: "General Practitioner / Internist",
    recommendedDoctorId: "doc-3",
    recommendedClinicIds: ["clinic-3", "clinic-6", "clinic-7"]
  },
  {
    id: "dis-4",
    name: "Arterial Gipertoniya va Qon Bosimi",
    nameRu: "Артериальная Гипертония и Давление",
    nameEn: "Hypertension and High Blood Pressure",
    category: "Kardiologiya",
    keywords: [
      "davleniya", "davleniye", "bosim", "qon bosimi", "gipertoniya", "yurak", "yuragim", "davleniyam",
      "yuragim sanchyapti", "yurak sanchishi", "yurak ogriq", "yurak qisishi", "bosimim oshdi", "давление",
      "гипертония", "сердце", "высокое давление", "давления", "криз", "hypertension", "blood pressure", "heart", "chest pressure"
    ],
    urgency: "Yuqori (180/110 dan yuqori bo'lsa shoshilinch)",
    causes: [
      "Qon-tomirlar tonusining oshishi va aterosklerotik torayishi",
      "Surunkali asabiy zo'riqish, stress va hissiy portlashlar",
      "Osh tuzini ko'p iste'mol qilish, noto'g'ri ovqatlanish va semizlik",
      "Irsiy moyillik va buyrak qon-tomir faoliyatining buzilishi",
      "Jismoniy kamharakat hayot tarzi, chekish va spirtli ichimliklar"
    ],
    causesRu: [
      "Спазм и атеросклеротическое сужение артериальных сосудов",
      "Хронический эмоциональный стресс и переутомление",
      "Избыток поваренной соли в рационе, лишний вес",
      "Наследственная предрасположенность и заболевания почек",
      "Малоподвижный образ жизни, курение и алкоголь"
    ],
    causesEn: [
      "Arterial vascular constriction and atherosclerosis",
      "Chronic emotional strain, high stress levels",
      "Excessive sodium intake and elevated body mass index",
      "Genetic predisposition and renal artery dysregulation",
      "Sedentary lifestyle and nicotine use"
    ],
    symptoms: [
      "Ensa (bosh orqa tomoni) va chakkada qisuvchi, og'ir og'riq",
      "Ko'z oldida qora dog'lar miltillashi, quloqda shang'illash",
      "Yurak sohasida sanchiq yoki siquvchi noqulaylik, havo yetishmasligi",
      "Yuz qizarishi, ter bosishi, xavotir va titroq hissi"
    ],
    symptomsRu: [
      "Давящая боль в затылке и височной области",
      "Шум в ушах, мелькание «мушек» перед глазами",
      "Сжимающая боль или покалывание в области сердца, одышка",
      "Покраснение лица, потливость, чувство тревоги"
    ],
    symptomsEn: [
      "Throbbing pressure at the back of the head (occiput) and temples",
      "Tinnitus (ear ringing) and visual floaters",
      "Tightness or palpitations in the chest, shortness of breath",
      "Facial flushing, sudden perspiration, and anxiety"
    ],
    treatments: [
      "Bemorga yarim o'tirgan qulay holat berish, tor kiyimlarni yechish va xonani shamollatish",
      "Tonometr orqali arterial qon bosimini o'lchash va daftarga yozib borish",
      "Kardiolog buyurgan gipotenziv dorilarni (Kaptopril, Moksonidin) til ostiga qabul qilish",
      "Osh tuzini kuniga 3 grammdan kamaytirish, kofe va energetik ichimliklardan butunlay voz kechish",
      "Kardiolog qabuliga yozilib, EKG va Ekoxokardiografiya (yurak UZI) tekshiruvlaridan o'tish"
    ],
    treatmentsRu: [
      "Полусидячее положение, расстегнуть воротник, доступ свежего воздуха",
      "Измерить артериальное давление с помощью тонометра",
      "Принять гипотензивный препарат по назначению врача (каптоприл под язык)",
      "Ограничить соль до 3 г/сутки, отказаться от кофе и энергетиков",
      "Записаться к кардиологу, сделать ЭКГ и ЭхоКГ (УЗИ сердца)"
    ],
    treatmentsEn: [
      "Sit upright in a calm area, loosen tight clothing, ensure fresh airflow",
      "Measure blood pressure using a calibrated monitor",
      "Take prescribed antihypertensive medication (e.g. sublingual captopril if directed)",
      "Reduce sodium intake below 3g daily, eliminate stimulants",
      "Schedule a consultation with a cardiologist for ECG and cardiac ultrasound"
    ],
    doctorSpecialty: "Kardiolog",
    doctorSpecialtyRu: "Врач-кардиолог",
    doctorSpecialtyEn: "Cardiologist",
    recommendedDoctorId: "doc-1",
    recommendedClinicIds: ["clinic-4", "clinic-1", "clinic-2"]
  },
  {
    id: "dis-5",
    name: "Tish Og'rig'i, Pulpit va Karies",
    nameRu: "Зубная боль, Пульпит и Кариес",
    nameEn: "Toothache, Pulpitis and Caries",
    category: "Stomatologiya",
    keywords: [
      "tish", "tishim", "milk", "milkim", "karies", "pulpit", "tish ogriq", "tish og'rig'i", "jag'", "jagim",
      "tishim ogriyapti", "milk qonashi", "зуб", "зубы", "зубная боль", "кариес", "пульпит", "десна", "стоматолог",
      "tooth", "teeth", "toothache", "caries", "pulpitis", "gums", "dentist"
    ],
    urgency: "O'rtacha",
    causes: [
      "Og'iz bo'shlig'i gigiyenasiga yetarlicha amal qilmaslik, bakterial blyashka hosil bo'lishi",
      "Shirinlik va uglevodlarni ko'p iste'mol qilish tufayli tish emalining yemirilishi",
      "Davolanmagan kariesning tish ichki nerv tolasiga (pulpa) o'tishi va yallig'lanishi",
      "Tishning sinishi, mikroyoriqlar yoki noto'g'ri qo'yilgan plomba"
    ],
    causesRu: [
      "Недостаточная гигиена полости рта и скопление зубного налета",
      "Чрезмерное потребление сахара, разрушающее эмаль",
      "Переход запущенного кариеса в воспаление зубного нерва (пульпит)",
      "Травма зуба, сколы эмали или некачественная пломба"
    ],
    causesEn: [
      "Suboptimal oral hygiene leading to bacterial plaque buildup",
      "High dietary sugar intake eroding dental enamel",
      "Untreated caries spreading to the dental pulp and nerve",
      "Tooth fracture, micro-cracks, or defective restoration"
    ],
    symptoms: [
      "Issiq, sovuq yoki shirin oziq-ovqat tekkanda o'tkir, simillovchi og'riq",
      "Kechalari kuchayuvchi, quloq yoki chakka sohasiga tarqaluvchi pulsatsiyalovchi og'riq",
      "Milkning qizarishi, shishishi va tish tozalaganda qonashi",
      "Ovqat chaynashda tish tubida noqulay bosim va qattiq og'riq"
    ],
    symptomsRu: [
      "Острая боль от горячего, холодного или сладкого",
      "Пульсирующая ночная боль, отдающая в висок или ухо",
      "Покраснение, отечность и кровоточивость десен",
      "Боль при надкусывании и жевании"
    ],
    symptomsEn: [
      "Sharp sensitivity to hot, cold, or sugary stimuli",
      "Throbbing pain radiating to ear or temple, worsening at night",
      "Gingival swelling, redness, and bleeding during brushing",
      "Severe discomfort when chewing or putting pressure on the tooth"
    ],
    treatments: [
      "Iliq tuz va istemol sodasi aralashmasi (1 choy qoshiqdan 1 stakan suvga) bilan og'izni chayqash",
      "Og'riq qoldiruvchi dori (Ibuprofen, Ketorol) qabul qilish",
      "Og'riyotgan tish ustiga hech qachon issiq kompress yoki aspirin qo'ymaslik!",
      "Iplar va tish cho'tkasi yordamida qolgan oziq-ovqat qoldiqlarini ehtiyotkorlik bilan tozalash",
      "Zudlik bilan stomatolog qabuliga borib, kanalni davolash va plomba qo'ydirish"
    ],
    treatmentsRu: [
      "Полоскание теплым раствором соды и соли (по 1 ч.л. на стакан воды)",
      "Прием анальгетика (ибупрофен, кеторол)",
      "Категорически запрещено греть больной зуб!",
      "Аккуратная очистка межзубных промежутков зубной нитью",
      "Срочный визит к стоматологу для лечения каналов и пломбирования"
    ],
    treatmentsEn: [
      "Rinse with warm salt and baking soda solution",
      "Take an analgesic (Ibuprofen or Ketorolac) for temporary relief",
      "Never apply heat packs or crushed aspirin directly to the tooth",
      "Gently floss to remove trapped food debris",
      "Visit a dentist immediately for root canal treatment or restoration"
    ],
    doctorSpecialty: "Stomatolog",
    doctorSpecialtyRu: "Врач-стоматолог",
    doctorSpecialtyEn: "Dentist",
    recommendedDoctorId: "doc-6",
    recommendedClinicIds: ["clinic-7", "clinic-3", "clinic-5"]
  },
  {
    id: "dis-6",
    name: "Bel Og'rig'i, Ishias va Umurtqa Churrasi (Grija)",
    nameRu: "Боль в пояснице, Радикулит и Грыжа позвоночника",
    nameEn: "Lower Back Pain, Sciatica and Disc Herniation",
    category: "Nevrologiya / Ortopediya",
    keywords: [
      "bel", "belim", "bel ogriq", "bel og'rig'i", "grija", "umurtqa", "orqa", "orqam", "oyoq tortishishi",
      "ishias", "osteoxondroz", "belim qotib qoldi", "belim ogriyapti", "поясница", "спина", "грыжа",
      "радикулит", "остеохондроз", "боль в спине", "защемило", "back pain", "lower back", "sciatica", "hernia", "spine"
    ],
    urgency: "O'rtacha",
    causes: [
      "Umurtqalararo diskning degenerativ yemirilishi va nerv ildizini qisib qo'yishi (churra)",
      "Og'ir yuklarni noto'g'ri, belni bukib ko'tarish",
      "Uzoq vaqt noqulay o'tirib ishlash (ofis ishi, uzoq masofaga haydovchilik)",
      "Bel mushaklarining sovuq qotishi yoki keskin harakatdan cho'zilishi",
      "Ortiqcha vazn tufayli umurtqa pog'onasiga tushadigan doimiy bosim"
    ],
    causesRu: [
      "Дегенерация межпозвоночного диска и ущемление нервного корешка (грыжа)",
      "Подъем тяжестей с неправильной биомеханикой",
      "Длительное сидячее положение (офис, вождение)",
      "Переохлаждение мышц спины или резкое движение",
      "Избыточный вес, создающий повышенную нагрузку на поясницу"
    ],
    causesEn: [
      "Intervertebral disc degeneration compressing spinal nerve roots (hernia)",
      "Improper heavy lifting technique bending from the waist",
      "Prolonged sedentary postures (desk work, long drives)",
      "Muscle strain or hypothermia in lumbar region",
      "Excess body weight overloading the lumbar spine"
    ],
    symptoms: [
      "Bel sohasida simillovchi yoki qimirlatmaydigan o'tkir 'o'q uzgandek' og'riq",
      "Og'riqning son, boldir va tovon bo'ylab pastga tarqalishi (lyumboishalgiya)",
      "Oyoqda uvishish, chumoli o'rmalagandek sezgi yoki barmoqlar harakatining susayishi",
      "Belingizni bukib-yozishda cheklanish, to'g'ri qad rostlay olmaslik"
    ],
    symptomsRu: [
      "Острая «простреливающая» или ноющая боль в пояснице",
      "Иррадиация боли в ягодицу, бедро и стопу",
      "Онемение пальцев ног, ощущение «мурашек»",
      "Ограничение подвижности, невозможность разогнуться"
    ],
    symptomsEn: [
      "Sharp stabbing or persistent dull ache in the lumbar region",
      "Radiating pain down the buttocks, thigh, and into the foot",
      "Numbness, tingling sensations, or muscle weakness in the leg",
      "Severe mobility restriction, difficulty straightening up"
    ],
    treatments: [
      "Qattiq to'shakda tizzalar ostiga yostiq qo'yib chalqancha yotib dam olish",
      "Yallig'lanishga qarshi malhamlar (Voltaren, Diklofenak gel) surtish",
      "Mushak spazmini yechish uchun shifokor tavsiyasi bilan miorelaksantlar qabul qilish",
      "Bel sohasiga og'ir yuk tushishini qat'iyan taqiqlash, bel korsetidan foydalanish",
      "Nevropatolog ko'rigiga borib, bel umurtqasining MRT tekshiruvidan o'tish"
    ],
    treatmentsRu: [
      "Покой на жестком матрасе с валиком под коленями",
      "Противовоспалительные мази и гели (диклофенак, вольтарен)",
      "Прием миорелаксантов по назначению врача для снятия мышечного спазма",
      "Исключение осевых нагрузок на позвоночник, ношение полужесткого корсета",
      "Консультация невролога и МРТ пояснично-крестцового отдела"
    ],
    treatmentsEn: [
      "Bed rest on a firm mattress with knees slightly elevated on pillows",
      "Topical anti-inflammatory gels (Diclofenac, Voltaren)",
      "Muscle relaxants and analgesics prescribed by a specialist",
      "Avoid lifting; utilize an ergonomic lumbar support brace",
      "Consult a neurologist and obtain a lumbar spine MRI"
    ],
    doctorSpecialty: "Nevropatolog / Travmatolog",
    doctorSpecialtyRu: "Врач-невропатолог / Травматолог",
    doctorSpecialtyEn: "Neurologist / Orthopedist",
    recommendedDoctorId: "doc-2",
    recommendedClinicIds: ["clinic-1", "clinic-2", "clinic-4"]
  },
  {
    id: "dis-7",
    name: "Qandli Diabet va Moddalar Almashinuvi",
    nameRu: "Сахарный диабет и Нарушения обмена веществ",
    nameEn: "Diabetes Mellitus and Metabolic Disorders",
    category: "Endokrinologiya",
    keywords: [
      "qand", "diabet", "saxar", "shakar", "chanqash", "ogiz qurishi", "tez-tez siyish", "saxarim oshdi",
      "qondagi qand", "диабет", "сахарный диабет", "сахар", "жажда", "сухость во рту", "эндокринолог",
      "diabetes", "blood sugar", "thirst", "polyuria", "endocrinologist"
    ],
    urgency: "Surunkali / Doimiy nazorat zarur",
    causes: [
      "Oshqozon osti bezi orqali insulin ishlab chiqarilishi kamayishi yoki to'qimalarning insulinga sezuvchanligi pasayishi",
      "Irsiy (genetik) moyillik",
      "Ortiqcha vazn, semizlik va kamharakat hayot tarzi",
      "Doimiy stress va tozalangan uglevodlar (shirinlik, xamirli taomlar)ni ortiqcha iste'mol qilish"
    ],
    causesRu: [
      "Снижение выработки инсулина или инсулинорезистентность тканей",
      "Генетическая предрасположенность",
      "Избыточная масса тела и низкая физическая активность",
      "Хронический стресс и избыток простых углеводов в питании"
    ],
    causesEn: [
      "Insufficient insulin secretion or peripheral insulin resistance",
      "Hereditary predisposition",
      "Obesity and sedentary lifestyle",
      "Chronic stress and excessive intake of refined sugars"
    ],
    symptoms: [
      "Doimiy og'iz qurishi va qondirib bo'lmas kuchli chanqoq hissi (polidipsiya)",
      "Tez-tez va ko'p miqdorda siyish, ayniqsa kechalari (poliuriya)",
      "Surunkali holsizlik, tez toliqish, ishtaha kuchayganiga qaramay vazn yo'qotish",
      "Terining qichishishi va mayda yaralarning uzoq vaqt bitmasligi"
    ],
    symptomsRu: [
      "Постоянная сухость во рту и неутолимая жажда (полидипсия)",
      "Учащенное обильное мочеиспускание, особенно ночью",
      "Хроническая утомляемость, слабость, необъяснимая потеря веса",
      "Кожный зуд, медленное заживление мелких ссадин и ран"
    ],
    symptomsEn: [
      "Persistent dry mouth and extreme thirst (polydipsia)",
      "Frequent, voluminous urination, particularly at night (polyuria)",
      "Chronic fatigue, weakness, unexplained weight changes",
      "Cutaneous itching and delayed healing of superficial cuts"
    ],
    treatments: [
      "Qondagi glyukoza darajasini shaxsiy glyukometrda och qoringa va ovqatdan keyin o'lchash",
      "Maxsus 9-stol parheziga qat'iy o'tish (shirinliklar, oq non, shakarli ichimliklarni butunlay chiqarish)",
      "Endokrinolog tomonidan tavsiya etilgan qand tushiruvchi tabletkalar yoki insulin terapiyasi",
      "Har kuni kamida 30-45 daqiqa piyoda yurish yoki jismoniy mashqlar",
      "Glikirlangan gemoglobin (HbA1c) tahlilini har 3 oyda topshirish"
    ],
    treatmentsRu: [
      "Регулярный самоконтроль уровня глюкозы глюкометром натощак и после еды",
      "Соблюдение диабетической диеты (стол №9, отказ от быстрых углеводов)",
      "Прием сахароснижающих препаратов или инсулинотерапия по схеме врача",
      "Ежедневная физическая активность (ходьба от 30-40 минут)",
      "Контроль гликированного гемоглобина (HbA1c) каждые 3 месяца"
    ],
    treatmentsEn: [
      "Blood glucose monitoring using a personal glucometer",
      "Strict dietary adherence (Table 9 diabetic diet, eliminating simple sugars)",
      "Antidiabetic medications or insulin therapy under specialist guidance",
      "Moderate aerobic physical activity (at least 30-40 minutes daily)",
      "Quarterly testing of Glycated Hemoglobin (HbA1c)"
    ],
    doctorSpecialty: "Endokrinolog",
    doctorSpecialtyRu: "Врач-эндокринолог",
    doctorSpecialtyEn: "Endocrinologist",
    recommendedDoctorId: "doc-7",
    recommendedClinicIds: ["clinic-5", "clinic-1", "clinic-3"]
  },
  {
    id: "dis-8",
    name: "Gepatit va Jigar Xastaliklari",
    nameRu: "Гепатит и Заболевания печени",
    nameEn: "Hepatitis and Liver Disease",
    category: "Gastroenterologiya",
    keywords: [
      "jigar", "jigarim", "gepatit", "jigar ogriq", "ong qovurga", "ong tomonim ogriyapti", "sariq", "sariqlik",
      "o't", "ot pufagi", "jigarim ogriyapti", "печень", "гепатит", "боль в правом подреберье", "желтуха", "билирубин",
      "liver", "hepatitis", "jaundice", "right upper quadrant", "liver pain"
    ],
    urgency: "Yuqori",
    causes: [
      "Virusli gepatitlar (A, B, C, D) bilan zararlanish",
      "Yog'li, qovurilgan taomlar va spirtli ichimliklarni muntazam iste'mol qilish (yog'li gepatoz)",
      "Toksik moddalar, kuchli antibiotiklar va paratsetamolni me'yordan ortiq ichish",
      "O't yo'llarida safro dimlanishi (xolestaz) va o't pufagi toshlari"
    ],
    causesRu: [
      "Вирусные гепатиты (A, B, C)",
      "Токсическое и алкогольное поражение печени, жировой гепатоз",
      "Длительный бесконтрольный прием токсичных медикаментов",
      "Нарушение оттока желчи (холестаз) и камни в желчных протоках"
    ],
    causesEn: [
      "Viral hepatitis infections (types A, B, C)",
      "Alcoholic injury or non-alcoholic fatty liver disease (NAFLD)",
      "Drug-induced liver injury from hepatotoxic substances",
      "Biliary obstruction and cholestasis"
    ],
    symptoms: [
      "O'ng qovurg'a ostida og'irlik, sanchiq yoki bosim hissi",
      "Og'izda achchiq ta'm paydo bo'lishi, ko'ngil aynishi",
      "Ko'z oqi va terining sarg'ayishi (sariqlik alomati)",
      "Doimiy holsizlik, tez toliqish va siydik rangining to'qlashishi (pivo rangidek)"
    ],
    symptomsRu: [
      "Тяжесть и тупая боль в правом подреберье",
      "Горечь во рту по утрам, тошнота",
      "Желтушность склер глаз и кожных покровов",
      "Темная моча, общая слабость и быстрая утомляемость"
    ],
    symptomsEn: [
      "Dull ache or fullness in the right upper quadrant below the ribs",
      "Bitter taste in the mouth, nausea, and indigestion",
      "Yellowing of the whites of the eyes and skin (jaundice)",
      "Dark tea-colored urine and chronic lethargy"
    ],
    treatments: [
      "Qat'iy 5-stol parheziga rioya qilish (yog'siz taomlar, qaynatmalar, dimlangan ovqatlar)",
      "Jigar hujayralarini tiklovchi gepatoprotektorlar (shifokor tavsiyasi bilan)",
      "Spirtli ichimliklar, qovurilgan go'sht va achchiq mahsulotlardan butunlay voz kechish",
      "Jigar fermentlari (ALT, AST, bilirubin, ishqoriy fosfataza) tahlillarini topshirish",
      "Gastroenterolog yoki gepatolog ko'rigiga borib, qorin bo'shlig'i UZI tekshiruvidan o'tish"
    ],
    treatmentsRu: [
      "Строгая диета (стол №5: нежирные блюда на пару, исключение жареного)",
      "Прием гепатопротекторов по назначению врача",
      "Полный отказ от алкоголя, копченостей и острых блюд",
      "Сдача биохимического анализа крови (АЛТ, АСТ, билирубин)",
      "Консультация гепатолога и ультразвуковое исследование (УЗИ) печени"
    ],
    treatmentsEn: [
      "Adhere strictly to a hepatoprotective low-fat diet (steamed and boiled foods)",
      "Hepatoprotective therapy under gastroenterologist supervision",
      "Complete abstention from alcohol, deep-fried meals, and sharp spices",
      "Liver panel blood tests (ALT, AST, Total Bilirubin)",
      "Abdominal ultrasound examination with a liver specialist"
    ],
    doctorSpecialty: "Gastroenterolog / Gepatolog",
    doctorSpecialtyRu: "Врач-гастроэнтеролог / Гепатолог",
    doctorSpecialtyEn: "Hepatologist / Gastroenterologist",
    recommendedDoctorId: "doc-8",
    recommendedClinicIds: ["clinic-5", "clinic-1", "clinic-3"]
  },
  {
    id: "dis-9",
    name: "Pielonefrit va Buyrak Shamollashi",
    nameRu: "Пиелонефрит и Воспаление почек",
    nameEn: "Pyelonephritis and Kidney Inflammation",
    category: "Urologiya / Nefrologiya",
    keywords: [
      "buyrak", "buyragim", "pochka", "pochkam", "buyrak ogriq", "bel shamollashi", "siydik", "peshob",
      "buyragim ogriyapti", "belim sovqotdi", "почки", "почка", "пиелонефрит", "боль в почках", "моча", "нефролог",
      "kidney", "pyelonephritis", "renal", "kidney pain", "flank pain", "urination"
    ],
    urgency: "Yuqori",
    causes: [
      "Bakterial infeksiya (ichak tayoqchasi va boshqalar)ning siydik yo'llari orqali buyrakka ko'tarilishi",
      "Qattiq sovuq qotish, nam yoki sovuq joyda o'tirish",
      "Siydik qopining davolanmagan shamollashi (sistit)",
      "Buyrakda qum va toshlar bo'lishi tufayli siydik oqimining to'silishi"
    ],
    causesRu: [
      "Восходящая бактериальная инфекция (кишечная палочка)",
      "Сильное переохлаждение организма",
      "Осложнение нелеченного цистита",
      "Нарушение оттока мочи из-за мочекаменной болезни"
    ],
    causesEn: [
      "Ascending bacterial urinary tract infection (often E. coli)",
      "Severe systemic or localized hypothermia",
      "Complication of untreated lower urinary cystitis",
      "Urinary outflow impairment from nephrolithiasis (kidney stones)"
    ],
    symptoms: [
      "Bel sohasida bir yoki ikki tomondan simillovchi yoki qattiq tortuvchi og'riq",
      "Tana haroratining 38°C - 39°C gacha ko'tarilishi, titroq va kuchli terlash",
      "Tez-tez va og'riqli siyish, siydik rangining loyqalanishi",
      "Ertalabki yuz va ko'z atrofi shishlari, lanjlik"
    ],
    symptomsRu: [
      "Ноющая или тянущая боль в поясничной области с одной или двух сторон",
      "Высокая температура (до 39°C), озноб и проливной пот",
      "Учащенное, болезненное мочеиспускание, мутная моча",
      "Отеки под глазами по утрам, выраженная интоксикация"
    ],
    symptomsEn: [
      "Dull ache or throbbing pain in the flank and lower back",
      "High fever (up to 39°C), rigors, and nocturnal sweats",
      "Urgent painful urination, cloudy or foul-smelling urine",
      "Morning facial and periorbital puffiness, malaise"
    ],
    treatments: [
      "Bel sohasini issiq tutish va qat'iy yotoq rejimi",
      "Kuniga 2 - 2.5 litr iliq suyuqlik (brusnika morsisi, na'matak damlamasi) ichish",
      "Urolog/nefrolog tavsiyasi bilan antibakterial va uroseptik dorilar kursi",
      "Tuz va achchiq mahsulotlarni ratsiondan cheklash",
      "Umumiy siydik tahlili, Nechiporenko tahlili va buyrak UZI tekshiruvidan o'tish"
    ],
    treatmentsRu: [
      "Постельный режим и сухое тепло на область поясницы",
      "Обильный питьевой режим (клюквенный морс, почечный чай)",
      "Курс антибактериальной терапии по назначению врача-уролога",
      "Бессолевая или малосолевая диета",
      "Сдача общего анализа мочи, анализа по Нечипоренко и УЗИ почек"
    ],
    treatmentsEn: [
      "Bed rest and gentle warmth applied to the lumbar region",
      "Hydration therapy with 2-2.5 liters of cranberry or herbal teas",
      "Targeted antimicrobial regimen prescribed by an urologist/nephrologist",
      "Dietary salt restriction during the acute phase",
      "Urinalysis, urine culture, and comprehensive renal sonogram"
    ],
    doctorSpecialty: "Urolog / Nefrolog",
    doctorSpecialtyRu: "Врач-уролог / Нефролог",
    doctorSpecialtyEn: "Urologist / Nephrologist",
    recommendedDoctorId: "doc-10",
    recommendedClinicIds: ["clinic-1", "clinic-5", "clinic-3"]
  },
  {
    id: "dis-10",
    name: "Bronxit va O'pka Shamollashi (Pnevmoniya)",
    nameRu: "Бронхит и Воспаление легких (Пневмония)",
    nameEn: "Bronchitis and Pneumonia",
    category: "Pulmonologiya",
    keywords: [
      "opka", "o'pka", "opkam", "pnevmoniya", "bronxit", "yotal", "yo'tal", "balgam", "balg'am",
      "xirillash", "kokrak ogriq", "nafas", "nafasim", "пневмония", "бронхит", "легкие", "кашель",
      "мокрота", "хрипы", "воспаление легких", "пульмонолог", "pneumonia", "bronchitis", "lungs", "cough", "phlegm", "wheezing"
    ],
    urgency: "Yuqori / Zudlik bilan tekshiruv zarur",
    causes: [
      "O'tkir respirator viruslar va bakteriyalar (pnevmokokk, streptokokk)ning quyi nafas yo'llariga o'tishi",
      "O'tkazilgan gripp yoki shamollashning asoratlanishi",
      "Qattiq sovuq qotish va organizm immunitetining keskin tushishi",
      "Tamaki chekish, chang yoki kimyoviy tutunlar bilan uzoq vaqt nafas olish"
    ],
    causesRu: [
      "Бактериальная или вирусная инфекция нижних дыхательных путей (пневмококк)",
      "Осложнение перенесенного гриппа или ОРВИ",
      "Тяжелое переохлаждение и иммунодефицит",
      "Курение, вдыхание пыли или химических раздражителей"
    ],
    causesEn: [
      "Bacterial (Pneumococcal) or viral infection of lower airways",
      "Secondary complication of untreated flu or cold",
      "Severe hypothermia and weakened systemic immunity",
      "Cigarette smoking or inhalation of airborne environmental pollutants"
    ],
    symptoms: [
      "Chuqur, xirillovchi va balg'amli (sariq/yashil rangli) yo'tal",
      "Nafas olganda ko'krak qafasida sanchiq og'riq va nafas qisishi",
      "Tana haroratining 38.5°C dan yuqori bo'lishi va kechasi sovuq ter bosishi",
      "Kuchli lanjlik, bosh og'rig'i va ishtahasizlik"
    ],
    symptomsRu: [
      "Глубокий кашель с отхождением гнойной или слизистой мокроты",
      "Боль в груди при глубоком вдохе, одышка при минимальной нагрузке",
      "Стойкая высокая температура выше 38.5°C, ночная потливость",
      "Выраженная слабость, тахикардия и потеря аппетита"
    ],
    symptomsEn: [
      "Deep chesty cough with purulent yellow/greenish sputum",
      "Pleuritic chest pain on deep inspiration and dyspnea",
      "Persistent high fever above 38.5°C with night sweats",
      "Extreme lethargy, shortness of breath, and appetite loss"
    ],
    treatments: [
      "Darhol pulmonolog yoki terapevt ko'rigiga borish, stetoskop bilan o'pkani eshitish",
      "O'pka rentgenogrammasi yoki MSKT tekshiruvidan o'tish",
      "Pulsoksimetrda qondagi kislorod miqdorini (SpO2) o'lchash (95% dan past bo'lsa shifoxona)",
      "Shifokor ko'rsatmasi bilan antibiotiklar va balg'am ko'chiruvchi dori vositalari",
      "Mo'l iliq suyuqlik ichish va ingalyatsiya muolajalari"
    ],
    treatmentsRu: [
      "Немедленный осмотр пульмонолога или терапевта (аускультация легких)",
      "Рентгенография органов грудной клетки или КТ легких",
      "Контроль сатурации кислорода в крови пульсоксиметром (норма от 95%)",
      "Антибактериальная и муколитическая терапия строго по рецепту врача",
      "Обильное щелочное теплое питье и щадящий режим"
    ],
    treatmentsEn: [
      "Urgent physical examination and chest auscultation by a pulmonologist",
      "Chest radiography (X-ray) or low-dose computed tomography (CT)",
      "Pulse oximetry monitoring (seek immediate care if SpO2 drops below 95%)",
      "Physician-prescribed antibacterial and mucolytic regimen",
      "Ample hydration and nebulizer inhalation therapies"
    ],
    doctorSpecialty: "Pulmonolog / Terapevt",
    doctorSpecialtyRu: "Врач-пульмонолог / Терапевт",
    doctorSpecialtyEn: "Pulmonologist / Internist",
    recommendedDoctorId: "doc-9",
    recommendedClinicIds: ["clinic-3", "clinic-6", "clinic-1"]
  },
  {
    id: "dis-11",
    name: "Bronxial Astma va Bo'g'ilish Xuruji",
    nameRu: "Бронхиальная Астма и Приступы удушья",
    nameEn: "Bronchial Asthma and Dyspnea",
    category: "Pulmonologiya / Allergologiya",
    keywords: [
      "astma", "nafas qisishi", "bogilish", "bo'g'ilish", "nafas ololmayapman", "xirillash", "allergiya",
      "havo yetmayapti", "астма", "приступ астмы", "удушье", "одышка", "свистящее дыхание", "не хватает воздуха",
      "asthma", "dyspnea", "shortness of breath", "wheezing", "breathless", "inhaler"
    ],
    urgency: "Yuqori / Xuruj vaqtida shoshilinch",
    causes: [
      "Bronxlarning surunkali allergik va immunologik giperfaolligi",
      "Tashqi allergenlar (o'simlik changi, uy chang oqadalari, hayvon juni, mog'or)",
      "Sovuq havo, jismoniy zo'riqish yoki kuchli asabiylashish",
      "O'tkir hidlar, tamaki tutuni yoki kimyoviy spreylar"
    ],
    causesRu: [
      "Хроническое аллергическое воспаление бронхов",
      "Воздействие аллергенов (пыльца растений, пыль, шерсть животных)",
      "Холодный воздух, физическая нагрузка или сильный стресс",
      "Резкие запахи, табачный дым, бытовая химия"
    ],
    causesEn: [
      "Chronic immunological hyperreactivity of bronchial pathways",
      "Exposure to aeroallergens (pollen, dust mites, pet dander)",
      "Cold air inhalation, strenuous exertion, or acute emotional stress",
      "Irritants such as strong scents, smoke, or aerosol chemicals"
    ],
    symptoms: [
      "Nafas chiqarishning qiyinlashishi va uzoqdan eshitiluvchi hushtaksimon xirillash",
      "Ko'krakda siqilish, tiqilish va havo yetishmasligi hissi",
      "Quruq, qiynovchi yo'tal, ayniqsa tunda yoki ertalab",
      "Xuruj paytida majburiy oldinga egilib o'tirish holati"
    ],
    symptomsRu: [
      "Затрудненный выдох со свистящими хрипами, слышными на расстоянии",
      "Чувство стеснения и сдавленности в грудной клетке",
      "Приступообразный сухой кашель, особенно ночью и под утро",
      "Вынужденная поза сидя с упором на руки для облегчения дыхания"
    ],
    symptomsEn: [
      "Expiratory difficulty with audible musical wheezing",
      "Tightness and oppressive feeling within the chest cage",
      "Spasmodic dry cough worsening at night and dawn",
      "Tripod seating position to facilitate breathing during attacks"
    ],
    treatments: [
      "Darhol bemorga shifokor yozib bergan tezkor bronxolitik ingalyatorni (Salbutamol) purkash",
      "Derazalarni ochib toza havo kiritish va tor kiyimlarni yechish",
      "Agar xuruj 10-15 daqiqada o'tmasa, darhol 103 (Tez yordam) chaqirish",
      "Allergolog-pulmonolog ko'rigiga yozilib, spirometriya va allergen panelini topshirish",
      "Doimiy bazis yallig'lanishga qarshi ingalyatsion dori vositalarini qabul qilish"
    ],
    treatmentsRu: [
      "Срочно применить быстродействующий бронхорасширяющий ингалятор (Сальбутамол)",
      "Обеспечить доступ свежего воздуха, расстегнуть одежду",
      "Если приступ не купируется за 10-15 минут — вызвать скорую помощь (103)",
      "Спирометрия (функция внешнего дыхания) и консультация пульмонолога",
      "Базисная противовоспалительная терапия ингаляционными стероидами"
    ],
    treatmentsEn: [
      "Administer rapid-acting rescue bronchodilator (Salbutamol inhaler)",
      "Open windows for fresh ventilation, loosen restrictive collar/clothing",
      "If the bronchospasm persists past 10-15 minutes, dial 103 immediately",
      "Undergo spirometry (pulmonary function testing) with an allergist",
      "Adhere strictly to baseline inhaled corticosteroid maintenance regimen"
    ],
    doctorSpecialty: "Pulmonolog / Allergolog",
    doctorSpecialtyRu: "Врач-пульмонолог / Аллерголог",
    doctorSpecialtyEn: "Pulmonologist / Allergist",
    recommendedDoctorId: "doc-9",
    recommendedClinicIds: ["clinic-3", "clinic-7", "clinic-1"]
  },
  {
    id: "dis-12",
    name: "Allergik Dermatit, Toshma va Eshakemi",
    nameRu: "Аллергический дерматит, Сыпь и Крапивница",
    nameEn: "Allergic Dermatitis, Rash and Urticaria",
    category: "Dermatologiya",
    keywords: [
      "allergiya", "toshma", "qichima", "qichishish", "teri", "eshakemi", "dermatit", "terim qichiyapti",
      "qizil toshma", "yuzim toshdi", "аллергия", "сыпь", "крапивница", "зуд", "дерматит", "кожа", "чешется",
      "пятна на коже", "дерматолог", "allergy", "rash", "urticaria", "hives", "itching", "dermatitis", "skin rash"
    ],
    urgency: "O'rtacha (Nafas yo'llari shishsa zudlik bilan)",
    causes: [
      "Oziq-ovqat allergenlari (sitrus, qulupnay, yong'oq, asal, shokolad, dengiz mahsulotlari)",
      "Dori vositalariga (antibiotiklar, vitaminlar, nosteroid dorilar) nojo'ya allergiya",
      "Maishiy kimyo, kir yuvish kukunlari va parvarish vositalari bilan to'g'ridan-to'g'ri aloqa",
      "Hasharotlar chaqishi yoki o'simlik gulchanglari"
    ],
    causesRu: [
      "Пищевые аллергены (цитрусовые, клубника, орехи, шоколад)",
      "Медикаментозная непереносимость (антибиотики, НПВП)",
      "Контакт с агрессивной бытовой химией или косметикой",
      "Укусы насекомых или реакция на пыльцу растений"
    ],
    causesEn: [
      "Nutritional triggers (citrus, berries, nuts, shellfish, chocolate)",
      "Drug hypersensitivity (antibiotics, NSAIDs, sulfa drugs)",
      "Contact exposure to detergents, chemicals, or cosmetic agents",
      "Insect stings or airborne allergen contact"
    ],
    symptoms: [
      "Terida qizargan dog'lar, mayda toshmalar yoki pufakchalar paydo bo'lishi",
      "Kechasi kuchayuvchi chidab bo'lmas qichishish va achishish",
      "Terining qizarishi, quruqlashishi va po'st tashlashi",
      "Eshakemida yirik bo'rtib chiqqan qizil qavariqlar (chivin chaqqandek)"
    ],
    symptomsRu: [
      "Появление красных зудящих пятен, папул или пузырьков на коже",
      "Интенсивный зуд, усиливающийся в тепле и ночью",
      "Сухость, шелушение и микротрещины кожи",
      "Волдыри, напоминающие ожог крапивой (крапивница)"
    ],
    symptomsEn: [
      "Erythematous plaques, papules, or weeping vesicles on the skin",
      "Intolerable itching and burning sensations",
      "Localized cutaneous edema, peeling, and dryness",
      "Raised blanching wheals resembling nettle stings (urticaria)"
    ],
    treatments: [
      "Gumon qilingan allergen bilan har qanday aloqani zudlik bilan to'xtatish",
      "Antigistamin (allergiyaga qarshi) vositalarini (Loratadin, Tsetirizin) qabul qilish",
      "Teriga tinchlantiruvchi, qichishishni kamaytiruvchi malhamlar (Fenistil gel, sinkli malham) surtish",
      "Spirtli ichimlik, achchiq, sho'r va allergiyani kuchaytiruvchi taomlardan parhez saqlash",
      "Dermatolog yoki allergolog ko'rigiga yozilib, tekshiruvdan o'tish"
    ],
    treatmentsRu: [
      "Прекратить контакт с предполагаемым аллергеном",
      "Принять антигистаминный препарат (цетиризин, лоратадин)",
      "Нанести противозудный гель или мазь (Фенистил, цинковая паста)",
      "Гипоаллергенная диета (исключить цитрусовые, шоколад, специи)",
      "Осмотр врача-дерматолога или аллерголога"
    ],
    treatmentsEn: [
      "Immediately eliminate contact with suspected offending allergen",
      "Administer oral antihistamines (Cetirizine, Loratadine)",
      "Apply topical soothing antipruritic formulations (Calamine, Fenistil)",
      "Hypoallergenic dietary restriction avoiding spicy/histaminic foods",
      "Schedule evaluation with a dermatologist or clinical allergist"
    ],
    doctorSpecialty: "Dermatolog / Allergolog",
    doctorSpecialtyRu: "Врач-дерматолог / Аллерголог",
    doctorSpecialtyEn: "Dermatologist / Allergist",
    recommendedDoctorId: "doc-13",
    recommendedClinicIds: ["clinic-7", "clinic-5", "clinic-1"]
  },
  {
    id: "dis-13",
    name: "Konyunktivit va Ko'z Kasalliklari",
    nameRu: "Конъюнктивит и Заболевания глаз",
    nameEn: "Conjunctivitis and Eye Disorders",
    category: "Oftalmologiya",
    keywords: [
      "koz", "ko'z", "kozim", "konyunktivit", "ko'z qizarishi", "ko'z yoshlanishi", "ko'rish xiralashishi",
      "kozim ogriyapti", "yiring", "glaz", "глаз", "глаза", "конъюнктивит", "красные глаза", "слезятся глаза",
      "зрение", "офтальмолог", "окулист", "eye", "eyes", "conjunctivitis", "pink eye", "eye redness", "ophthalmologist"
    ],
    urgency: "O'rtacha",
    causes: [
      "Bakterial (stafilokokk, streptokokk) yoki virusli (adenovirus) infeksiya",
      "Ko'zga chang, qum yoki begona jism kirishi",
      "Mavsumiy allergiya (o'simlik changi, hayvon juni)",
      "Uzoq vaqt ekran qarshisida ishlash tufayli ko'z shilliq qavatining qurishi"
    ],
    causesRu: [
      "Бактериальная или вирусная (аденовирусная) инфекция",
      "Попадание пыли, инородных частиц или химических веществ",
      "Аллергическая реакция на пыльцу, косметику или шерсть",
      "Синдром сухого глаза из-за длительной работы за монитором"
    ],
    causesEn: [
      "Bacterial or adenoviral microbial infection",
      "Foreign body irritation, particulate matter, or chemical exposure",
      "Allergic hypersensitivity to pollens or cosmetics",
      "Dry eye syndrome following prolonged digital screen exposure"
    ],
    symptoms: [
      "Ko'z oqining qizarishi va tomirlarning kengayishi",
      "Ko'zda qum tiqilgandek achishish, og'riq va qichishish",
      "Ko'p yosh oqishi va ayniqsa ertalab qovoqlarning yiring bilan yopishib qolishi",
      "Yorug'likka qaray olmaslik (yorug'likdan qo'rqish)"
    ],
    symptomsRu: [
      "Покраснение склер и выраженная сосудистая сетка глаз",
      "Ощущение «песка», жжение и резкая боль в глазах",
      "Слезотечение и гнойные выделения, склеивающие веки по утрам",
      "Светобоязнь и повышенная утомляемость глаз"
    ],
    symptomsEn: [
      "Hyperemia and pronounced vascular injection of the sclera",
      "Foreign body sensation, burning, and grittiness",
      "Epiphora (excess tearing) and crusting purulent exudate sealing eyelids",
      "Photophobia and transient visual fatigue"
    ],
    treatments: [
      "Ko'zni iflos qo'llar bilan ishqalamaslik va shaxsiy sochiq tutish",
      "Ko'zni antiseptik eritma (Furatsilin yoki fiziologik eritma) bilan tozalash",
      "Oftalmolog tavsiyasi bilan antibakterial yoki yallig'lanishga qarshi ko'z tomchilari tomizish",
      "Kontakt linzalar taqishni vaqtincha to'xtatish",
      "Oftalmolog (ko'z shifokori) qabuliga borib, ko'ruv o'tkirligi va ko'z tubini tekshirtirish"
    ],
    treatmentsRu: [
      "Соблюдение гигиены: не тереть глаза, использовать индивидуальное полотенце",
      "Промывание глаз раствором фурацилина или физраствором",
      "Применение антибактериальных капель (только по назначению врача)",
      "Отказ от контактных линз и макияжа на время лечения",
      "Консультация офтальмолога для осмотра глазного дна"
    ],
    treatmentsEn: [
      "Strict hand hygiene: avoid rubbing eyes, use dedicated personal towels",
      "Gently flush ocular surfaces with sterile saline or boric wash",
      "Administer ophthalmic drops under doctor's prescription",
      "Temporarily discontinue contact lens and ocular cosmetics use",
      "Undergo slit-lamp biomicroscopy with an ophthalmologist"
    ],
    doctorSpecialty: "Oftalmolog (Ko'z shifokori)",
    doctorSpecialtyRu: "Врач-офтальмолог (Окулист)",
    doctorSpecialtyEn: "Ophthalmologist",
    recommendedDoctorId: "doc-11",
    recommendedClinicIds: ["clinic-3", "clinic-1", "clinic-6"]
  },
  {
    id: "dis-14",
    name: "Gaymorit va Sinusit",
    nameRu: "Гайморит и Синусит",
    nameEn: "Sinusitis and Maxillary Sinus Infection",
    category: "LOR",
    keywords: [
      "gaymorit", "burun", "peshona", "peshonam", "burun bitishi", "sinusit", "rinit", "burun oqishi",
      "peshonam ogriyapti", "burun ogriq", "gaymoritman", "гайморит", "синусит", "заложенность носа", "нос",
      "боль во лбу", "насморк", "лор", "sinusitis", "sinus", "nasal congestion", "maxillary", "rhinitis", "ent"
    ],
    urgency: "O'rtacha",
    causes: [
      "Davolanmagan yoki noto'g'ri davolangan surunkali shamollash va rinit",
      "Gaymor bo'shlig'iga bakterial yoki virusli infeksiya kirishi",
      "Burun to'sig'ining qiyshayishi tufayli shilliq chiqib ketishining buzilishi",
      "Yuqori jag' tishlaridagi karies yoki ildiz yallig'lanishining bo'shliqqa o'tishi (odontogen gaymorit)"
    ],
    causesRu: [
      "Недолеченный острый насморк или ОРВИ",
      "Проникновение бактериальной флоры в гайморовы пазухи",
      "Искривление носовой перегородки, нарушающее дренаж слизи",
      "Инфекция от корней верхних зубов (одонтогенный гайморит)"
    ],
    causesEn: [
      "Persistent or improperly treated viral rhinitis and ARVI",
      "Bacterial colonization of the maxillary sinus cavities",
      "Deviated nasal septum hindering physiological mucus outflow",
      "Dental root apical infection penetrating sinus floor"
    ],
    symptoms: [
      "Peshona, ko'z atrofi va burun yonida bosuvchi, simillovchi kuchli og'riq",
      "Boshni pastga egganida og'riqning keskin kuchayishi",
      "Burundan yiringli, sariq-yashil rangli quyuq ajralma kelishi",
      "Burun orqali nafas olishning qiyinlashishi, hid bilish pasayishi va holsizlik"
    ],
    symptomsRu: [
      "Давящая распирающая боль в области лба, щек и переносицы",
      "Усиление боли при наклоне головы вперед и вниз",
      "Гнойные желто-зеленые выделения из носовых ходов",
      "Стойкая заложенность носа, снижение обоняния, слабость"
    ],
    symptomsEn: [
      "Oppressive facial pressure over the cheeks, forehead, and bridge of nose",
      "Aggravation of pain upon bending forward or downward",
      "Thick purulent discolored (yellowish-green) nasal discharge",
      "Obstinate nasal obstruction, hyposmia, and mild fever"
    ],
    treatments: [
      "Burun bo'shlig'ini tuzli suv yoki izotonik sprey (Akvamaris, LinAkva) bilan kuniga 4-5 marta yuvish",
      "Shishni kamaytiruvchi burun spreylarini shifokor nazorati ostida 5 kundan oshirmay ishlatish",
      "LOR shifokori buyurgan antibakterial dorilar va mukolitiklar",
      "Hech qachon burun ustiga issiq tuxum yoki tuz qo'yib qizdirmaslik (yiring tarqalishi xavfi!)",
      "LOR mutaxassisi ko'rigiga borib, burun bo'shliqlari rentgeni yoki KT qildirish"
    ],
    treatmentsRu: [
      "Промывание носовых ходов изотоническими солевыми растворами 4-5 раз в день",
      "Использование сосудосуживающих спреев не более 5 дней подряд",
      "Прием антибактериальных препаратов строго по рецепту ЛОР-врача",
      "Категорически запрещено греть пазухи при подозрении на гной!",
      "Рентгенография придаточных пазух носа и осмотр отоларинголога"
    ],
    treatmentsEn: [
      "Perform high-volume isotonic saline nasal lavages 4-5 times daily",
      "Decongestant sprays restricted strictly to a maximum of 5 consecutive days",
      "Physician-directed antimicrobial and mucolytic medications",
      "Avoid localized heat application if bacterial suppuration is suspected",
      "Consult an ENT surgeon for anterior rhinoscopy and sinus radiography"
    ],
    doctorSpecialty: "LOR (Otolaringolog)",
    doctorSpecialtyRu: "Врач-отоларинголог (ЛОР)",
    doctorSpecialtyEn: "ENT Specialist (Otolaryngologist)",
    recommendedDoctorId: "doc-12",
    recommendedClinicIds: ["clinic-7", "clinic-6", "clinic-3"]
  },
  {
    id: "dis-15",
    name: "Angina va O'tkir Tonzillit (Tomoq Og'rig'i)",
    nameRu: "Ангина и Острый Тонзиллит (Боль в горле)",
    nameEn: "Tonsillitis and Acute Strep Throat",
    category: "LOR / Terapiya",
    keywords: [
      "angina", "tomoq", "tomog'im", "tomoq ogriq", "tomog'im ogriyapti", "yutina olmayapman", "bodomcha",
      "yutishda ogriq", "tomoq qichishi", "ангина", "тонзиллит", "горло", "болит горло", "больно глотать",
      "гланды", "гнойники в горле", "angina", "tonsillitis", "sore throat", "throat pain", "strep throat", "swallowing"
    ],
    urgency: "O'rtacha",
    causes: [
      "A guruhiga mansub gemolitik streptokokk yoki stafilokokk bakteriyalari bilan zararlanish",
      "Sovuq ichimliklar ichish, muzqaymoq yeyish yoki qattiq sovuq qotish",
      "Surunkali tonzillitning immunitet pasayishi oqibatida qaytalanishi (retsidiv)",
      "Bemor odam bilan muloqot va umumiy idish-tovoqlardan foydalanish"
    ],
    causesRu: [
      "Бактериальная инфекция (бета-гемолитический стрептококк группы А)",
      "Употребление ледяных напитков, переохлаждение",
      "Обострение хронического тонзиллита при снижении иммунитета",
      "Воздушно-капельный путь заражения от больного человека"
    ],
    causesEn: [
      "Bacterial inoculation by Group A beta-hemolytic Streptococcus",
      "Cold beverage ingestion paired with systemic chill",
      "Exacerbation of chronic tonsillar inflammation",
      "Droplet contamination from infected individuals"
    ],
    symptoms: [
      "Yutinishda va hatto tupuk yutganda kuchli achishuvchi tomoq og'rig'i",
      "Tomoq bodomcha bezlarining qizarishi, shishishi va ustida oq-sariq yiring to'planishi",
      "Tana haroratining 38°C - 40°C gacha ko'tarilishi, titroq",
      "Jag' osti limfa tugunlarining kattalashishi va ushlaganda og'rishi"
    ],
    symptomsRu: [
      "Резкая боль в горле, усиливающаяся при глотании",
      "Покраснение, отек небных миндалин и появление беловатого гнойного налета",
      "Высокая температура тела (до 39-40°C), озноб",
      "Увеличение и болезненность подчелюстных лимфатических узлов"
    ],
    symptomsEn: [
      "Excruciating throat pain markedly heightened during swallowing",
      "Erythematous swollen palatine tonsils with follicular purulent exudates",
      "Sudden pyrexia ranging between 38.5°C and 40°C with chills",
      "Tender, enlarged submandibular lymphadenopathy"
    ],
    treatments: [
      "Tomoqni antiseptiklar (Furatsilin, Xlorgeksidin, romashka damlamasi) bilan har 2 soatda chayqash",
      "LOR yoki terapevt buyurgan antibakterial preparatlar kursini to'liq (kamida 7-10 kun) ichish",
      "Yumshoq, iliq taomlar (sho'rva, pyure) iste'mol qilish, achchiq va qattiq narsalardan saqlanish",
      "Harorat ko'tarilganda paratsetamol yoki ibuprofen qabul qilish",
      "Yiringni hech qachon barmoq yoki paxta bilan bosib tozalashga urinmaslik!"
    ],
    treatmentsRu: [
      "Полоскание горла антисептиками (фурацилин, хлоргексидин) каждые 2-3 часа",
      "Полный курс системных антибиотиков строго по назначению врача",
      "Теплая мягкая пища, исключение грубой, острой и горячей еды",
      "Жаропонижающие и обезболивающие препараты при необходимости",
      "Ни в коем случае самостоятельно не сдирать гнойные пробки!"
    ],
    treatmentsEn: [
      "Gargle with antiseptic solutions (Chlorhexidine, warm saline) every 2-3 hours",
      "Complete the entire physician-prescribed course of oral antibiotics",
      "Ingest lukewarm soft food (purees, broths); avoid abrasive textures",
      "Use antipyretics and NSAIDs for analgesia and temperature control",
      "Never mechanically scrape or manipulate tonsillar crypts at home"
    ],
    doctorSpecialty: "LOR / Terapevt",
    doctorSpecialtyRu: "Врач-отоларинголог / Терапевт",
    doctorSpecialtyEn: "ENT Specialist / Internist",
    recommendedDoctorId: "doc-12",
    recommendedClinicIds: ["clinic-7", "clinic-3", "clinic-6"]
  },
  {
    id: "dis-16",
    name: "Otit va Quloq Og'rig'i",
    nameRu: "Отит и Боль в ухе",
    nameEn: "Otitis and Earache",
    category: "LOR",
    keywords: [
      "quloq", "qulog'im", "otit", "quloq ogriq", "qulog'im ogriyapti", "eshitish", "quloq shangillashi",
      "quloqdan yiring", "ухо", "уши", "отит", "боль в ухе", "стреляет в ухе", "заложило ухо", "слух",
      "ear", "earache", "otitis", "ear pain", "hearing", "ear infection"
    ],
    urgency: "O'rtacha",
    causes: [
      "Burun va tomoqdagi shamollashning Yevstaxiy nayi orqali o'rta quloqqa o'tishi",
      "Cho'milganda quloqqa iflos suv kirishi va shamol tegishi",
      "Quloqni paxtali tayoqcha, to'g'nog'ich yoki o'tkir narsalar bilan tozalashda pardani jarohatlash",
      "Immunitetning zaiflashishi natijasida bakterial infeksiya ko'payishi"
    ],
    causesRu: [
      "Переход инфекции из носоглотки через слуховую трубу (осложнение насморка)",
      "Попадание загрязненной воды в слуховой проход с последующим переохлаждением",
      "Травматизация барабанной перепонки ватными палочками или шпильками",
      "Бактериальная или грибковая инфекция наружного уха"
    ],
    causesEn: [
      "Spread of nasopharyngeal infection via the Eustachian tube",
      "Contaminated water retention in the canal followed by draft exposure",
      "Mechanical micro-trauma from cotton swabs or pins",
      "Secondary bacterial or fungal otic colonization"
    ],
    symptoms: [
      "Quloqda o'tkir, sanchuvchi yoki 'otuvchi' kuchli og'riq",
      "Og'riqning chakka, jag' yoki bo'yinga tarqalishi",
      "Eshitish qobiliyatining pasayishi, quloq bitishi va shang'illash",
      "Tana haroratining ko'tarilishi, quloqdan suyuqlik yoki yiring kelishi"
    ],
    symptomsRu: [
      "Стреляющая, пульсирующая или ноющая резкая боль в ухе",
      "Иррадиация боли в челюсть, шею или висок",
      "Снижение слуха, ощущение заложенности и шума в ухе",
      "Повышение температуры, возможные гнойные или серозные выделения"
    ],
    symptomsEn: [
      "Severe sharp, shooting, or throbbing otalgia",
      "Referred pain to the jawline, mastoid, or ipsilateral temple",
      "Auditory attenuation, feeling of fullness, and tinnitus",
      "Pyrexia and seropurulent otorrhea from the canal"
    ],
    treatments: [
      "LOR shifokori ko'rmaguncha quloqqa spirt yoki qizdiruvchi tomchilarni o'zboshimchalik bilan tomizmaslik!",
      "Og'riqni kamaytirish uchun nosteroid og'riq qoldiruvchi (Ibuprofen, Paratsetamol) qabul qilish",
      "Burun bitishini ochish uchun tomir toraytiruvchi sprey sepish (quloq bosimini tenglashtirish uchun)",
      "Quloqqa suv kirishidan ehtiyot bo'lish",
      "Zudlik bilan LOR shifokoriga ko'rinib, quloq pardasini otoskop bilan tekshirtirish"
    ],
    treatmentsRu: [
      "Не капать борный спирт и согревающие капли до осмотра врача (риск перфорации!)",
      "Прием системных обезболивающих (ибупрофен, парацетамол)",
      "Сосудосуживающие капли в нос для восстановления проходимости слуховой трубы",
      "Беречь ухо от попадания воды",
      "Срочная консультация ЛОР-врача для проведения отоскопии"
    ],
    treatmentsEn: [
      "Do not instill warming or alcoholic drops without confirming eardrum integrity",
      "Oral analgesics (Ibuprofen, Paracetamol) for pain control",
      "Nasal decongestant drops to ventilate the Eustachian tube",
      "Protect the ear canal against moisture entry",
      "Immediate otoscopy by an ENT specialist"
    ],
    doctorSpecialty: "LOR (Otolaringolog)",
    doctorSpecialtyRu: "Врач-отоларинголог (ЛОР)",
    doctorSpecialtyEn: "ENT Specialist (Otolaryngologist)",
    recommendedDoctorId: "doc-12",
    recommendedClinicIds: ["clinic-7", "clinic-6", "clinic-3"]
  },
  {
    id: "dis-17",
    name: "Artrit, Artroz va Bo'g'im Og'riqlari",
    nameRu: "Артрит, Артроз и Боль в суставах",
    nameEn: "Arthritis, Arthrosis and Joint Pain",
    category: "Ortopediya / Revmatologiya",
    keywords: [
      "bogim", "bo'g'im", "bog'im", "tizza", "tizzam", "tizza ogriq", "artrit", "artroz", "oyoq", "oyog'im",
      "revmatizm", "podagra", "qo'l ogriq", "tizzam qisirlayapti", "bo'g'imlarim", "суставы", "колено", "артрит",
      "артроз", "боль в суставах", "хруст в коленях", "подагра", "ревматизм", "ортопед", "joint", "arthritis", "arthrosis", "knee pain", "gout", "rheumatism"
    ],
    urgency: "O'rtacha",
    causes: [
      "Bo'g'im tog'ay to'qimasining yoshga doir yemirilishi va yupqalashishi (artroz)",
      "Autoimmun yoki infeksion yallig'lanish jarayonlari (revmatoid artrit)",
      "Bo'g'imlarda siydik kislotasi tuzlari to'planishi (podagra)",
      "Ortiqcha vazn va bo'g'imlarga tushadigan haddan tashqari jismoniy zo'riqish",
      "O'tkazilgan jarohatlar, chiqishlar va pay cho'zilishlari"
    ],
    causesRu: [
      "Возрастная дегенерация и истончение суставного хряща (артроз)",
      "Аутоиммунное или инфекционное воспаление суставов (артрит)",
      "Отложение кристаллов мочевой кислоты в суставах (подагра)",
      "Повышенная механическая нагрузка из-за лишнего веса",
      "Перенесенные спортивные или бытовые травмы"
    ],
    causesEn: [
      "Age-related cartilage wear and tear (osteoarthritis)",
      "Autoimmune inflammatory synovitis (rheumatoid arthritis)",
      "Uric acid crystal deposition in joints (gout)",
      "Mechanical overloading secondary to excess body weight",
      "Post-traumatic joint instability or ligament damage"
    ],
    symptoms: [
      "Harakatlanganda, zinalardan tushib-chiqqanda tizza yoki bo'g'imda sanchuvchi og'riq",
      "Bo'g'imning qizarishi, shishishi va ushlaganda qizib turishi",
      "Ertalabki bo'g'imlar qotib qolishi (harakatlanish uchun 30 daqiqa vaqt talab etilishi)",
      "Bo'g'imlarda qisirlash, g'irchillash ovozlari eshitilishi"
    ],
    symptomsRu: [
      "Боль в коленях или других суставах при ходьбе и подъеме по лестнице",
      "Припухлость, отек и локальное повышение температуры сустава",
      "Утренняя скованность в суставах продолжительностью более 30 минут",
      "Характерный хруст и ограничение амплитуды движений"
    ],
    symptomsEn: [
      "Joint pain aggravated by weight-bearing and stair climbing",
      "Joint swelling, effusion, and localized warmth",
      "Morning joint stiffness lasting over 30 minutes",
      "Coarse crepitus and diminished range of motion"
    ],
    treatments: [
      "Bo'g'imga tushadigan ortiqcha yuklamani kamaytirish, qulay ortopedik poyabzal kiyish",
      "Yallig'lanishga qarshi malhamlar (Voltaren, Xondroksid gel) surtish",
      "Shifokor buyurgan xondroprotektorlar va nosteroid preparatlar",
      "O'tkir davr o'tgach, davolovchi gimnastika va suzish bilan shug'ullanish",
      "Revmatolog yoki ortoped-travmatolog ko'rigiga borib, bo'g'im rentgeni yoki MRT qildirish"
    ],
    treatmentsRu: [
      "Снижение осевой нагрузки на суставы, использование ортопедических стелек",
      "Местное применение противовоспалительных мазей (хондроксид, вольтарен)",
      "Прием хондропротекторов и НПВП по назначению врача",
      "Лечебная физкультура (ЛФК), плавание в бассейне",
      "Рентгенография или МРТ суставов, консультация ревматолога"
    ],
    treatmentsEn: [
      "Minimize impact loads, incorporate supportive orthotic insoles",
      "Topical NSAID formulations (Voltaren, Chondroxide gel)",
      "Chondroprotective agents and targeted anti-inflammatories",
      "Low-impact physical therapy, therapeutic swimming",
      "Plain radiography or MRI evaluation with an orthopedic rheumatologist"
    ],
    doctorSpecialty: "Travmatolog-Ortoped / Revmatolog",
    doctorSpecialtyRu: "Врач травматолог-ортопед / Ревматолог",
    doctorSpecialtyEn: "Orthopedist / Rheumatologist",
    recommendedDoctorId: "doc-14",
    recommendedClinicIds: ["clinic-2", "clinic-1", "clinic-8"]
  },
  {
    id: "dis-18",
    name: "Qalqonsimon Bez Xastaliklari (Zob / Gipotireoz)",
    nameRu: "Заболевания щитовидной железы (Зоб / Гипотиреоз)",
    nameEn: "Thyroid Disorders (Goiter / Hypothyroidism)",
    category: "Endokrinologiya",
    keywords: [
      "zob", "qalqonsimon bez", "buqoq", "gipotireoz", "tireotoksikoz", "tomoq qisishi", "vazn ortishi",
      "soch tokilishi", "asabiylashish", "zobim bor", "щитовидка", "зоб", "щитовидная железа", "гипотиреоз",
      "тиреотоксикоз", "выпадение волос", "ком в горле", "эндокринолог", "thyroid", "goiter", "hypothyroidism", "hyperthyroidism", "hair loss", "endocrinologist"
    ],
    urgency: "O'rtacha",
    causes: [
      "Organizmda yod moddasining surunkali yetishmovchiligi (endemik zob)",
      "Autoimmun tireoidit (immunitet o'z qalqonsimon bezini zararlashi)",
      "Irsiy gormonal buzilishlar",
      "Kuchli ruhiy stress va ekologik noqulay omillar"
    ],
    causesRu: [
      "Хронический дефицит йода в воде и пище (эндемический зоб)",
      "Аутоиммунный тиреоидит (поражение клеток железы собственной иммунной системой)",
      "Генетическая предрасположенность к эндокринным патологиям",
      "Хронический стресс и неблагоприятная экологическая обстановка"
    ],
    causesEn: [
      "Nutritional iodine deficiency (endemic goiter)",
      "Autoimmune thyroiditis (Hashimoto's or Graves' disease)",
      "Genetic vulnerability to endocrine dysregulation",
      "Severe prolonged emotional distress and radiation exposure"
    ],
    symptoms: [
      "Bo'yin sohasida shish, bo'g'ilish yoki tomoqda 'tosh tiqilgandek' his",
      "Sababsiz tez semirib ketish yoki aksincha keskin ozib ketish",
      "Doimiy holsizlik, lanjlik, uyquchanlik va xotiraning pasayishi",
      "Soch to'kilishi, terining o'ta quruqlashishi va tirnoqlarning sinuvchanligi"
    ],
    symptomsRu: [
      "Ощущение кома в горле, визуальное утолщение или припухлость шеи",
      "Необоснованный набор веса или резкое похудение",
      "Хроническая вялость, сонливость, зябкость и апатия",
      "Выпадение волос, сухость кожи, ломкость ногтей"
    ],
    symptomsEn: [
      "Globus sensation in the neck, tightness, or visible anterior goiter",
      "Unexplained rapid weight gain or sudden weight loss",
      "Chronic lethargy, hypersomnolence, and cold intolerance",
      "Diffuse alopecia (hair shedding), dry epidermis, and brittle nails"
    ],
    treatments: [
      "Qondagi qalqonsimon bez gormonlari (TSH, erkin T3, erkin T4, AT-TPO) tahlilini topshirish",
      "Qalqonsimon bez UZI tekshiruvidan o'tish (tuzilish va tugunlarni aniqlash)",
      "Endokrinolog tomonidan yod preparatlari (Yodomarin) yoki gormonal terapiya (L-tiroksin) buyurilishi",
      "Ratsionda dengiz karami, dengiz baliqlari, yodlangan tuz va yong'oqlarni ko'paytirish",
      "Har 6 oyda endokrinolog nazoratidan o'tib turish"
    ],
    treatmentsRu: [
      "Анализ крови на гормоны щитовидной железы (ТТГ, Т3 свободный, Т4 свободный, АТ-ТПО)",
      "УЗИ щитовидной железы для выявления узлов и изменения структуры",
      "Медикаментозная терапия (препараты йода или левотироксин) по назначению эндокринолога",
      "Включение в рацион морской рыбы, морской капусты, йодированной соли",
      "Диспансерное наблюдение у эндокринолога каждые 6 месяцев"
    ],
    treatmentsEn: [
      "Serum thyroid panel blood tests (TSH, Free T3, Free T4, Anti-TPO)",
      "Thyroid ultrasound to detect nodular disease and parenchymal texture",
      "Endocrinologist-guided replacement therapy (Levothyroxine) or iodine supplementation",
      "Dietary intake of iodized salt, seaweed, and marine seafood",
      "Semiannual monitoring visits with an endocrinologist"
    ],
    doctorSpecialty: "Endokrinolog",
    doctorSpecialtyRu: "Врач-эндокринолог",
    doctorSpecialtyEn: "Endocrinologist",
    recommendedDoctorId: "doc-7",
    recommendedClinicIds: ["clinic-5", "clinic-1", "clinic-3"]
  },
  {
    id: "dis-19",
    name: "Sistit va Siydik Pufagi Shamollashi",
    nameRu: "Цистит и Воспаление мочевого пузыря",
    nameEn: "Cystitis and Bladder Infection",
    category: "Urologiya",
    keywords: [
      "sistit", "siydik", "peshob", "siyganda ogriq", "achishish", "tez-tez siyish", "qovuq", "qovuq ogriq",
      "chilla", "цистит", "мочевой пузырь", "рези при мочеиспускании", "частое мочеиспускание", "боль внизу живота",
      "моча", "уролог", "cystitis", "urinary infection", "dysuria", "bladder", "urination pain", "urologist"
    ],
    urgency: "O'rtacha",
    causes: [
      "Bakteriyalarning (ko'pincha ichak tayoqchasi - E. coli) siydik kanalidan qovuqqa kirishi",
      "Pastki qorin va oyoqlarning sovuq qotishi (sovuq toshda o'tirish, muzdek suv)",
      "Shaxsiy gigiyena qoidalarining buzilishi",
      "Siydikni uzoq vaqt ushlab turish va yetarli suyuqlik ichmaslik"
    ],
    causesRu: [
      "Проникновение бактерий (чаще всего E. coli) в полость мочевого пузыря",
      "Переохлаждение области малого таза и ног",
      "Нарушение правил интимной гигиены",
      "Редкое опорожнение мочевого пузыря, дефицит жидкости"
    ],
    causesEn: [
      "Bacterial colonization (primarily Escherichia coli) of the bladder lumen",
      "Localized hypothermia of the pelvic area or feet",
      "Inadequate personal hygiene habits",
      "Habitual urine retention and suboptimal fluid intake"
    ],
    symptoms: [
      "Siyish paytida va siyib bo'lgandan keyin o'tkir achishish, sanchiq va kesuvchi og'riq",
      "Har 10-15 daqiqada tez-tez va oz-ozdan siyish qistovi",
      "Qorinning pastki qismida simillovchi og'riq va noqulaylik",
      "Siydikning loyqalanishi, noxush hid va ba'zan qon tomchilari ko'rinishi (gematuriya)"
    ],
    symptomsRu: [
      "Острые рези, жжение и боль в конце мочеиспускания",
      "Нестерпимые частые позывы каждые 15-20 минут малыми порциями",
      "Тянущая боль и дискомфорт внизу живота над лобком",
      "Мутная моча, неприятный запах, возможно появление капель крови"
    ],
    symptomsEn: [
      "Sharp cutting or burning pain at the end of micturition",
      "Extreme urinary urgency and frequent small-volume voiding",
      "Suprapubic aching and pelvic heaviness",
      "Cloudy foul-smelling urine, occasional terminal hematuria"
    ],
    treatments: [
      "Ko'p miqdorda iliq suyuqlik ichish (kuniga 2.5 litrgacha: na'matak, brusnika morsisi)",
      "Qovuq sohasini issiq tutish (lekin yiring yoki qon bo'lsa qizdirmaslik)",
      "Urolog tavsiyasi bilan antibakterial vositalar (Fosfomitsin, Furadonin va boshqalar) kursi",
      "Achchiq, sho'r, dudlangan va spirtli ichimliklarni qat'iyan cheklash",
      "Umumiy siydik tahlili va siydik bakterial ekmasini topshirish"
    ],
    treatmentsRu: [
      "Обильное теплое питье (до 2.5 л/сутки: клюквенный и брусничный морсы)",
      "Сухое тепло на область низа живота (при отсутствии крови в моче)",
      "Прием антибактериальных и уросептических препаратов по рецепту уролога",
      "Исключение острых блюд, специй, кофе и алкоголя",
      "Сдача общего анализа мочи и бактериологического посева"
    ],
    treatmentsEn: [
      "Forced hydration up to 2.5 liters daily with unsweetened cranberry infusions",
      "Gentle warmth applied to lower abdomen (only if no macroscopic bleeding)",
      "Targeted antimicrobial regimen prescribed by an urologist",
      "Eliminate spices, citrus, alcohol, and carbonated beverages",
      "Submit urine routine microscopy and bacterial culture sensitivity"
    ],
    doctorSpecialty: "Urolog",
    doctorSpecialtyRu: "Врач-уролог",
    doctorSpecialtyEn: "Urologist",
    recommendedDoctorId: "doc-10",
    recommendedClinicIds: ["clinic-1", "clinic-3", "clinic-5"]
  },
  {
    id: "dis-20",
    name: "Prostatit va Erkaklar Salomatligi",
    nameRu: "Простатит и Мужское здоровье",
    nameEn: "Prostatitis and Men's Health",
    category: "Urologiya",
    keywords: [
      "prostatit", "prostata", "erkaklar", "siyish qiyinlashishi", "oraliq soha", "androlog", "urolog",
      "qovuq", "jinsiy zaiflik", "простатит", "простата", "затрудненное мочеиспускание", "мужские болезни",
      "уролог", "андролог", "боль в паху", "prostatitis", "prostate", "men's health", "andrologist", "groin pain"
    ],
    urgency: "O'rtacha",
    causes: [
      "Bakterial infeksiyalarning prostata beziga kirishi",
      "Kichik chanoq a'zolarida qon aylanishining dimlanishi (kamharakatlik, o'tirib ishlash)",
      "Sovuq qotish, shamollash va immunitet pasayishi",
      "Tartibsiz jinsiy hayot yoki surunkali asabiy zo'riqish"
    ],
    causesRu: [
      "Проникновение бактериальной инфекции в ткань предстательной железы",
      "Застойные явления в малом тазу из-за малоподвижного сидячего образа жизни",
      "Переохлаждение и хронические очаги инфекции в организме",
      "Нерегулярная половая жизнь, стрессы и переутомление"
    ],
    causesEn: [
      "Bacterial colonization of the prostatic glandular tissue",
      "Pelvic venous congestion due to sedentary and inactive lifestyle",
      "Local hypothermia and systemic immune decline",
      "Irregular sexual activity and chronic psycho-emotional stress"
    ],
    symptoms: [
      "Oraliq (chot) sohasida, to'g'ri ichak va qorin pastida simillovchi og'riq",
      "Siydik oqimining zaiflashishi, bo'linib-bo'linib siyish va siydik to'liq chiqmagandek his",
      "Kechasi bir necha bor siyishga turish (nikturiya)",
      "Potensiyaning pasayishi va tez charchash"
    ],
    symptomsRu: [
      "Тянущая или ноющая боль в промежности, крестце и внизу живота",
      "Ослабление струи мочи, чувство неполного опорожнения мочевого пузыря",
      "Частые ночные позывы к мочеиспусканию",
      "Снижение либидо, эректильный дискомфорт и быстрая утомляемость"
    ],
    symptomsEn: [
      "Perineal, pelvic, and sacral dull pain or discomfort",
      "Hesitancy, weak urinary stream, and incomplete emptying feeling",
      "Nocturia (waking up multiple times at night to urinate)",
      "Erectile dysfunction and general fatigue"
    ],
    treatments: [
      "Urolog-androlog ko'rigidan o'tib, prostata bezini UZI (TRUZI) tekshiruvi",
      "Shifokor tavsiyasi bilan antibakterial va yallig'lanishga qarshi terapiya",
      "Chanoq qon aylanishini yaxshilash uchun har kuni 40 daqiqa piyoda yurish",
      "Spirtli ichimlik, achchiq va sho'r taomlardan saqlanish",
      "Fizioterapiya va shifokor nazoratidagi muolajalar"
    ],
    treatmentsRu: [
      "Осмотр уролога-андролога и трансректальное УЗИ (ТРУЗИ) простаты",
      "Курс антибактериальной и противовоспалительной терапии",
      "Регулярная двигательная активность для устранения застоя крови",
      "Отказ от алкоголя, острой и консервированной пищи",
      "Курс физиотерапевтического лечения по рекомендации врача"
    ],
    treatmentsEn: [
      "Clinical evaluation by an urologist/andrologist including TRUS ultrasound",
      "Targeted antimicrobial and anti-inflammatory drug regimen",
      "Daily aerobic walking to relieve pelvic venous stasis",
      "Abstain from alcohol, excessive spices, and deep-fried dishes",
      "Physician-supervised pelvic physiotherapy"
    ],
    doctorSpecialty: "Urolog / Androlog",
    doctorSpecialtyRu: "Врач-уролог / Андролог",
    doctorSpecialtyEn: "Urologist / Andrologist",
    recommendedDoctorId: "doc-10",
    recommendedClinicIds: ["clinic-1", "clinic-3", "clinic-5"]
  },
  {
    id: "dis-21",
    name: "Temir Tanqisligi Anemiyasi (Kamqonlik)",
    nameRu: "Железодефицитная Анемия (Малокровие)",
    nameEn: "Iron Deficiency Anemia",
    category: "Gematologiya / Terapiya",
    keywords: [
      "anemiya", "kamqonlik", "gemoglobin", "gemoglabin", "qonim kam", "holsizlik", "rang oqarishi",
      "bosh aylanishi", "temir", "quvvatsizlik", "анемия", "малокровие", "гемоглобин", "низкий гемоглобин",
      "слабость", "бледность", "железо", "головокружение", "гематолог", "anemia", "iron deficiency", "hemoglobin", "low iron", "fatigue", "hematologist"
    ],
    urgency: "O'rtacha",
    causes: [
      "Ratsionda temir moddasi va hayvon oqsillarining surunkali yetishmasligi",
      "Surunkali qon yo'qotishlar (kuchli hayz ko'rish, oshqozon-ichak yaralari, bavosil)",
      "Ichaklarda temir va vitaminlar (B12, foliy kislotasi) so'rilishining buzilishi",
      "Homiladorlik va emizish davrida temirga bo'lgan ehtiyojning oshishi"
    ],
    causesRu: [
      "Недостаток железа и полноценного белка в пищевом рационе",
      "Хронические скрытые кровопотери (обильные менструации, язвы ЖКТ, геморрой)",
      "Нарушение всасывания железа в кишечнике (гастрит, целиакия)",
      "Повышенная потребность в железе при беременности и лактации"
    ],
    causesEn: [
      "Dietary shortfall of bioavailable heme iron and essential proteins",
      "Chronic occult blood loss (heavy menses, peptic ulcers, hemorrhoids)",
      "Malabsorption of micronutrients in the gastrointestinal tract",
      "Increased physiological iron demands during pregnancy and lactation"
    ],
    symptoms: [
      "Doimiy darmonsizlik, surunkali charchoq va ozgina harakatda ham havo yetishmasligi",
      "Bosh aylanishi, ko'z oldi qorong'ilashishi va quloqda shovqin",
      "Teri va lablarning oqarib ketishi, ko'z osti qorayishi",
      "Soch to'kilishi, tirnoqlarning mo'rtlashib sinishi va g'alati narsalarni (bo'r, muz) yegisi kelishi"
    ],
    symptomsRu: [
      "Постоянная слабость, быстрая утомляемость, одышка при легкой нагрузке",
      "Головокружение, потемнение в глазах, шум в ушах",
      "Бледность кожи и слизистых оболочек, синяки под глазами",
      "Ломкость ногтей, выпадение волос, извращение вкуса (желание есть мел, лед)"
    ],
    symptomsEn: [
      "Persistent asthenia, unremitting fatigue, exertional shortness of breath",
      "Lightheadedness, transient visual blackout, and pulsatile tinnitus",
      "Pallor of cutis and conjunctival membranes",
      "Brittle spoon-shaped nails (koilonychia), diffuse hair loss, and pica"
    ],
    treatments: [
      "Umumiy qon tahlili (gemoglobin) va qon zardobidagi ferritin miqdorini aniqlash",
      "Terapevt yoki gematolog tomonidan buyurilgan temir preparatlari kursini kamida 2-3 oy uzluksiz qabul qilish",
      "Ratsionda qizil go'sht (mol go'shti, jigar), grechka, anor va tuxumni ko'paytirish",
      "Temir dori vositalarini choy va kofe bilan ichmaslik (ular temir so'rilishini to'sadi)",
      "Ichki qon yo'qotish sababini aniqlash va bartaraf etish"
    ],
    treatmentsRu: [
      "Общий анализ крови (уровень гемоглобина, эритроцитов) и анализ на ферритин",
      "Курсовой прием препаратов железа в течение 2-3 месяцев под контролем врача",
      "Диета с высоким содержанием говядины, печени, гречки, гранатов и яиц",
      "Не запивать препараты железа чаем или молоком (ухудшают всасывание)",
      "Поиск и устранение источника скрытой кровопотери"
    ],
    treatmentsEn: [
      "Complete blood count (CBC: Hemoglobin, MCV) and serum ferritin testing",
      "Prescription oral or intravenous iron supplementation for 2-3 months",
      "Nutritional elevation of red lean beef, liver, buckwheat, and eggs",
      "Avoid co-ingesting iron supplements with tea, coffee, or calcium",
      "Investigate and rectify any hidden chronic bleeding source"
    ],
    doctorSpecialty: "Gematolog / Terapevt",
    doctorSpecialtyRu: "Врач-гематолог / Терапевт",
    doctorSpecialtyEn: "Hematologist / Internist",
    recommendedDoctorId: "doc-3",
    recommendedClinicIds: ["clinic-1", "clinic-4", "clinic-6"]
  },
  {
    id: "dis-22",
    name: "O'tkir Zaharlanish va Oshqozon-Ichak Infeksiyasi (Ich Ketishi)",
    nameRu: "Острое отравление и Кишечная инфекция (Диарея)",
    nameEn: "Acute Food Poisoning and Gastroenteritis (Diarrhea)",
    category: "Gastroenterologiya",
    keywords: [
      "zaharlanish", "ich ketishi", "diareya", "qusish", "ichim ketyapti", "kongil aynishi", "oshqozon buzilishi",
      "ovqatdan zaharlanish", "ichim suryapti", "ich ketish", "отравление", "диарея", "понос", "рвота", "тошнота",
      "кишечная инфекция", "несварение", "инфекционист", "food poisoning", "diarrhea", "vomiting", "nausea", "gastroenteritis"
    ],
    urgency: "Yuqori / Suvsizlanish xavfi",
    causes: [
      "Muddati o'tgan, sifatsiz yoki zararlangan oziq-ovqatlarni (go'sht, tort, salat, baliq) iste'mol qilish",
      "Ichak tayoqchasi, salmonella yoki rotavirus bilan zararlanish",
      "Shaxsiy gigiyenaga rioya qilmaslik (yuvilmagan qo'llar va mevalar)",
      "Zaharli kimyoviy moddalar yoki tozalanmagan suv ichish"
    ],
    causesRu: [
      "Употребление некачественных или просроченных продуктов",
      "Заражение бактериями (сальмонелла, кишечная палочка) или ротавирусом",
      "Немытые руки, немытые овощи и фрукты",
      "Употребление некипяченой загрязненной воды"
    ],
    causesEn: [
      "Ingestion of spoiled, contaminated, or improperly stored foodstuffs",
      "Bacterial (Salmonella, E. coli) or viral (Rotavirus) enteritis",
      "Contaminated hands and unwashed fresh produce",
      "Consumption of untreated drinking water"
    ],
    symptoms: [
      "Qorinda o'tkir burab og'rish va sanchiqlar",
      "Tez-tez suvdek ich ketishi (diareya) va qayta-qayta qusish",
      "Tana haroratining 38°C - 39°C gacha ko'tarilishi, titroq va darmonsizlik",
      "Organizmning suvsizlanishi: quruq lablar, kuchli chanqoq, bosh aylanishi"
    ],
    symptomsRu: [
      "Схваткообразные режущие боли в животе",
      "Многократный водянистый жидкий стул и частая рвота",
      "Повышение температуры, озноб и резкая общая слабость",
      "Признаки обезвоживания: сильная жажда, сухость губ, темные круги под глазами"
    ],
    symptomsEn: [
      "Severe cramping and colicky abdominal spasms",
      "Profuse watery stools and repeated episodes of vomiting",
      "Fever up to 39°C, rigors, and rapid prostration",
      "Signs of dehydration: parched oral mucosa, acute thirst, sunken eyes"
    ],
    treatments: [
      "Degidratsiyaning (suvsizlanish) oldini olish uchun Regidron eritmasini har 5-10 daqiqada ho'plab ichish",
      "Toksinlarni bog'lab chiqarish uchun sorbentlar (Aktivlashtirilgan ko'mir, Smekta, Polisorb) qabul qilish",
      "Qat'iy ochlik yoki parhez (guruch qaynatmasi, qotirilgan non, ko'k choy)",
      "Harorat oshsa yoki ich ketishi 1 kundan ortiq to'xtamasa, darhol shifokor yoki 103 ga murojaat qilish",
      "O'zboshimchalik bilan kuchli ich to'xtatuvchi dorilarni ichmaslik (toksinlar organizmda qolib ketmasligi uchun)"
    ],
    treatmentsRu: [
      "Выпаивание регидратационными растворами (Регидрон) маленькими глотками каждые 5-10 минут",
      "Прием энтеросорбентов (Смекта, Полисорб, активированный уголь)",
      "Щадящий рацион: рисовый отвар, сухари, несладкий чай",
      "При непрекращающейся рвоте или высокой температуре — немедленно вызвать 103",
      "Не принимать препараты, останавливающие диарею (лоперамид), без назначения врача"
    ],
    treatmentsEn: [
      "Oral rehydration salts (e.g., Rehydron) administered in frequent sips",
      "Administration of gastrointestinal adsorbents (Smecta, activated charcoal)",
      "Bland transitional diet: boiled white rice broth, dry toasts, mild teas",
      "If vomiting or severe diarrhea persists, summon emergency care (103)",
      "Avoid antimotility drugs (like loperamide) that trap bacterial toxins"
    ],
    doctorSpecialty: "Gastroenterolog / Infeksionist",
    doctorSpecialtyRu: "Врач-гастроэнтеролог / Инфекционист",
    doctorSpecialtyEn: "Gastroenterologist / Infectious Disease Specialist",
    recommendedDoctorId: "doc-8",
    recommendedClinicIds: ["clinic-2", "clinic-5", "clinic-3"]
  },
  {
    id: "dis-23",
    name: "Gemorroy va To'g'ri Ichak Kasalliklari (Bavosil)",
    nameRu: "Геморрой и Заболевания прямой кишки",
    nameEn: "Hemorrhoids and Proctological Conditions",
    category: "Proktologiya / Xirurgiya",
    keywords: [
      "gemorroy", "bavosil", "bavosir", "ich qotishi", "qon ketishi", "tugun", "togri ichak", "o'tirish qiyin",
      "gemaroy", "геморрой", "трещина прямой кишки", "боль при дефекации", "кровь в кале", "проктолог",
      "hemorrhoids", "piles", "rectal bleeding", "anal fissure", "proctologist"
    ],
    urgency: "O'rtacha",
    causes: [
      "Surunkali ich qotishi (qabziyat) va hojat paytida kuchanish",
      "Kamharakat hayot tarzi, uzoq vaqt noqulay o'tirib ishlash",
      "Og'ir jismoniy mehnat, og'ir yuklarni ko'tarish",
      "Homiladorlik va tug'ruq paytida kichik chanoq tomirlariga tushadigan bosim"
    ],
    causesRu: [
      "Хронические запоры и постоянное натуживание",
      "Сидячий малоподвижный образ жизни (водители, офисные работники)",
      "Подъем тяжестей и тяжелый физический труд",
      "Беременность и роды, повышающие давление в венах малого таза"
    ],
    causesEn: [
      "Chronic constipation and repetitive strenuous defecation straining",
      "Sedentary desk professions or prolonged continuous driving",
      "Strenuous physical weight-lifting activities",
      "Increased intra-abdominal pressure during gestation and delivery"
    ],
    symptoms: [
      "Hojat paytida yoki undan keyin qon tomchilari ko'rinishi",
      "Orqa chiqaruv teshigi sohasida qichishish, achishish va noqulaylik",
      "O'tirganda va yurganda kuchayuvchi og'riq",
      "Gemorroidal tugunlarning tashqariga chiqib qolishi yoki shishishi"
    ],
    symptomsRu: [
      "Выделение алой крови во время или после дефекации",
      "Зуд, жжение и дискомфорт в анальной области",
      "Боль при сидении и ходьбе",
      "Выпадение или болезненность геморроидальных узлов"
    ],
    symptomsEn: [
      "Bright red blood visible on toilet paper or stool surface",
      "Anal pruritus, burning sensation, and localized soreness",
      "Ache exacerbated by prolonged seated postures or ambulation",
      "External prolapse or painful thrombosis of hemorrhoidal cushions"
    ],
    treatments: [
      "Ich qotishining oldini olish uchun tolaga boy parhez (olxo'ri, lavlagi, qovoq, kasha)",
      "Kuniga kamida 2 litr toza suv ichish",
      "Shifokor buyurgan maxsus shamchalar (Relif, Anuzol) va venotonik preparatlar",
      "Hojatdan keyin qog'oz o'rniga iliq suv bilan yuvinish",
      "Proktolog yoki jarroh ko'rigidan o'tib, davolash rejasini belgilash"
    ],
    treatmentsRu: [
      "Профилактика запоров: диета с клетчаткой (свекла, чернослив, отруби)",
      "Обильный питьевой режим (не менее 1.5-2 л воды)",
      "Ректальные свечи и мази с противовоспалительным действием (Релиф)",
      "Соблюдение гигиены: подмывание прохладной водой вместо туалетной бумаги",
      "Консультация врача-проктолога или хирурга"
    ],
    treatmentsEn: [
      "High-fiber dietary strategy (prunes, beetroot, bran, whole grains)",
      "Adequate water hydration of at least 2 liters per day",
      "Topical rectal suppositories and venotonic agents prescribed by a doctor",
      "Meticulous anal toilet with water rather than abrasive dry papers",
      "Comprehensive examination by a colorectal surgeon / proctologist"
    ],
    doctorSpecialty: "Proktolog / Xirurg",
    doctorSpecialtyRu: "Врач-проктолог / Хирург",
    doctorSpecialtyEn: "Proctologist / Colorectal Surgeon",
    recommendedDoctorId: "doc-5",
    recommendedClinicIds: ["clinic-2", "clinic-1", "clinic-6"]
  },
  {
    id: "dis-24",
    name: "Yurak Aritmiyasi va Taxikardiya",
    nameRu: "Аритмия сердца и Тахикардия",
    nameEn: "Cardiac Arrhythmia and Tachycardia",
    category: "Kardiologiya",
    keywords: [
      "aritmiya", "taxikardiya", "yurak urishi", "yuragim tez uryapti", "yurak notekis", "yuragim toxtab qolgandek",
      "puls", "yurak sakrayapti", "yurak duk-duk", "аритмия", "тахикардия", "учащенное сердцебиение", "перебои в сердце",
      "пульс", "замирание сердца", "кардиолог", "arrhythmia", "tachycardia", "palpitations", "irregular heartbeat", "pulse", "cardiologist"
    ],
    urgency: "Yuqori",
    causes: [
      "Yurak o'tkazuvchanlik tizimining buzilishi va yurak ishemik kasalligi",
      "Kuchli asabiy stress, hayajon va vahima xurujlari",
      "Qalqonsimon bez gormonlarining ortishi (tireotoksikoz)",
      "Qonda kaliy va magniy mikroelementlari yetishmovchiligi",
      "Kofe, energetik ichimliklar va spirtli ichimliklarni ortiqcha iste'mol qilish"
    ],
    causesRu: [
      "Нарушение проводящей системы сердца, ишемическая болезнь",
      "Эмоциональный стресс, панические атаки и переутомление",
      "Гиперфункция щитовидной железы (тиреотоксикоз)",
      "Электролитный дисбаланс (дефицит калия и магния)",
      "Злоупотребление кофеином, энергетиками и алкоголем"
    ],
    causesEn: [
      "Dysfunction of the cardiac electrical conduction network or ischemia",
      "Severe acute emotional distress, panic attack, or adrenaline surge",
      "Thyroid hyperfunction (thyrotoxicosis / hyperthyroidism)",
      "Electrolyte disturbances (hypokalemia, hypomagnesemia)",
      "Excessive ingestion of caffeinated beverages, stimulants, or alcohol"
    ],
    symptoms: [
      "Yurakning qovurg'alarni yorib chiqqudek tez urishi (daqiqasiga 100 tadan ko'p)",
      "Yurak urishining bir lahzaga to'xtab qolgandek yoki notekis sakrab urishi hissi",
      "Bosh aylanishi, ko'z oldi xiralashishi va hushdan ketish xavfi",
      "Havo yetishmasligi va ko'krak qafasida noqulay siqilish"
    ],
    symptomsRu: [
      "Ощущение бешеного колотящегося сердцебиения (пульс свыше 100 уд/мин)",
      "Ощущение «замирания», перебоев и неритмичных толчков сердца",
      "Головокружение, потемнение в глазах, предобморочное состояние",
      "Чувство нехватки воздуха, одышка и тревога"
    ],
    symptomsEn: [
      "Rapid pounding palpitations (heart rate exceeding 100 beats/min)",
      "Sensation of skipped beats, fluttering, or sudden cardiac pauses",
      "Lightheadedness, dizziness, presyncope, or transient weakness",
      "Air hunger, shortness of breath, and chest discomfort"
    ],
    treatments: [
      "Bemorga tinch yotish yoki o'tirish holatini berish, toza havo oqimini ta'minlash",
      "Vagus mashqlarini bajarish: chuqur nafas olib nafasni 10-15 soniya ushlab turish (Val'salva usuli)",
      "Yuzni muzdek suv bilan yuvish (reflektor sekinlashtirish)",
      "Puls va arterial qon bosimini o'lchash",
      "Darhol kardiolog qabuliga yozilib, EKG va 24 soatlik Xolter monitor tekshiruvidan o'tish"
    ],
    treatmentsRu: [
      "Успокоиться, занять полусидячее положение, обеспечить свежий воздух",
      "Выполнить вагусную пробу (глубокий вдох и натуживание на 10-15 секунд)",
      "Умыть лицо холодной водой для рефлекторного урежения пульса",
      "Измерить пульс и артериальное давление",
      "Сделать электрокардиограмму (ЭКГ) и пройти суточное холтеровское мониторирование"
    ],
    treatmentsEn: [
      "Sit upright in a serene environment; ensure access to fresh air",
      "Vagal maneuvers: perform a deep breath and gentle Valsalva strain for 10-15s",
      "Cold facial immersion or cold water splash (mammalian dive reflex)",
      "Record pulse frequency and automated blood pressure reading",
      "Expedite an ECG recording and 24-hour ambulatory Holter monitoring"
    ],
    doctorSpecialty: "Kardiolog / Aritmolog",
    doctorSpecialtyRu: "Врач-кардиолог / Аритмолог",
    doctorSpecialtyEn: "Cardiologist / Arrhythmologist",
    recommendedDoctorId: "doc-1",
    recommendedClinicIds: ["clinic-4", "clinic-1", "clinic-2"]
  },
  {
    id: "dis-25",
    name: "O'tkir Appenditsit (So'qir Ichak Yallig'lanishi)",
    nameRu: "Острый Аппендицит",
    nameEn: "Acute Appendicitis",
    category: "Xirurgiya",
    keywords: [
      "appenditsit", "soqir ichak", "korichak", "ko'richak", "ong qorin", "qorin ogriq", "kindik atrofida ogriq",
      "qornim o'tkir ogriyapti", "аппендицит", "боль в правом боку", "острый живот", "хирург", "appendicitis", "right lower quadrant", "appendix"
    ],
    urgency: "Favqulodda Shoshilinch! (103)",
    causes: [
      "Chuvalchangsimon o'simta (appendiks) bo'shlig'ining toshlar, axlat yoki limfoid to'qima bilan tiqilib qolishi",
      "O'tkir bakterial yallig'lanish va qon aylanishining buzilishi",
      "Qorin ichki bosimining ortishi"
    ],
    causesRu: [
      "Обструкция просвета аппендикса каловыми камнями или лимфоидной тканью",
      "Острое бактериальное воспаление и отек отростка",
      "Нарушение кровоснабжения стенки аппендикса с риском перфорации"
    ],
    causesEn: [
      "Appendiceal lumen obstruction by fecaliths or lymphoid hyperplasia",
      "Acute bacterial infection leading to transmural inflammation",
      "Ischemic compromise of the appendiceal wall risking rupture"
    ],
    symptoms: [
      "Dastlab kindik atrofida boshlanib, bir necha soatda o'ng yonbosh sohasiga ko'chuvchi o'tkir og'riq",
      "Yo'talganda, yurganda yoki o'ng tomonga yotganda og'riqning keskin kuchayishi",
      "Ko'ngil aynishi, 1-2 marta qusish va ishtahaning yo'qolishi",
      "Tana haroratining 37.5°C - 38.5°C gacha ko'tarilishi"
    ],
    symptomsRu: [
      "Боль, начинающаяся около пупка и смещающаяся в правую подвздошную область",
      "Усиление боли при кашле, ходьбе или попытке лечь на правый бок",
      "Тошнота, однократная или двукратная рвота, отсутствие аппетита",
      "Субфебрильная температура (37.5-38.5°C)"
    ],
    symptomsEn: [
      "Pain starting peri-umbilically and migrating to the right lower quadrant",
      "Sharp exacerbation when coughing, walking, or lying on the right side",
      "Anorexia, nausea, and low-grade vomiting",
      "Low-grade fever (37.5°C - 38.5°C) and localized peritoneal tenderness"
    ],
    treatments: [
      "ZUDLIK BILAN 103 (Tez yordam) chaqirish yoki shoshilinch xirurgiyaga borish!",
      "Hech qachon qoringa issiq grelka qo'ymaslik (peritonitga olib keladi!)",
      "Og'riq qoldiruvchi dorilarni ichmaslik (tashxis qo'yishni qiyinlashtiradi)",
      "Bemorga ovqat va suv bermaslik (operatsiyaga tayyorgarlik uchun)",
      "Zudlik bilan jarrohlik ko'rigi, qon tahlili va UZI"
    ],
    treatmentsRu: [
      "НЕМЕДЛЕННО вызвать скорую помощь (103) или обратиться в приемный покой хирургии!",
      "Категорически запрещено прикладывать грелку к животу (риск перитонита!)",
      "Не принимать обезболивающие таблетки до осмотра врача (смазывает картину)",
      "Не кормить и не поить пациента перед экстренной операцией",
      "Осмотр хирурга, общий анализ крови (лейкоцитоз) и УЗИ брюшной полости"
    ],
    treatmentsEn: [
      "Call emergency services (103) IMMEDIATELY or rush to surgical triage!",
      "NEVER apply hot compresses or heating pads to the abdomen",
      "Do NOT administer analgesics beforehand as they mask clinical signs",
      "Keep patient strictly NPO (nil per os: no food or water) for surgery",
      "Emergency surgical evaluation, CBC, and diagnostic ultrasound"
    ],
    doctorSpecialty: "Shoshilinch Jarroh (Xirurg)",
    doctorSpecialtyRu: "Врач-хирург (Экстренная хирургия)",
    doctorSpecialtyEn: "Emergency Surgeon",
    recommendedDoctorId: "doc-5",
    recommendedClinicIds: ["clinic-2", "clinic-1", "clinic-6"]
  },
  {
    id: "dis-26",
    name: "Miokard Infarkti va O'tkir Koronar Sindrom",
    nameRu: "Инфаркт Миокарда и Острый коронарный синдром",
    nameEn: "Myocardial Infarction and Heart Attack",
    category: "Kardiologiya",
    keywords: [
      "infarkt", "miokard", "yurak xuruji", "kokrak qisishi", "chap qol uvishishi", "yuragim ezilyapti",
      "olim qorquvi", "yurak sanchishi", "инфаркт", "инфаркт миокарда", "боль за грудиной", "сжимает сердце",
      "отдает в левую руку", "одышка", "скорая", "heart attack", "myocardial infarction", "chest pressure", "radiating pain"
    ],
    urgency: "Favqulodda Shoshilinch! (103)",
    causes: [
      "Yurak toj tomirining aterosklerotik tromb bilan to'satdan to'liq berkilib qolishi",
      "Miokardning ma'lum qismiga qon yetib bormasligi va hujayralarning nobud bo'lishi",
      "Nazoratsiz yuqori arterial qon bosimi va qon quyulishi",
      "Kuchli asabiy zarba yoki haddan tashqari og'ir jismoniy zo'riqish"
    ],
    causesRu: [
      "Внезапная закупорка коронарной артерии тромбом на атеросклеротической бляшке",
      "Острое прекращение кровоснабжения участка сердечной мышцы",
      "Неконтролируемая артериальная гипертензия и повышенная вязкость крови",
      "Тяжелейший психоэмоциональный стресс или экстремальная физическая нагрузка"
    ],
    causesEn: [
      "Sudden thrombotic occlusion of a coronary artery at an atherosclerotic plaque",
      "Acute regional myocardial ischemia and tissue necrosis",
      "Uncontrolled malignant hypertension and blood hypercoagulability",
      "Catastrophic psycho-emotional shock or extreme physical exertion"
    ],
    symptoms: [
      "To'sh suyagi orqasida o'ta kuchli, ezuvchi, kuydiruvchi yoki siquvchi og'riq",
      "Og'riqning chap yelka, chap qo'l, bo'yin, pastki jag' va kurak ostiga tarqalishi",
      "Nitroglitserin qabul qilinganda ham og'riqning 15-20 daqiqadan ortiq bosilmasligi",
      "Kuchli havo yetishmasligi, sovuq yopishqoq ter bosishi va o'lim qo'rquvi hissi"
    ],
    symptomsRu: [
      "Нестерпимая сжимающая, жгучая или давящая боль за грудиной",
      "Иррадиация в левое плечо, левую руку, шею, нижнюю челюсть или под лопатку",
      "Боль не проходит после приема нитроглицерина и длится более 15-20 минут",
      "Выраженная одышка, липкий холодный пот, непреодолимый страх смерти"
    ],
    symptomsEn: [
      "Severe crushing, substernal tightness, burning or heavy chest ache",
      "Radiation to the left arm, shoulder, jaw, neck, or interscapular region",
      "Unresponsive to sublingual nitroglycerin lasting beyond 15-20 minutes",
      "Profound diaphoresis (cold sweats), severe dyspnea, and impending doom"
    ],
    treatments: [
      "DARHOL 103 (Tez yordam) CHAQIRISH! 'Infarkt xavfi' deb aniq bildirish kerak!",
      "Bemorga darhol yarim o'tirgan xotirjam holat berish, harakatlanishni qat'iy taqiqlash",
      "Tor yoqa va kiyimlarni yechib, xonaga ko'p toza havo kiritish",
      "Agar qarshi ko'rsatma bo'lmasa, 1 tabletka Aspirinni (150-300 mg) chaynab yutish (tromb erishi uchun)",
      "Respublika Kardiologiya yoki eng yaqin shoshilinch koronar markaziga yetkazish"
    ],
    treatmentsRu: [
      "НЕМЕДЛЕННО вызвать бригаду скорой помощи (103)! Сообщить: подозрение на инфаркт!",
      "Усадить пациента в полусидячее положение, обеспечить абсолютный физический покой",
      "Расстегнуть сдавливающую одежду, открыть окно для притока кислорода",
      "Разжевать 1 таблетку аспирина (150-300 мг) при отсутствии противопоказаний",
      "Срочная госпитализация в кардиореанимацию для проведения коронарографии"
    ],
    treatmentsEn: [
      "DIAL 103 IMMEDIATELY! State clearly: suspected acute myocardial infarction!",
      "Position patient in a semi-recumbent posture; enforce strict bed rest",
      "Loosen all restrictive apparel, ensure high ambient oxygen airflow",
      "Chew one uncoated Aspirin tablet (150-300 mg) unless contraindicated",
      "Emergency transfer to an interventional cardiac catheterization center"
    ],
    doctorSpecialty: "Shoshilinch Kardiolog",
    doctorSpecialtyRu: "Врач-кардиореаниматолог / Кардиолог",
    doctorSpecialtyEn: "Emergency Cardiologist",
    recommendedDoctorId: "doc-1",
    recommendedClinicIds: ["clinic-4", "clinic-2", "clinic-1"]
  },
  {
    id: "dis-27",
    name: "Bosh Miya Qon Aylanishi Buzilishi (Insult Xavfi)",
    nameRu: "Нарушение мозгового кровообращения (Инсульт)",
    nameEn: "Cerebrovascular Accident and Stroke",
    category: "Nevrologiya",
    keywords: [
      "insult", "falaj", "nutq buzilishi", "ogiz qiyshayishi", "qol ishlamayapti", "oyoq uvishyapti",
      "bosh miyaga qon quyilishi", "инсульт", "паралич", "перекосило лицо", "онемела рука", "невнятная речь",
      "микроинсульт", "невролог", "stroke", "cva", "facial droop", "slurred speech", "paralysis", "neurologist"
    ],
    urgency: "Favqulodda Shoshilinch! (103)",
    causes: [
      "Miya qon-tomirining tromb bilan tiqilib qolishi (ishemik insult - 80% holatlarda)",
      "Miya qon-tomirining yuqori qon bosimi tufayli yorilib ketishi (gemorragik insult)",
      "Nazoratsiz arterial gipertoniya, ateroskleroz va yurak aritmiyalari (hilpillovchi aritmiya)",
      "Qandli diabet, semizlik va qon quyulishi"
    ],
    causesRu: [
      "Закупорка мозговой артерии тромбом (ишемический инсульт)",
      "Разрыв сосуда головного мозга на фоне гипертонического криза (геморрагический)",
      "Нелеченная гипертония, мерцательная аритмия и атеросклероз сонных артерий",
      "Сахарный диабет и повышенная вязкость крови"
    ],
    causesEn: [
      "Thromboembolic occlusion of a cerebral arterial branch (ischemic stroke)",
      "Rupture of an intracerebral vessel due to hypertensive crisis (hemorrhagic stroke)",
      "Uncontrolled chronic hypertension, carotid atherosclerosis, atrial fibrillation",
      "Diabetes and systemic hypercoagulability states"
    ],
    symptoms: [
      "FAST qoidasi: Yuzning bir tomoni qiyshayishi, tabassum qila olmaslik",
      "Qo'l yoki oyoqda to'satdan kuchsizlik, bir tomonlama falajlik yoki ko'tara olmaslik",
      "Nutqning tushunarsiz, g'o'ldirab qolishi, boshqalar gapini tushunmaslik",
      "To'satdan kuchli bosh og'rig'i, bosh aylanishi va muvozanatni yo'qotish"
    ],
    symptomsRu: [
      "Правило УДАР: Асимметрия лица, опущенный угол рта при попытке улыбнуться",
      "Внезапная слабость или паралич в одной руке/ноге (не может поднять обе руки)",
      "Нарушение речи: невнятное произношение, затрудненное понимание слов",
      "Резкая невыносимая головная боль, потеря равновесия"
    ],
    symptomsEn: [
      "FAST test: Unilateral facial droop, inability to smile evenly",
      "Sudden unilateral arm or leg weakness/numbness, drift when raising arms",
      "Slurred, confused speech or receptive aphasia",
      "Explosive thunderclap headache, vertigo, and loss of postural coordination"
    ],
    treatments: [
      "ZUDLIK BILAN 103 (Tez yordam) CHAQIRISH! 'Insult belgilari' deb ma'lum qiling!",
      "Ilk 4.5 soat — 'oltin davr' bo'lib, miya to'qimasini to'liq saqlab qolish mumkin!",
      "Bemorni boshini 30 gradus ko'tarib gorizontal yotqizish, qayt qilsa yonboshga burish",
      "Bemorga hech qanday dori, suv yoki ovqat bermaslik!",
      "Shoshilinch Respublika Neyroxirurgiya yoki ko'p tarmoqli insult markaziga yetkazish"
    ],
    treatmentsRu: [
      "СРОЧНО вызвать скорую помощь (103)! Сообщить диспетчеру: подозрение на инсульт!",
      "Терапевтическое окно («золотые часы») — первые 4.5 часа для тромболизиса!",
      "Уложить больного, приподнять голову на 30 градусов, повернуть голову набок при рвоте",
      "Не давать никаких таблеток и воды до приезда врачей!",
      "Экстренная госпитализация в специализированное инсультное отделение"
    ],
    treatmentsEn: [
      "CALL 103 IMMEDIATELY! State clearly: acute stroke symptoms!",
      "The 4.5-hour 'golden window' allows intravenous thrombolysis to salvage tissue",
      "Elevate head 30 degrees; turn laterally if emesis occurs",
      "Do NOT administer any oral medications, liquids, or nourishment",
      "Rush to an advanced comprehensive stroke neurology center"
    ],
    doctorSpecialty: "Nevrolog / Neyroxirurg",
    doctorSpecialtyRu: "Врач-невролог / Нейрохирург",
    doctorSpecialtyEn: "Neurologist / Neurosurgeon",
    recommendedDoctorId: "doc-2",
    recommendedClinicIds: ["clinic-2", "clinic-1", "clinic-3"]
  },
  {
    id: "dis-28",
    name: "Surunkali Qabziyat va Ich Qotishi",
    nameRu: "Хронический Запор и Нарушение моторики",
    nameEn: "Chronic Constipation and Bowel Dysfunction",
    category: "Gastroenterologiya",
    keywords: [
      "qabziyat", "ich qotishi", "ich qotgan", "hojatga chiqolmayapman", "ichak", "ichaklar", "hazm",
      "qorinda ogirlik", "запор", "кишечник", "тяжесть в животе", "задержка стула", "гастроэнтеролог",
      "constipation", "bowel movement", "irregular bowel", "bloating", "gastroenterologist"
    ],
    urgency: "Pastdan O'rtachagacha",
    causes: [
      "Oziq-ovqatda o'simlik tolasi (kletchatka) va sabzavotlar yetishmasligi",
      "Kun davomida yetarli miqdorda toza suv ichmaslik (kuniga 1 litrdan kam)",
      "Kamharakat turmush tarzi, uzoq vaqt o'tirish",
      "Ichak motorikasining pasayishi va stress"
    ],
    causesRu: [
      "Недостаток растительной клетчатки и грубых волокон в рационе",
      "Хронический дефицит питьевой воды",
      "Малоподвижный образ жизни и сидячая работа",
      "Нарушение перистальтики кишечника, дисбактериоз и стресс"
    ],
    causesEn: [
      "Dietary fiber and whole vegetable deficit",
      "Inadequate daily fluid and water intake",
      "Physical inactivity and prolonged sitting",
      "Colonic motility slowing, dysbiosis, and autonomic stress"
    ],
    symptoms: [
      "Haftada 3 martadan kam hojatga chiqish",
      "Qattiq, quruq axlat va kuchanish bilan kechuvchi noqulay defekatsiya",
      "Qorinda og'irlik, to'lib ketish hissi va dam bo'lish (meteorizm)",
      "Bosh og'rig'i, ishtahaning pasayishi va terining xiralashishi"
    ],
    symptomsRu: [
      "Опорожнение кишечника реже 3 раз в неделю",
      "Сухой, твердый стул и сильное натуживание",
      "Ощущение тяжести, распирания в животе и вздутие",
      "Снижение аппетита, быстрая утомляемость"
    ],
    symptomsEn: [
      "Infrequent bowel movements (fewer than 3 times per week)",
      "Hard, dry stools requiring painful excessive straining",
      "Abdominal distension, persistent fullness, and flatulence",
      "Loss of appetite, malaise, and mild headache"
    ],
    treatments: [
      "Har kuni 1.5 - 2 litr toza iliq suv ichishni odat qilish",
      "Ratsionda lavlagi, sabzi, olxo'ri, quritilgan mevalar, kepakli non va kashalarni ko'paytirish",
      "Ertalab och qoringa 1 stakan iliq suv yoki 1 osh qoshiq zaytun moyi ichish",
      "Har kuni kamida 30-40 daqiqa piyoda yurish",
      "Gastroenterolog maslahati bilan yumshoq laksatiflar (Dyufalak, Laktuloza) qabul qilish"
    ],
    treatmentsRu: [
      "Увеличение потребления чистой воды до 1.5-2 л в сутки",
      "Включение в меню свеклы, чернослива, отрубей, каш и свежих овощей",
      "Стакан теплой воды натощак по утрам",
      "Ежедневные пешие прогулки от 30 минут",
      "Прием осмотических слабительных (лактулоза, Дюфалак) по рекомендации врача"
    ],
    treatmentsEn: [
      "Systematic hydration with 1.5-2.0 liters of pure water daily",
      "Diet rich in soluble fiber: beets, prunes, bran cereals, fresh greens",
      "A glass of warm water on an empty stomach every morning",
      "Regular daily walking routines of at least 30-40 minutes",
      "Gentle osmotic laxatives (Lactulose) under gastroenterologist guidance"
    ],
    doctorSpecialty: "Gastroenterolog",
    doctorSpecialtyRu: "Врач-гастроэнтеролог",
    doctorSpecialtyEn: "Gastroenterologist",
    recommendedDoctorId: "doc-8",
    recommendedClinicIds: ["clinic-5", "clinic-1", "clinic-3"]
  },
  {
    id: "dis-29",
    name: "Depressiya, Asabiy Zo'riqish va Uyqusizlik",
    nameRu: "Депрессия, Нервное истощение и Бессонница",
    nameEn: "Depression, Anxiety and Chronic Insomnia",
    category: "Nevrologiya",
    keywords: [
      "asab", "asabim", "stress", "depressiya", "uyqusizlik", "uyqum kelmayapti", "yiglagim kelyapti",
      "vahima", "tushkunlik", "charchoq", "panika", "asabiylashish", "депрессия", "бессонница", "стресс",
      "панические атаки", "тревога", "нервы", "невроз", "усталость", "невролог", "depression", "anxiety", "insomnia", "panic", "stress", "nervous exhaustion"
    ],
    urgency: "O'rtacha",
    causes: [
      "Surunkali ruhiy-hissiy zo'riqish, ish yoki oiladagi doimiy nizolar",
      "Miyada neyromediatorlar (serotonin, dofamin, melatonin) muvozanatining buzilishi",
      "Dam olmasdan ishlash (emotsional kuyish sindromi)",
      "Qalqonsimon bez gormonlari yoki vitamin D yetishmovchiligi"
    ],
    causesRu: [
      "Хронический психоэмоциональный стресс, конфликты на работе или в семье",
      "Дисбаланс нейромедиаторов (серотонин, дофамин, мелатонин)",
      "Синдром эмоционального выгорания и отсутствие полноценного отдыха",
      "Эндокринные нарушения или дефицит витамина D и магния"
    ],
    causesEn: [
      "Chronic psychosocial stressors, relationship or workplace tensions",
      "Neurotransmitter imbalances (serotonin, dopamine, melatonin pathways)",
      "Burnout syndrome and lack of restorative recovery intervals",
      "Endocrine anomalies or severe Vitamin D / Magnesium depletion"
    ],
    symptoms: [
      "Kayfiyatning doimiy tushkunligi, hech narsadan quvonmaslik (anhedoniya)",
      "Uxlashga qiynalish, tunda tez-tez uyg'onish yoki erta tongda uyqu qochishi",
      "Sababsiz yurak bezovtaligi, vahima va qo'rquv hissi",
      "Doimiy charchoq, diqqatni jamlay olmaslik va xotiraning pasayishi"
    ],
    symptomsRu: [
      "Стойкое снижение настроения, апатия и потеря интереса к жизни",
      "Трудности с засыпанием, поверхностный прерывистый сон",
      "Беспричинная тревога, приступы паники и плаксивость",
      "Постоянное чувство усталости, рассеянность и забывчивость"
    ],
    symptomsEn: [
      "Persistent low mood, pervasive apathy, and lack of enjoyment (anhedonia)",
      "Difficulty initiating sleep, fragmented rest, or early morning awakening",
      "Unexplained autonomic anxiety, panic surges, and emotional vulnerability",
      "Exhaustion, brain fog, poor concentration, and low stamina"
    ],
    treatments: [
      "Uyqu gigiyenasiga amal qilish: bir xil vaqtda yotish, yotishdan 1 soat oldin telefon va ekranni o'chirish",
      "Toza havoda sayr qilish va yengil jismoniy mashqlar",
      "Tinchlantiruvchi o'simlik damlamalari (valeriana, pustirnik, moychechak)",
      "Nevropatolog yoki psixoterapevt qabuliga yozilib, professional konsultatsiya olish",
      "Kofe va energetik ichimliklarni qat'iyan to'xtatish"
    ],
    treatmentsRu: [
      "Гигиена сна: отход ко сну в одно время, исключение экранов за 1 час до сна",
      "Прогулки на свежем воздухе и умеренная физическая активность",
      "Успокаивающие травяные сборы (валериана, пустырник, мята)",
      "Консультация невролога или психотерапевта для подбора безопасной терапии",
      "Исключение кофеина и энергетических напитков"
    ],
    treatmentsEn: [
      "Strict sleep hygiene: consistent bedtimes, screen blackout 1h before bed",
      "Daily fresh-air strolls and rhythmic moderate physical exercise",
      "Herbal adaptogens and calmative teas (Valerian, Chamomile, Lemon balm)",
      "Consultation with a neurologist or clinical psychotherapist",
      "Avoid all stimulant energy drinks, excessive caffeine, and alcohol"
    ],
    doctorSpecialty: "Nevropatolog / Psixonevrolog",
    doctorSpecialtyRu: "Врач-невропатолог / Психотерапевт",
    doctorSpecialtyEn: "Neurologist / Psychotherapist",
    recommendedDoctorId: "doc-2",
    recommendedClinicIds: ["clinic-1", "clinic-3", "clinic-7"]
  },
  {
    id: "dis-30",
    name: "Oyoq Tomirlari Varikozi (Varikoz)",
    nameRu: "Варикозное расширение вен нижних конечностей",
    nameEn: "Varicose Veins and Venous Insufficiency",
    category: "Xirurgiya / Flebologiya",
    keywords: [
      "varikoz", "tomir", "vena", "oyoq shishi", "oyoq ogriq", "tomir tortishishi", "oyog'im shishyapti",
      "ko'k tomirlar", "flebolog", "варикоз", "вены", "отеки ног", "тяжесть в ногах", "варикозное расширение",
      "судороги", "флеболог", "varicose", "veins", "swollen legs", "leg pain", "venous insufficiency", "phlebologist"
    ],
    urgency: "O'rtacha",
    causes: [
      "Vena qon-tomir klapanlarining zaiflashishi va qonning orqaga oqishi (refluks)",
      "Uzoq vaqt tik oyoqda yoki uzoq vaqt qimirlamay o'tirib ishlash",
      "Irsiy qon-tomir devorlarining elastikligi pastligi",
      "Ortiqcha tana vazni va homiladorlik davridagi tomir bosimi"
    ],
    causesRu: [
      "Несостоятельность венозных клапанов и застой крови в венах ног",
      "Длительная статическая нагрузка стоя или сидя (продавцы, парикмахеры, хирурги)",
      "Наследственная слабость соединительной ткани венозной стенки",
      "Избыточный вес и гормональные перестройки во время беременности"
    ],
    causesEn: [
      "Incompetence of deep or superficial venous valves with venous reflux",
      "Prolonged stationary standing or sitting occupations",
      "Hereditary weakness of venous vascular wall elasticity",
      "Elevated pelvic venous pressures during pregnancy or obesity"
    ],
    symptoms: [
      "Kun oxirida boldir va tovonlarda kuchli og'irlik, simillash va toliqish",
      "Oyoqlarning shishishi va paypoq rezinkasi iz qoldirishi",
      "Kechalari boldir mushaklarining tortishishi (sudorogi)",
      "Terida ko'k, bo'rtib chiqqan 'ilonizi' tomirlar va mayda kapillyar to'rlari"
    ],
    symptomsRu: [
      "Тяжесть, гудение и распирание в икрах к концу дня",
      "Отечность стоп и лодыжек, следы от резинки носков",
      "Ночные судороги в икроножных мышцах",
      "Видимые синюшные извитые выступающие вены и сосудистые сеточки"
    ],
    symptomsEn: [
      "Heaviness, aching, and dull throbbing in the calves by evening",
      "Dependent peripheral edema around ankles and lower shins",
      "Nocturnal calf muscle cramps and restless legs",
      "Tortuous bulging superficial veins and cutaneous spider telangiectasias"
    ],
    treatments: [
      "Flebolog yoki tomir xirurgi ko'rigidan o'tib, oyoq venalarini UZDG (dopler) qildirish",
      "Maxsus kompressiv paypoq (trikotaj) kiyish (shifokor o'lchamini tanlaydi)",
      "Kun davomida oyoqlarni 15-20 daqiqa yostiq ustiga ko'tarib yotish",
      "Shifokor tavsiyasi bilan venotonik dori vositalari (Detraleks, Flebodiya)",
      "Oyoqqa tushadigan uzoq statik yuklamani kamaytirish va ko'proq piyoda yurish"
    ],
    treatmentsRu: [
      "Консультация флеболога и ультразвуковое дуплексное сканирование (УЗДГ) вен ног",
      "Ношение медицинского компрессионного трикотажа",
      "Отдых с приподнятыми ногами выше уровня сердца на 15-20 минут",
      "Прием венотонизирующих препаратов (Детралекс, Флебодиа) по назначению врача",
      "Пешие прогулки и плавание для стимуляции мышечно-венозной помпы"
    ],
    treatmentsEn: [
      "Duplex Doppler ultrasound evaluation with a vascular phlebologist",
      "Prescription graduated compression stockings (grade prescribed by specialist)",
      "Periodic lower limb elevation above the level of the heart for 15-20 mins",
      "Venotonic pharmacotherapy (Detralex, Phlebodia) under medical advice",
      "Dynamic walking and swimming to activate calf muscle venous pumps"
    ],
    doctorSpecialty: "Flebolog / Qon-tomir Jarrohi",
    doctorSpecialtyRu: "Врач-флеболог / Сосудистый хирург",
    doctorSpecialtyEn: "Phlebologist / Vascular Surgeon",
    recommendedDoctorId: "doc-5",
    recommendedClinicIds: ["clinic-1", "clinic-4", "clinic-2"]
  }
];
