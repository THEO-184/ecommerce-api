import { Body, Controller, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartItemDto } from './dto/cart.dto';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Post()
  addToCart(@Body() payload: CartItemDto) {
    return this.cartService.addToCart(payload);
  }
}
