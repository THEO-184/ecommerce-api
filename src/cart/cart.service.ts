import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartItemDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async addToCart(payload: CartItemDto, userId: string) {
    const existingCartItem = await this.prisma.shoppingCartItem.findFirst({
      where: {
        cart: {
          userId,
        },
        productId: payload.productId,
      },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            quantity: true,
          },
        },
      },
    });

    if (existingCartItem) {
      const updatedCartItem = await this.prisma.shoppingCartItem.update({
        where: {
          id: existingCartItem.id,
        },
        data: {
          quantity: {
            increment: payload.quantity,
          },
        },
        include: {
          product: {
            select: {
              id: true,
              title: true,
              quantity: true,
            },
          },
        },
      });

      return { message: 'cart successfully updated' };
    }

    const cartItem = await this.prisma.shoppingCartItem.create({
      data: {
        quantity: payload.quantity,
        cart: {
          connectOrCreate: {
            where: {
              userId,
            },
            create: {
              user: {
                connect: { id: userId },
              },
            },
          },
        },
        product: {
          connect: {
            id: payload.productId,
          },
        },
      },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            quantity: true,
          },
        },
      },
    });

    return { message: 'cart successfully created' };
  }
}
