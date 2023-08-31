import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartItemDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async addToCart(payload: CartItemDto) {
    const cart = await this.prisma.cart.upsert({
      where: {
        userId: payload.userId,
      },

      create: {
        user: {
          connect: payload.userId as never,
        },
        cartItems: {
          create: [
            {
              quantity: payload.quantity,
              product: {
                connect: payload.productId as never,
              },
            },
          ],
        },
      },
      update: {
        cartItems: {
          create: [
            {
              quantity: payload.quantity,
              product: {
                connect: payload.productId as never,
              },
            },
          ],
        },
      },
      select: {
        _count: {
          select: {
            cartItems: true,
          },
        },
      },
    });

    return cart;
  }
}
