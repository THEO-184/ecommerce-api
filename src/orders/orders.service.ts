import {
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartService } from 'src/cart/cart.service';
import { ProductsService } from 'src/products/products.service';
import { UpdateProductDto } from 'src/products/dto/products.dto';
import { InjectStripe } from 'nestjs-stripe';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OrdersService {
  constructor(
    @InjectStripe() private readonly stripeClient: Stripe,
    private prisma: PrismaService,
    private cartService: CartService,
    private productService: ProductsService,
    private config: ConfigService,
  ) {
    this.stripeClient = new Stripe(
      this.config.getOrThrow('STRIPE_ACCESS_KEY'),
      {
        typescript: true,
      },
    );
  }

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

    // updateProductQueries.push(this.stripeCheckout);
    let paymentIntent;
    let orderId = '';
    let paymentError;
    let success = false;
    try {
      paymentIntent = await this.stripeCheckout(data.totalCost);
      if (!paymentIntent) {
        throw new NotImplementedException();
      }
      const transactions = await this.prisma.$transaction(updateProductQueries);
      orderId = transactions[0].id;
      success = true;
    } catch (error) {
      console.log('error', error);
      paymentError = `Transaction Failed` + error.message;
    }

    return { success, orderId, paymentIntent, paymentError };
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

  async updateOrderStatus(orderId: string, orderStatusId: string) {
    console.log('orderStatusId', orderStatusId);
    await this.prisma.orderItem.update({
      where: {
        id: orderId,
      },
      data: {
        status: {
          connect: { id: orderStatusId },
        },
      },
    });

    return { message: 'order status updated successfully' };
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

  private stripeCheckout(totalCost: number) {
    const amountInCents = Math.round(totalCost * 100);
    return this.stripeClient.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      metadata: { integration_check: 'accept_a_payment' },
    });
  }
}
