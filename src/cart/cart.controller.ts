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
import { S3Client } from '@aws-sdk/client-s3';

@UseGuards(AuthGuard)
@Controller('cart')
export class CartController {
  s3: S3Client;
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
