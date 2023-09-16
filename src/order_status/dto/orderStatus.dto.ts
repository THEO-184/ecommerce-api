import { OrderStatusEnum } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class OrderStatusDto {
  @IsEnum(OrderStatusEnum, { message: 'Invalid status type' })
  title: OrderStatusEnum;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(100)
  description: string;
}
