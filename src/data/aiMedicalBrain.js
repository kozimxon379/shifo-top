import { diseasesDirectory } from './diseasesData';
import { initialClinics } from './clinicsData';
import { initialDoctors } from './doctorsData';

export function consultMedicalAI(query, lang = 'uz') {
  const q = query.toLowerCase().trim();
  
  // Find match in disease directory
  let matched = null;

  for (const item of diseasesDirectory) {
    const inName = item.name.toLowerCase().includes(q) ||
                   item.nameRu.toLowerCase().includes(q) ||
                   item.nameEn.toLowerCase().includes(q);
    const inKeywords = item.keywords.some(k => q.includes(k.toLowerCase()) || k.toLowerCase().includes(q));
    
    if (inName || inKeywords) {
      matched = item;
      break;
    }
  }

  // If no direct keyword match, check generic symptom words
  if (!matched) {
    if (q.includes("bosh") || q.includes("head") || q.includes("голов")) {
      matched = diseasesDirectory.find(d => d.id === "dis-1");
    } else if (q.includes("oshqozon") || q.includes("qorin") || q.includes("желуд") || q.includes("живот") || q.includes("stomach")) {
      matched = diseasesDirectory.find(d => d.id === "dis-2");
    } else if (q.includes("isitma") || q.includes("harorat") || q.includes("gripp") || q.includes("tomoq") || q.includes("температур") || q.includes("горло") || q.includes("fever") || q.includes("flu")) {
      matched = diseasesDirectory.find(d => d.id === "dis-3");
    } else if (q.includes("yurak") || q.includes("bosim") || q.includes("сердц") || q.includes("давлен") || q.includes("heart") || q.includes("chest")) {
      matched = diseasesDirectory.find(d => d.id === "dis-4");
    } else if (q.includes("tish") || q.includes("зуб") || q.includes("tooth") || q.includes("teeth") || q.includes("dental")) {
      matched = diseasesDirectory.find(d => d.id === "dis-5");
    } else if (q.includes("bel") || q.includes("orqa") || q.includes("спин") || q.includes("поясниц") || q.includes("back") || q.includes("spine")) {
      matched = diseasesDirectory.find(d => d.id === "dis-6");
    } else if (q.includes("qand") || q.includes("saxar") || q.includes("сахар") || q.includes("диабет") || q.includes("sugar") || q.includes("diabet")) {
      matched = diseasesDirectory.find(d => d.id === "dis-7");
    }
  }

  if (matched) {
    const clinics = matched.recommendedClinicIds
      .map(id => initialClinics.find(c => c.id === id))
      .filter(Boolean);
    const doctor = initialDoctors.find(d => d.id === matched.recommendedDoctorId) || initialDoctors[0];

    if (lang === 'ru') {
      return {
        matched: true,
        diseaseName: matched.nameRu,
        category: matched.category,
        urgency: matched.urgency,
        summary: `По вашему запросу («${query}») обнаружены признаки заболевания «${matched.nameRu}». Ниже представлены медицинские причины и пошаговый путь лечения:`,
        causes: matched.causes,
        treatments: matched.treatments,
        doctorSpecialty: matched.doctorSpecialty,
        doctor: doctor,
        clinics: clinics
      };
    } else if (lang === 'en') {
      return {
        matched: true,
        diseaseName: matched.nameEn,
        category: matched.category,
        urgency: matched.urgency,
        summary: `Based on your symptom search ("${query}"), clinical patterns match "${matched.nameEn}". Here is evidence-based etiology and recommended medical care:`,
        causes: matched.causes,
        treatments: matched.treatments,
        doctorSpecialty: matched.doctorSpecialty,
        doctor: doctor,
        clinics: clinics
      };
    } else {
      return {
        matched: true,
        diseaseName: matched.name,
        category: matched.category,
        urgency: matched.urgency,
        summary: `Sizning murojaatingiz («${query}») bo'yicha «${matched.name}» holatiga oid klinik belgilar aniqlandi. Quyida ushbu kasallikning kelib chiqish sabablari va ilmiy tibbiy shifo choralari berilgan:`,
        causes: matched.causes,
        treatments: matched.treatments,
        doctorSpecialty: matched.doctorSpecialty,
        doctor: doctor,
        clinics: clinics
      };
    }
  }

  // Fallback response with helpful general advice
  if (lang === 'ru') {
    return {
      matched: false,
      diseaseName: "Комплексный симптомный анализ",
      summary: `Симптом «${query}» требует уточнения у терапевта. Не занимайтесь самолечением при острых симптомах.`,
      causes: [
        "Сезонное снижение иммунитета и вирусные агенты",
        "Хроническое переутомление и психоэмоциональный стресс",
        "Индивидуальные особенности обмена веществ или рацион"
      ],
      treatments: [
        "Соблюдайте постельный режим и обильное теплое питье",
        "Измерьте температуру и артериальное давление",
        "Запишитесь на первичный прием к дежурному терапевту"
      ],
      doctorSpecialty: "Врач-терапевт",
      doctor: initialDoctors[2],
      clinics: [initialClinics[0], initialClinics[1]]
    };
  } else if (lang === 'en') {
    return {
      matched: false,
      diseaseName: "General Symptom Evaluation",
      summary: `The symptom "${query}" requires a physical examination by a general physician. Avoid unprescribed heavy antibiotics.`,
      causes: [
        "Acute viral or environmental exposure",
        "Physical fatigue, stress, or mild metabolic disruption",
        "Underlying inflammatory response"
      ],
      treatments: [
        "Ensure adequate hydration and restful recovery",
        "Check vital signs (body temperature, pulse, blood pressure)",
        "Book a primary consultation with a general practitioner"
      ],
      doctorSpecialty: "General Practitioner / Internist",
      doctor: initialDoctors[2],
      clinics: [initialClinics[0], initialClinics[1]]
    };
  } else {
    return {
      matched: false,
      diseaseName: "Umumiy tibbiy tahlil",
      summary: `Siz kiritgan «${query}» shikoyati bo'yicha aniq tashxis qo'yish uchun umumiy amaliyot shifokori (Terapevt) ko'rigi tavsiya etiladi.`,
      causes: [
        "Mavsumiy immunitet sustlashishi yoki virusli infeksiya boshlanishi",
        "Organizmning jismoniy va ruhiy charchashi, stress",
        "Noto'g'ri ovqatlanish yoki ob-havo o'zgarishlariga moslashish davri"
      ],
      treatments: [
        "Mo'l-ko'l iliq suyuqlik ichish va tinch sharoitda dam olish",
        "Tana harorati va qon bosimini o'lchab qayd etib borish",
        "Eng yaqin davolash punktidagi Terapevt ko'rigiga yozilish"
      ],
      doctorSpecialty: "Terapevt",
      doctor: initialDoctors[2],
      clinics: [initialClinics[0], initialClinics[1]]
    };
  }
}
