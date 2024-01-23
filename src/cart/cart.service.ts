import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartItemDto } from './dto/cart.dto';
import { ProductsService } from 'src/products/products.service';
import { Prisma, PrismaClient } from '@prisma/client';
import { S3Client } from '@aws-sdk/client-s3';
import { S3ServiceService } from 'src/s3-service/s3-service.service';

export interface CartData {
  id: string;
  updatedAt: string;
  createdAt: string;
  userId: string;
  cartItems: {
    id: string;
    quantity: number;
    price: number;
    subTotal: number;
    product: { id: string; description: string; image: string; title: string };
  }[];
}

@Injectable()
export class CartService {
  client;
  constructor(
    private prisma: PrismaService,
    private productService: ProductsService,
    private s3Service: S3ServiceService,
  ) {
    this.client = new PrismaClient();
  }

  async addToCart(payload: CartItemDto, userId: string) {
    const existingCartItem = await this.checkIsItemInCart(
      payload.productId,
      userId,
    );

    if (existingCartItem) {
      if (payload.quantity > existingCartItem?.product?.quantity) {
        throw new BadRequestException(
          'insufficient products for the requested quantity',
        );
      }

      await this.updateCartItem(existingCartItem.id, payload.quantity);

      return { message: 'item added to cart' };
    }

    const product = await this.productService.getProduct(payload.productId);
    if (payload.quantity > product?.quantity) {
      throw new BadRequestException(
        'insufficient products for the requested quantity',
      );
    }

    const cartItem = await this.createCart(payload, userId, product.price);

    return { data: cartItem, message: 'item added to cart' };
  }

  private async updateCartItem(cartItemId: string, quantity: number) {
    await this.prisma.shoppingCartItem.update({
      where: {
        id: cartItemId,
      },
      data: {
        quantity,
      },
    });
  }

  private async createCart(
    payload: CartItemDto,
    userId: string,
    price: number,
  ) {
    const cartItem = await this.prisma.shoppingCartItem.create({
      data: {
        quantity: payload.quantity,
        price,
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

    return cartItem;
  }

  private async checkIsItemInCart(productId: string, userId: string) {
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
    const cart = await this.prisma
      .$extends({
        result: {
          shoppingCartItem: {
            subTotal: {
              needs: { quantity: true, price: true },
              compute(item) {
                return item.price * item.quantity;
              },
            },
          },
        },
      })
      .$extends({
        result: {
          cart: {
            calculateCost: {
              needs: {},
              compute(data) {
                const cart = data as unknown as CartData;
                console.log('cart 1', data);
                return cart.cartItems.reduce(
                  (sum, cur) => sum + cur.subTotal,
                  0,
                );
              },
            },
          },
        },
      })
      .cart.findUnique({
        where: {
          userId,
        },

        include: {
          cartItems: {
            select: {
              id: true,
              subTotal: true,
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

    if (!cart) {
      return { cart: {} };
    }

    const cartItems = await this.s3Service.getAWSProducts(cart.cartItems);
    cart.cartItems = cartItems;

    const totalCost = cart.calculateCost;

    return { data: { totalCost, count: cart.cartItems.length, ...cart } };
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
