// Telegram Bot API integration utility

export async function sendTelegramMessage(text, botToken, chatId) {
  // If token and chatId are provided, try actual dispatch to Telegram Bot API
  if (botToken && chatId) {
    try {
      const url = `https://api.telegram.org/bot${botToken.trim()}/sendMessage`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId.trim(),
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
  return `🏥 <b>YANGI SHIFOKOR QABULI — shifo.top</b>\n\n` +
    `👤 <b>Bemor:</b> ${apt.patientName}\n` +
    `📞 <b>Telefon:</b> ${apt.phone}\n` +
    `👨‍⚕️ <b>Shifokor:</b> ${apt.doctorName} (${apt.specialty})\n` +
    `📍 <b>Klinika:</b> ${apt.clinicName}\n` +
    `📅 <b>Sana:</b> ${apt.date}\n` +
    `⏰ <b>Vaqt (Slot):</b> ${apt.timeSlot}\n` +
    `💵 <b>Ko'rik narxi:</b> ${Number(apt.price).toLocaleString()} so'm\n` +
    `📝 <b>Shikoyat / Alomat:</b> ${apt.symptoms || "Kiritilmagan"}\n` +
    `⏱ <b>Yaratilgan vaqti:</b> ${new Date().toLocaleString()}\n\n` +
    `<i>Bemor bilan 10 daqiqa ichida bog'lanib qabulni tasdiqlang!</i>`;
}

export function formatOrderMessage(order) {
  const itemsText = order.items
    .map((item, idx) => `${idx + 1}. ${item.name} (${item.quantity} dona) - ${(item.price * item.quantity).toLocaleString()} so'm`)
    .join("\n");

  return `📦 <b>YANGI DORIXONA BUYURTMASI — shifo.top</b>\n\n` +
    `🆔 <b>Buyurtma ID:</b> #${order.id}\n` +
    `👤 <b>Mijoz:</b> ${order.customerName}\n` +
    `📞 <b>Telefon:</b> ${order.phone}\n` +
    `📍 <b>Manzil:</b> ${order.address}\n` +
    `💳 <b>To'lov turi:</b> ${order.paymentMethod}\n` +
    `🏷 <b>Promokod:</b> ${order.promoCode || "Yo'q"}\n` +
    `💰 <b>Jami to'lov:</b> ${Number(order.total).toLocaleString()} so'm\n\n` +
    `<b>Buyurtma tarkibi:</b>\n${itemsText}\n\n` +
    `<i>Tezkor kuryer xizmatiga yo'naltirilsin!</i>`;
}
