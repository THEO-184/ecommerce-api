import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CartItemDto } from './dto/cart.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import GetUser from 'src/auth/decorators/user.decorator';

@UseGuards(AuthGuard)
@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  getCartItems(@GetUser('sub') id: string) {
    return this.cartService.getCartItems(id);
  }

  @Delete('item/:id')
  deleteCartItem(
    @Param('id') cartItemId: string,
    @GetUser('sub') userId: string,
  ) {
    return this.cartService.deleteCartItem(cartItemId, userId);
  }

  @Post()
  addToCart(@Body() payload: CartItemDto, @GetUser('sub') id: string) {
    return this.cartService.addToCart(payload, id);
  }
}
