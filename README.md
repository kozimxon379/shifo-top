# 🏥 shifo.top — Aqlli Tibbiy Platforma & Smart Shifokor Qabuli

> **shifo.top** — Bemorning kasallik alomatlariga qarab eng yaqin davolash punktlarini xaritada aniqlash, qulay vaqtga navbatsiz shifokor qabuliga yozilish, 24/7 AI Tibbiy Maslahatchi va onlayn dorixona ekotizimi.

---

## 🌟 Asosiy Imkoniyatlar & Xususiyatlar

1. **Kasallik bo'yicha eng yaqin davolash punkti & Geomanzili**:
   - Bosh sahifa va Ensiklopediyada kasallik/alomat nomi (masalan: *Bosh og'rig'i, Gastrit, Gripp, Yurak sanchishi, Tish og'rig'i*) kiritilsa, zudlik bilan eng yaqin ixtisoslashgan klinika masofasi (km) va xaritadagi aniq joylashuvi ko'rsatiladi.
2. **Qulay vaqtga qarab shifokor qabuliga yozilish (Smart Slot Booking)**:
   - Mijoz o'zining bo'sh vaqtiga mos sana va qulay vaqt oralig'ini (masalan: 09:00, 10:30, 14:00, 16:30) tanlaydi.
   - Qabul tasdiqlangach, `canvas-confetti` bayramona animatsiyasi ishga tushadi va to'liq ma'lumotlar saqlanadi.
3. **Burchakdagi Kichkina Sun'iy Intellekt (Shifo AI — Tibbiy Maslahatchi)**:
   - Ekranning o'ng pastki burchagidagi suzuvchi (floating) AI chat vidjeti.
   - Kasallik nomini yozganda:
     - 🩺 **Tashxis & Tushuntirish**
     - 🔍 **Kelib chiqish sabablari (Etiology)** — nega va qanday omillar sababli paydo bo'lgan?
     - 💊 **Tibbiy shifo yo'li & Birinchi yordam** — qanday tibbiy muolajalar va parhez zarur?
     - 👨‍⚕️ **Qaysi mutaxassisga borish kerak**
     - 🏥 **Eng yaqin davolash punktlari** va to'g'ridan-to'g'ri "Qabulga yozilish" tugmasi!
   - Ovozli o'qish (Speech synthesis) va tezkor savol tugmalari.
4. **3 Ta Til (UZ, RU, EN)**:
   - O'zbekcha, Ruscha va Inglizcha to'liq tarjima tizimi, har bir sahifa va barcha matnlar uchun.
5. **Dark / Light Mode**:
   - Tungi va kunduzgi rejim (foydalanuvchi tanlovi LocalStorage'da eslab qolinadi).
6. **React + Routes**:
   - `react-router-dom` orqali SPA yo'naltirish (5+ asosiy sahifalar).
7. **Tailwind CSS**:
   - Zamonaviy tibbiy zamonaviy dizayn (Emerald, Teal, Cyan, Slate ranglar palitrasi).
8. **Landing page + 5 ta to'liq sahifa**:
   - `/` — Bosh sahifa (Hero kasallik qidiruvi, interaktiv xarita, top shifokorlar, dorixona, stats).
   - `/clinics` — Davolash punktlari & Xaritasi (filtrlash, masofa bo'yicha saralash, 24/7 shoshilinch).
   - `/doctors` — Malakali shifokorlar (mutaxassislik, tajriba, reyting, vaqt slotlari).
   - `/store` — Onlayn dorixona va tibbiy asboblar (filtrlar, narx slayderi, retsept teglari).
   - `/encyclopedia` — Kasalliklar ensiklopediyasi (kelib chiqish sabablari, shifo choralari).
   - `/cart` — Xarid savati va promokodlar.
   - `/favorites` — Sevimlilar (saqlangan dorilar va shifokorlar).
   - `/admin` — Boshqaruv paneli + Dashboard.
   - `/login` — Kirish (Login/Parol yoki Telefon raqam + SMS).
9. **Admin Panel + Dashboard**:
   - Real statistik ko'rsatkichlar (Jami qabullar, tushum, tovarlar, faol klinikalar).
   - Haftalik qabullar dinamikasi grafikasi.
   - Mahsulotlar CRUD (Yangi mahsulot qo'shish, tahrirlash, o'chirish).
   - Qabullar ro'yxati (Tasdiqlash va rad etish).
10. **Telegram Bot Integratsiyasi**:
    - Buyurtmalar va qabulga yozilishlar to'g'ridan-to'g'ri Telegram bot API orqali formatlangan HTML xabarlar ko'rinishida yuboriladi.
    - Admin panelda Bot Token va Chat ID sozlamalari hamda test xabar yuborish imkoniyati.
11. **LocalStorage**:
    - Savat, sevimlilar, qabullar ro'yxati, yangi mahsulotlar CRUD, foydalanuvchi hisobi, tanlangan til va mavzu brauzer xotirasida saqlanadi.
12. **Promokodlar**:
    - `SHIFO2026` — 20% maxsus chegirma
    - `SALOM` — 10% chegirma
    - `BEPUL` — Bepul yetkazib berish
13. **Kirish (Auth)**:
    - Login + Parol yoki Telefon raqami + SMS OTP (7742) orqali kirish.
    - Tezkor sinov rollari: Bemor, Shifokor, Admin.
14. **GitHub + Vercel**:
    - SPA yo'naltirish uchun `vercel.json` sozlangan, barcha buildlar xatosiz o'tadi (`npm run build`).

---

## 🚀 Loyihani Ishga Tushirish

```bash
# 1. Bog'liqliklarni o'rnatish
npm install

# 2. Dasturchi rejimida ishga tushirish (Local Dev Server)
npm run dev

# 3. Ishlab chiqarish (Production Build) yaratish
npm run build
```

Brauzeringizda oching: `http://localhost:5173/`

---

## 🛠 Texnologiyalar

- **React 19**
- **Vite 8**
- **Tailwind CSS v4**
- **React Router DOM**
- **Lucide React** (professional tibbiy piktogrammalar)
- **Canvas Confetti**
- **Telegram Bot API**
