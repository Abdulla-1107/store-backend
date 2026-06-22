import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum PaymentMethod {
  Cash = 'Cash',
  Card = 'Card',
}

export class OrderItemDto {
  @ApiProperty() @IsString() productId!: string;
  @ApiProperty() @IsNumber() quantity!: number;
}

export class CreateOrderDto {
  @ApiProperty() @IsString() fullName!: string;
  @ApiProperty() @IsString() phone!: string;
  @ApiProperty() @IsString() address!: string;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];

  @ApiProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  paymentMethod!: PaymentMethod;
}
