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
    const { orderedProductsDetails, totalOrderCost } =
      await this.getCartDetails(userId);

    // const orderedProductsIDs = orderedProductsDetails.map((product) => ({
    //   id: product.productId,
    // }));

    const orderStatus = await this.prisma.orderStatus.findFirstOrThrow({
      where: {
        title: 'pending',
      },
    });

    // const orderProducts = await this.prisma.orderProduct.createMany({
    //   data:[...orderedProductsDetails]
    // })

    const order = await this.prisma.orderItem.create({
      data: {
        total: totalOrderCost,
        status: {
          connect: {
            id: orderStatus.id,
          },
        },

        items: {
          create: [...orderedProductsDetails],
          //  create:
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
        orderItems: {
          select: {
            id: true,
            total: true,
            status: {
              select: {
                id: true,
                title: true,
              },
            },
            _count: true,
            items: {
              select: {
                id: true,
                price: true,
                quantity: true,
                product: {
                  select: {
                    id: true,
                    image: true,
                    title: true,
                    quantity: true,
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
    const cartItemIds = cart.cartItems.map((cart) => cart.productId);
    const cartProducts = await this.productService.getProductsByIds(
      cartItemIds,
    );

    let totalOrderCost = 0;
    let orderedProductsDetails: {
      productId: string;
      price: number;
      quantity: number;
    }[] = [];

    for (const cartItem of cart.cartItems) {
      const product = cartProducts.find(
        (product) => product.id === cartItem.productId,
      );

      if (!product) {
        throw new NotFoundException('sorry!. product is sold out!!');
      }

      const updatedProduct = await this.productService.updateProduct(
        cartItem.productId,
        { quantity: product.quantity - cartItem.quantity },
      );

      const costOfOrderItem = cartItem.quantity * cartItem.price;
      totalOrderCost += costOfOrderItem;
      orderedProductsDetails.push({
        productId: cartItem.productId,
        price: cartItem.price,
        quantity: cartItem.quantity,
      });
    }

    return { totalOrderCost, orderedProductsDetails };
  }
}
