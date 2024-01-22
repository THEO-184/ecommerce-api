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
import { S3ServiceService } from 'src/s3-service/s3-service.service';

@UseGuards(AuthGuard)
@Controller('cart')
export class CartController {
  s3: S3Client;
  constructor(
    private cartService: CartService,
    private s3Service: S3ServiceService,
  ) {
    this.s3 = this.s3Service.getS3Client();
  }

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
    return this.cartService.addToCart(payload, id, this.s3);
  }
}
