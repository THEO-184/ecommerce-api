import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CartItemDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  quantity: number;
}
