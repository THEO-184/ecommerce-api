import { IsNotEmpty, IsString } from 'class-validator';

export class OrderDto {
  @IsString()
  @IsNotEmpty()
  cartId: never;
}

export class UpdateOrderStatusDto {
  @IsString()
  @IsNotEmpty()
  orderStatusId: string;
}
