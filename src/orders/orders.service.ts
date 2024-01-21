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

    const orderStatus = await this.prisma.orderStatus.findFirstOrThrow({
      where: {
        title: 'processing',
      },
    });

    // create order
    const order = await this.prisma.orderItem.create({
      data: {
        total: totalOrderCost,
        status: {
          connect: {
            id: orderStatus.id,
          },
        },

        items: {
          create: [...orderedProductsDetails].map(
            ({ price, productId, quantity }) => ({
              price,
              productId,
              quantity,
            }),
          ),
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
    // update product inventory
    for (const item of orderedProductsDetails) {
      await this.productService.updateProduct(item.productId, {
        quantity: item.productQty - item.quantity,
      });
    }

    return { message: 'order created successfully', order };
  }

  async cancelOrder(orderId: string, userId: string) {
    const order = await this.prisma.order.delete({
      where: {
        id: orderId,
        userId,
      },
      include: {
        orderItems: {
          select: {
            id: true,
            items: {
              select: {
                quantity: true,
                product: {
                  select: {
                    id: true,
                    quantity: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const orderedProducts = order.orderItems.flatMap((item) => item.items);

    // update product inventory
    for (const orderProduct of orderedProducts) {
      await this.productService.updateProduct(orderProduct.product.id, {
        // add back the number of products that was deducted when user made order
        quantity: orderProduct.product.quantity + orderProduct.quantity,
      });
    }

    return { message: 'order deleted successfully' };
  }

  async getOrder(userId: string) {
    const order = await this.prisma.order.findMany({
      where: {
        userId: userId,
        orderItems: {
          some: {
            status: {
              title: 'processing',
            },
          },
        },
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
    const orderedProductsDetails: {
      productId: string;
      price: number;
      quantity: number;
      productQty: number;
    }[] = [];

    for (const cartItem of cart.cartItems) {
      const product = cartProducts.find(
        (product) => product.id === cartItem.productId,
      );

      if (!product) {
        throw new NotFoundException('sorry!. product is sold out!!');
      }

      const costOfOrderItem = cartItem.quantity * cartItem.price;
      totalOrderCost += costOfOrderItem;
      orderedProductsDetails.push({
        productId: cartItem.productId,
        price: cartItem.price,
        quantity: cartItem.quantity,
        productQty: product?.quantity,
      });
    }

    return { totalOrderCost, orderedProductsDetails };
  }
}
