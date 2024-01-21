  import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartItemDto } from './dto/cart.dto';
import { ProductsService } from 'src/products/products.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CartService {
  constructor(
    private prisma: PrismaService,
    private productService: ProductsService,
  ) {}

   async addToCart(payload: CartItemDto, userId: string) {
    const existingCartItem = await this.checkIsItemInCart(
      payload.productId,
      userId,
    );

    if (existingCartItem) {
      if (payload.quantity >= existingCartItem?.product?.quantity) {
        throw new BadRequestException(
          'insufficient products for the requested quantity',
        );
      }

      await this.prisma.shoppingCartItem.update({
        where: {
          id: existingCartItem.id,
        },
        data: {
          quantity: payload.quantity,
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

    const product = await this.productService.getProduct(payload.productId);
    if (payload.quantity >= product?.quantity) {
      throw new BadRequestException(
        'insufficient products for the requested quantity',
      );
    }

    const cartItem = await this.prisma.shoppingCartItem.create({
      data: {
        quantity: payload.quantity,
        price: product.price,
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
  }

  async checkIsItemInCart(productId: string, userId: string) {
    const existingCartItem = await this.prisma.shoppingCartItem.findFirst({
      where: {
        cart: {
          userId,
        },
        productId: productId,
      },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            quantity: true,
            price: true,
          },
        },
      },
    });

    return existingCartItem;
  }

  async getCartItems(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: {
        userId,
      },

      include: {
        cartItems: {
          select: {
            id: true,
            quantity: true,
            price: true,
            product: {
              select: {
                id: true,
                description: true,
                image: true,
                title: true,
              },
            },
          },
        },
      },
    });

    const totalCost = cart.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    return { cart: { totalCost, count: cart.cartItems.length, ...cart } };
  }

  async deleteCartItem(cartItemId: string, userId: string) {
    await this.prisma.shoppingCartItem.delete({
      where: {
        cart: {
          userId,
        },
        id: cartItemId,
      },
    });

    return { message: 'item successfully deleted from cart' };
  }

  async getUserCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: {
        userId,
      },
      include: {
        _count: {
          select: {
            cartItems: true,
          },
        },
        cartItems: {
          select: {
            id: true,
            price: true,
            productId: true,
            quantity: true,
          },
        },
      },
    });

    return cart;
  }
}
