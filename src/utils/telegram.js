// Telegram Bot API integration utility

export const DEFAULT_TELEGRAM_TOKEN = "8936233153:AAFOV5VKw5vYicXXgVZbB8UvHV01QGKLJE8";
export const DEFAULT_TELEGRAM_CHAT_ID = "6575332225";

export async function sendTelegramMessage(text, botToken, chatId) {
  const token = (botToken || DEFAULT_TELEGRAM_TOKEN).trim();
  const id = (chatId || DEFAULT_TELEGRAM_CHAT_ID).trim();

  // If token and chatId are provided, dispatch directly to Telegram Bot API
  if (token && id) {
    try {
      const url = `https://api.telegram.org/bot${token}/sendMessage`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: id,
          text: text,
          parse_mode: "HTML"
        })
      });
      const data = await response.json();
      return { success: data.ok, data, simulated: false };
    } catch (err) {
      console.warn("Telegram dispatch network error, falling back to simulation:", err);
      return { success: true, error: err.message, simulated: true };
    }
  }

  // Simulation mode for demo
  console.log("%c[Telegram Bot Dispatch Simulator]", "color: #0ea5e9; font-weight: bold;");
  console.log(text);
  return { success: true, simulated: true };
}

export function formatAppointmentMessage(apt) {
  const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `✅ <b>QABUL TASDIQLANDI — shifo.top</b>\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
    `👤 <b>Bemor:</b> ${apt.patientName}\n` +
    `📞 <b>Telefon:</b> ${apt.phone}\n` +
    `👨‍⚕️ <b>Shifokor:</b> ${apt.doctorName} (${apt.specialty})\n` +
    `📍 <b>Klinika:</b> ${apt.clinicName}\n` +
    `📅 <b>Sana va vaqt:</b> ${apt.date} | ${apt.timeSlot}\n` +
    `💵 <b>Ko'rik narxi:</b> ${Number(apt.price).toLocaleString()} so'm\n` +
    `📝 <b>Shikoyat / Sabab:</b> ${apt.symptoms || "Profilaktik ko'rik"}\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n` +
    `⏱ <b>QABUL VAQTI VA ESLATMA:</b>\n` +
    `🏥 Iltimos, belgilangan qabul vaqtidan <b>15 daqiqa oldin</b> yetib boring!\n` +
    `🕒 <i>Tasdiqlangan vaqt: ${timeNow}</i>`;
}

export function formatOrderMessage(order) {
  const itemsText = (order.items || [])
    .map((item, idx) => {
      const linePrice = (Number(item.price) * Number(item.quantity)).toLocaleString();
      return `💊 <b>${item.name}</b>\n   └ Soni: ${item.quantity} dona | Narxi: ${linePrice} so'm`;
    })
    .join("\n\n");

  const deliveryMinutes = order.deliveryMinutes || "30 - 45";
  const orderTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return `✅ <b>BUYURTMA TASDIQLANDI — shifo.top</b>\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
    `🆔 <b>Buyurtma ID:</b> #${order.id}\n` +
    `👤 <b>Mijoz:</b> ${order.customerName || "Xaridor"}\n` +
    `📞 <b>Telefon raqami:</b> ${order.phone || "Ko'rsatilmagan"}\n` +
    `📍 <b>Yetkazish manzili:</b> ${order.address || "Toshkent shahri"}\n` +
    `💳 <b>To'lov turi:</b> ${order.paymentMethod || "Naqd / Karta"}\n` +
    `${order.promoCode ? `🏷 <b>Promokod:</b> ${order.promoCode}\n` : ''}\n` +
    `📋 <b>BUYURTMA QILINGAN MAHSULOTLAR:</b>\n` +
    `──────────────────────\n` +
    `${itemsText || "• Tanlangan dori vositalari"}\n` +
    `──────────────────────\n` +
    `💰 <b>JAMI TO'LOV:</b> ${Number(order.total).toLocaleString()} so'm\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n` +
    `⏱ <b>YETKAZIB BERISH VAQTI:</b>\n` +
    `🛵 <b>${deliveryMinutes} daqiqa ichida</b> manzilingizga yetkazib beriladi!\n` +
    `🕒 <i>Tasdiqlangan vaqt: ${orderTime}</i>`;
}
