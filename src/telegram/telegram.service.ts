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

    const message = `🛒 *Yangi buyurtma!*\n\n👤 ${order.user.fullName}\n📞 ${order.user.phone}\n\n📦 Mahsulotlar:\n${items}\n\n💰 Jami: ${order.totalPrice} so'm`;

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
