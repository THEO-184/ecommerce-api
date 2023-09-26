import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderDto } from './dto/order.dto';
import { CartService } from 'src/cart/cart.service';
import { Prisma } from '@prisma/client';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private cartService: CartService,
    private productService: ProductsService,
  ) {}

  async createOrder(userId: string) {
    const { orderedProducts, totalOrderCost } = await this.getCartDetails(
      userId,
    );

    const orderStatus = await this.prisma.orderStatus.findFirstOrThrow({
      where: {
        title: 'pending',
      },
    });

    const order = await this.prisma.orderItem.create({
      data: {
        total: totalOrderCost,
        status: {
          connect: {
            id: orderStatus.id,
          },
        },

        items: {
          connect: orderedProducts,
        },

        order: {
          create: {
            user: {
              connect: { id: userId },
            },
          },
        },
      },
    });

    return { message: 'order created successfully', order };
  }

  async deleteOrder(orderId: string) {
    const order = await this.prisma.order.delete({
      where: {
        id: orderId,
      },
    });

    return { message: 'order deleted successfully' };
  }

  async getOrder(userId: string) {
    const order = await this.prisma.order.findFirstOrThrow({
      where: {
        userId: userId,
      },

      include: {
        orderItem: {
          select: {
            id: true,
            total: true,
            items: {
              select: {
                quantity: true,
                product: {
                  select: {
                    id: true,
                    price: true,
                    title: true,
                    image: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return { data: order };
  }

  async getCartDetails(userId: string) {
    const cart = await this.cartService.getUserCart(userId);

    let totalOrderCost = 0;
    let orderedProducts: { id: string }[] = [];

    for (const cartItem of cart.cartItems) {
      const product = await this.productService.getProduct(cartItem.productId);

      if (!product) {
        throw new NotFoundException('sorry!. product is sold out!!');
      }

      const updatedProduct = await this.productService.updateProduct(
        cartItem.productId,
        { quantity: product.quantity - cartItem.quantity },
      );

      const costOfOrderItem = cartItem.quantity * cartItem.price;
      totalOrderCost += costOfOrderItem;
      orderedProducts.push({ id: cartItem.productId });
    }

    return { totalOrderCost, orderedProducts };
  }
}
