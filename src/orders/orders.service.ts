import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderDto } from './dto/order.dto';
import { CartService } from 'src/cart/cart.service';
import { Prisma } from '@prisma/client';
import { ProductsService } from 'src/products/products.service';
import { UpdateProductDto } from 'src/products/dto/products.dto';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private cartService: CartService,
    private productService: ProductsService,
  ) {}

  async createOrder(userId: string) {
    const data = await this.getCartDetails(userId);

    const orderStatus = await this.prisma.orderStatus.findFirstOrThrow({
      where: {
        title: 'pending',
      },
    });

    // create order
    const order = this.prisma.orderItem.create({
      data: {
        total: data.totalCost,
        status: {
          connect: {
            id: orderStatus.id,
          },
        },

        items: {
          create: data.cartItems.map(
            ({ price, product: { id }, quantity }) => ({
              price,
              productId: id,
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

    const updateProductQueries: any[] = [order];
    // update product inventory
    for (const item of data.cartItems) {
      const query = this.updateProduct(item.product.id, {
        quantity: item.quantity,
      });
      updateProductQueries.push(query);
    }

    const transactions = await this.prisma.$transaction(updateProductQueries);

    return { message: 'order created successfully', transactions };
  }

  private updateProduct(id: string, payload: UpdateProductDto) {
    return this.prisma.product.update({
      where: {
        id,
      },
      data: {
        quantity: {
          decrement: payload.quantity,
        },
      },
    });
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

  private async getCartDetails(userId: string) {
    const { data } = await this.cartService.getCartItems(userId);

    for (const item of data.cartItems) {
      if (item.quantity > item.product.quantity) {
        throw new NotFoundException(
          `sorry!. Only ${item.product.quantity} of ${item.product.title} are in stock!.`,
        );
      }
      if (!item.product.quantity) {
        throw new NotFoundException(
          `sorry!. ${item.product.title} has been sold out`,
        );
      }
    }

    return data;
  }
}
