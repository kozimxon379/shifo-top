import { diseasesDirectory } from './diseasesData.js';
import { initialClinics } from './clinicsData.js';
import { initialDoctors } from './doctorsData.js';

/**
 * Normalizes text: lowercase, unifies apostrophes, removes punctuation
 */
function normalizeText(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[`'’ʻ‘]/g, "'")
    .replace(/[.,\/#!$%\^&\*;:{}=\-_~()?"']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Levenshtein distance between two strings
 */
function levenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

/**
 * Calculates string similarity ratio (0.0 to 1.0)
 */
function stringSimilarity(s1, s2) {
  if (!s1 || !s2) return 0;
  const maxLen = Math.max(s1.length, s2.length);
  if (maxLen === 0) return 1.0;
  return (maxLen - levenshteinDistance(s1, s2)) / maxLen;
}

/**
 * Uzbek phonetic stemmer and morphological root extractor
 * Handles common consonant changes:
 *   k -> g (yurak -> yuragim, buyrak -> buyragim, ko'krak -> ko'kragim)
 *   q -> g' (tomoq -> tomog'im, quloq -> qulog'im, oyoq -> oyog'im)
 * Handles noun suffixes (-im, -ing, -i, -da, -dan, -ga, -lar, etc.)
 * Handles verb conjugations (-yapti, -votti, -moqda, -di, -gan, -yotgan, etc.)
 */
function extractUzbekStems(word) {
  const clean = normalizeText(word);
  if (!clean || clean.length < 3) return [clean];

  const stems = new Set([clean]);

  // Strip common verb suffixes
  const verbSuffixes = [
    "yaptilar", "yapti", "vottilar", "votti", "voti", "moqda", "yotgan",
    "yotir", "ayapti", "ayapman", "yapman", "ganman", "gan", "dilar", "dim", "di",
    "moqchi", "ish", "ishi", "ishim"
  ];
  for (const suf of verbSuffixes) {
    if (clean.endsWith(suf) && clean.length > suf.length + 2) {
      stems.add(clean.slice(0, -suf.length));
    }
  }

  // Strip noun possessive / case suffixes
  const nounSuffixes = [
    "larimiz", "laringiz", "lari", "lar", "imiz", "ingiz", "ing", "im",
    "dan", "da", "ga", "ka", "qa", "ni", "ning"
  ];
  for (const suf of nounSuffixes) {
    if (clean.endsWith(suf) && clean.length > suf.length + 2) {
      stems.add(clean.slice(0, -suf.length));
    }
  }

  // Reverse phonetic changes (e.g. yurag -> yurak, tomog' -> tomoq, oyog' -> oyoq)
  const expanded = new Set([...stems]);
  for (const st of stems) {
    if (st.endsWith("g")) {
      expanded.add(st.slice(0, -1) + "k"); // yurag -> yurak, buyrag -> buyrak
    }
    if (st.endsWith("g'") || st.endsWith("g`") || st.endsWith("g’")) {
      expanded.add(st.slice(0, -2) + "q"); // tomog' -> tomoq, qulog' -> quloq, oyog' -> oyoq
    }
    if (st.endsWith("og'") || st.endsWith("og")) {
      expanded.add(st + "i");
      expanded.add(st.replace(/g'?$/, 'q'));
    }
  }

  return Array.from(expanded);
}

/**
 * Intelligent consultation engine that evaluates patient complaints against
 * the medical database using multi-factor clinical scoring and fuzzy heuristics.
 */
export function consultMedicalAI(query, lang = 'uz') {
  if (!query || typeof query !== 'string') {
    query = '';
  }

  const rawQuery = query.trim();
  const qClean = normalizeText(rawQuery);
  const queryTokens = qClean.split(' ').filter(t => t.length > 1);

  // Generate all root stems for the query words
  const allQueryStems = new Set();
  for (const token of queryTokens) {
    allQueryStems.add(token);
    const stems = extractUzbekStems(token);
    stems.forEach(s => allQueryStems.add(s));
  }
  const queryStemsArr = Array.from(allQueryStems);

  // Score each disease in the directory
  const scoredDiseases = diseasesDirectory.map((disease) => {
    let score = 0;
    const diseaseNameClean = normalizeText(disease.name);
    const diseaseNameRuClean = normalizeText(disease.nameRu);
    const diseaseNameEnClean = normalizeText(disease.nameEn);

    // 1. Exact Name Match (very strong)
    if (qClean === diseaseNameClean || qClean === diseaseNameRuClean || qClean === diseaseNameEnClean) {
      score += 150;
    } else if (
      diseaseNameClean.includes(qClean) ||
      diseaseNameRuClean.includes(qClean) ||
      diseaseNameEnClean.includes(qClean)
    ) {
      score += 70;
    }

    // 2. Keyword exact and substring matching
    for (const kw of disease.keywords) {
      const kwClean = normalizeText(kw);
      if (!kwClean) continue;

      if (qClean === kwClean) {
        score += 80;
      } else if (qClean.includes(kwClean)) {
        score += 45;
      } else if (kwClean.includes(qClean) && qClean.length >= 3) {
        score += 35;
      }

      // Token-level matching
      for (const token of queryTokens) {
        if (token === kwClean) {
          score += 40;
        }
      }

      // Stem matching with Uzbek roots
      for (const stem of queryStemsArr) {
        if (stem.length >= 3) {
          if (stem === kwClean) {
            score += 35;
          } else if (kwClean.startsWith(stem)) {
            score += 25;
          }
        }
      }

      // Fuzzy typo tolerance (e.g. "das" vs "davlen" or typos like "grip", "gastrt")
      if (qClean.length >= 3 && kwClean.length >= 3) {
        const sim = stringSimilarity(qClean, kwClean);
        if (sim >= 0.75) {
          score += Math.round(sim * 30);
        }
      }
    }

    // 3. Symptoms text matching
    for (const sym of disease.symptoms) {
      const symClean = normalizeText(sym);
      for (const token of queryTokens) {
        if (token.length >= 4 && symClean.includes(token)) {
          score += 12;
        }
      }
    }

    return { disease, score };
  });

  // Sort by highest matching score
  scoredDiseases.sort((a, b) => b.score - a.score);
  const bestMatch = scoredDiseases[0];

  // Minimum threshold to consider a reliable match
  const MATCH_THRESHOLD = 20;

  if (bestMatch && bestMatch.score >= MATCH_THRESHOLD) {
    const matched = bestMatch.disease;

    // Find recommended clinics and doctors
    const clinics = (matched.recommendedClinicIds || [])
      .map(id => initialClinics.find(c => c.id === id))
      .filter(Boolean);
    const doctor = initialDoctors.find(d => d.id === matched.recommendedDoctorId) || initialDoctors[0];

    // Pick 3-4 other suggested diseases for quick reference
    const suggestedDiseases = diseasesDirectory
      .filter(d => d.id !== matched.id && (d.category === matched.category || Math.random() > 0.5))
      .slice(0, 3)
      .map(d => ({
        id: d.id,
        name: lang === 'ru' ? d.nameRu : lang === 'en' ? d.nameEn : d.name,
        category: d.category
      }));

    if (lang === 'ru') {
      return {
        matched: true,
        diseaseId: matched.id,
        diseaseName: matched.nameRu,
        category: matched.category,
        urgency: matched.urgency,
        summary: `По вашему запросу («${rawQuery}») клинические признаки соответствуют диагнозу «${matched.nameRu}». Ниже представлены медицинские причины заболевания и научно доказанные методы лечения:`,
        causes: matched.causesRu || matched.causes,
        treatments: matched.treatmentsRu || matched.treatments,
        symptoms: matched.symptomsRu || matched.symptoms,
        doctorSpecialty: matched.doctorSpecialtyRu || matched.doctorSpecialty,
        doctor: doctor,
        clinics: clinics.length > 0 ? clinics : [initialClinics[0], initialClinics[1]],
        suggestedDiseases
      };
    } else if (lang === 'en') {
      return {
        matched: true,
        diseaseId: matched.id,
        diseaseName: matched.nameEn,
        category: matched.category,
        urgency: matched.urgency,
        summary: `Based on your symptom search ("${rawQuery}"), clinical presentation correlates with "${matched.nameEn}". Below are the authenticated medical etiology factors and treatment options:`,
        causes: matched.causesEn || matched.causes,
        treatments: matched.treatmentsEn || matched.treatments,
        symptoms: matched.symptomsEn || matched.symptoms,
        doctorSpecialty: matched.doctorSpecialtyEn || matched.doctorSpecialty,
        doctor: doctor,
        clinics: clinics.length > 0 ? clinics : [initialClinics[0], initialClinics[1]],
        suggestedDiseases
      };
    } else {
      return {
        matched: true,
        diseaseId: matched.id,
        diseaseName: matched.name,
        category: matched.category,
        urgency: matched.urgency,
        summary: `Sizning murojaatingiz («${rawQuery}») bo'yicha «${matched.name}» holatiga oid aniq klinik belgilar aniqlandi. Quyida ushbu kasallikning kelib chiqish sabablari va ilmiy tibbiy shifo choralari berilgan:`,
        causes: matched.causes,
        treatments: matched.treatments,
        symptoms: matched.symptoms,
        doctorSpecialty: matched.doctorSpecialty,
        doctor: doctor,
        clinics: clinics.length > 0 ? clinics : [initialClinics[0], initialClinics[1]],
        suggestedDiseases
      };
    }
  }

  // Fallback when query does NOT match any recognized disease or medical symptom
  const topSuggestedDiseases = [
    { id: 'dis-1', name: lang === 'ru' ? "Грипп и ОРВИ" : lang === 'en' ? "Flu & Acute Viral Infection" : "Gripp va O'RVI", category: "Terapiya" },
    { id: 'dis-2', name: lang === 'ru' ? "Головная боль (Мигрень)" : lang === 'en' ? "Headache & Migraine" : "Bosh og'rig'i (Migren)", category: "Nevrologiya" },
    { id: 'dis-3', name: lang === 'ru' ? "Гастрит и язва" : lang === 'en' ? "Gastritis & Peptic Ulcer" : "Gastrit va oshqozon og'rig'i", category: "Gastroenterologiya" },
    { id: 'dis-4', name: lang === 'ru' ? "Боль в сердце и стенокардия" : lang === 'en' ? "Chest Pain & Angina" : "Yurak sanchishi va stenokardiya", category: "Kardiologiya" },
    { id: 'dis-5', name: lang === 'ru' ? "Сахарный диабет" : lang === 'en' ? "Diabetes Mellitus" : "Qandli diabet", category: "Endokrinologiya" },
    { id: 'dis-6', name: lang === 'ru' ? "Зубная боль и пульпит" : lang === 'en' ? "Toothache & Pulpitis" : "Tish og'rig'i va pulpit", category: "Stomatologiya" },
    { id: 'dis-7', name: lang === 'ru' ? "Боль в пояснице и суставах" : lang === 'en' ? "Back Pain & Joint Ache" : "Bel va bo'g'im og'rig'i", category: "Nevrologiya" },
    { id: 'dis-8', name: lang === 'ru' ? "Аллергия и дерматит" : lang === 'en' ? "Allergy & Dermatitis" : "Allergiya va toshmalar", category: "Allergologiya" }
  ];

  if (lang === 'ru') {
    return {
      matched: false,
      notFound: true,
      query: rawQuery,
      diseaseName: `Такого заболевания не найдено: «${rawQuery}»`,
      category: "Поиск в справочнике",
      urgency: null,
      summary: `К сожалению, по запросу «${rawQuery}» в медицинской базе данных не найдено такого заболевания или симптома. Пожалуйста, проверьте правильность написания или выберите одно из известных заболеваний из списка ниже:`,
      causes: [],
      treatments: [],
      doctorSpecialty: null,
      doctor: null,
      clinics: [],
      suggestedDiseases: topSuggestedDiseases
    };
  } else if (lang === 'en') {
    return {
      matched: false,
      notFound: true,
      query: rawQuery,
      diseaseName: `No such disease found: "${rawQuery}"`,
      category: "Directory Search",
      urgency: null,
      summary: `Unfortunately, no condition or symptom matching "${rawQuery}" was found in our clinical database. Please verify the spelling or select a recognized disease from the list below:`,
      causes: [],
      treatments: [],
      doctorSpecialty: null,
      doctor: null,
      clinics: [],
      suggestedDiseases: topSuggestedDiseases
    };
  } else {
    return {
      matched: false,
      notFound: true,
      query: rawQuery,
      diseaseName: `Bunday kasallik topilmadi: «${rawQuery}»`,
      category: "Qidiruv natijasi",
      urgency: null,
      summary: `Kechirasiz, siz kiritgan «${rawQuery}» bo'yicha tibbiy ma'lumotlar bazasida hech qanday kasallik yoki alomat topilmadi. Unaqa kasallik mavjud emas. Iltimos, so'zni to'g'ri yozganingizni tekshiring yoki quyidagi mavjud kasalliklardan birini tanlang:`,
      causes: [],
      treatments: [],
      doctorSpecialty: null,
      doctor: null,
      clinics: [],
      suggestedDiseases: topSuggestedDiseases
    };
  }
}
