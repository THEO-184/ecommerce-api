import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CartItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  quantity: number;
}
