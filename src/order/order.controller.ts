// src/orders/orders.controller.ts
import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { OrdersService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Buyurtma berish' })
  create(@Request() req: any, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(req.user.id, dto);
  }

  @Get('my')
  @ApiOperation({ summary: 'Mening buyurtmalarim' })
  myOrders(@Request() req: any) {
    return this.ordersService.findMyOrders(req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha buyurtmalar (Admin)' })
  findAll() {
    return this.ordersService.findAll();
  }
}
