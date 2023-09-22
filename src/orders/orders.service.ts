import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderDto } from './dto/order.dto';
import { CartService } from 'src/cart/cart.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private cartService: CartService,
  ) {}

  async createOrder(userId: string) {
    const { orderedProducts, totalOrderCost } = await this.getOrderDetails(
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

  async getOrderDetails(userId: string) {
    const cart = await this.cartService.getUserCart(userId);

    let totalOrderCost = 0;
    let orderedProducts: { id: string }[] = [];

    for (const item of cart.cartItems) {
      const costOfOrderItem = item.quantity * item.product.price;
      totalOrderCost += costOfOrderItem;
      orderedProducts.push({ id: item.id });
    }

    return { totalOrderCost, orderedProducts };
  }
}
