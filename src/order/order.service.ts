// src/orders/orders.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TelegramService } from '../telegram/telegram.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private telegram: TelegramService,
  ) {}

  async create(userId: string, dto: CreateOrderDto) {
    // Productlarni DB dan olish
    const productIds = dto.items.map((i) => i.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      throw new NotFoundException('Biror mahsulot topilmadi');
    }

    // totalPrice hisoblash
    let totalPrice = 0;
    const itemsData = dto.items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      const price = product.price * item.quantity;
      totalPrice += price;
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price, // snapshot
      };
    });

    // Order yaratish
    const order = await this.prisma.order.create({
      data: {
        userId,
        totalPrice,
        items: { create: itemsData },
      },
      include: {
        user: true,
        items: { include: { product: true } },
      },
    });

    // Telegramga xabar
    await this.telegram.sendOrderNotification(order);

    return order;
  }

  findAll() {
    return this.prisma.order.findMany({
      include: { user: true, items: { include: { product: true } } },
    });
  }

  findMyOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
    });
  }
}
