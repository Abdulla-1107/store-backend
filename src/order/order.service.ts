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

  async create(dto: CreateOrderDto) {
    const productIds = dto.items.map((i) => i.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      throw new NotFoundException('Biror mahsulot topilmadi');
    }

    let totalPrice = 0;
    const itemsData = dto.items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      totalPrice += product.price * item.quantity;
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      };
    });

    const order = await this.prisma.order.create({
      data: {
        fullName: dto.fullName,
        phone: dto.phone,
        address: dto.address,
        totalPrice,
        paymentMethod: dto.paymentMethod,
        items: { create: itemsData },
      },
      include: {
        items: { include: { product: true } },
      },
    });

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
