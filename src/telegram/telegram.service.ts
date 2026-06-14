// src/telegram/telegram.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class TelegramService {
  private readonly apiUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;
  private readonly chatId = process.env.TELEGRAM_CHAT_ID;

  async sendOrderNotification(order: any) {
    const items = order.items
      .map(
        (i: any) =>
          `• ${i.product.name} x${i.quantity} — ${i.price * i.quantity} so'm`,
      )
      .join('\n');

    const message = `
🛒 *Yangi buyurtma!*

👤 ${order.user.fullName}
📞 ${order.user.phone}

📦 Mahsulotlar:
${items}

💰 Jami: ${order.totalPrice} so'm
💳 To'lov: ${order.paymentMethod === 'Cash' ? '💵 Naqt' : '💳 Karta'}
`.trim();

    await fetch(`${this.apiUrl}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: this.chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });
  }
}
