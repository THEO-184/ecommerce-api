import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartItemDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async addToCart(payload: CartItemDto, userId: string) {
    // const cart = await this.prisma.cart.upsert({
    //   where: {
    //     userId: userId,
    //   },

    //   create: {
    //     user: {
    //       connect: { id: userId },
    //     },
    //     cartItems: {
    //       create: [
    //         {
    //           quantity: payload.quantity,
    //           product: {
    //             connect: { id: payload.productId },
    //           },
    //         },
    //       ],
    //     },
    //   },
    //   update: {
    //     cartItems: {
    //       create: [
    //         {
    //           quantity: payload.quantity,
    //           product: {
    //             connect: { id: payload.productId },
    //           },
    //         },
    //       ],
    //     },
    //   },
    //   select: {
    //     _count: {
    //       select: {
    //         cartItems: true,
    //       },
    //     },
    //     cartItems: true,
    //     user: true,
    //   },
    // });

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

      return { updatedCartItem, message: 'cart successfully updated' };
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

    return { data: cartItem, message: 'cart successfully created' };

    // return cart;
  }
}
