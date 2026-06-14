// src/category/dto/create-category.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { CategoryType } from '../../../generated/prisma/enums';

export class CreateCategoryDto {
  @ApiProperty() @IsString() name!: string;
  @ApiProperty({ enum: CategoryType })
  @IsEnum(CategoryType)
  type!: CategoryType;
}
