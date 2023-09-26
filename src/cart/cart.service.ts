import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartItemDto } from './dto/cart.dto';
import { ProductsService } from 'src/products/products.service';

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

    if (payload.quantity > existingCartItem?.product?.quantity) {
      throw new BadRequestException(
        'insufficient products for the requested quantity',
      );
    }

    if (existingCartItem) {
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
        _count: {
          select: {
            cartItems: true,
          },
        },
        cartItems: {
          select: {
            id: true,
            quantity: true,
            price: true,
            product: {
              select: {
                description: true,
                image: true,
                title: true,
              },
            },
          },
        },
      },
    });

    return { data: cart };
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

            quantity: true,
            product: {
              select: {
                id: true,
                price: true,
              },
            },
          },
        },
      },
    });

    return cart;
  }
}
