import { Injectable } from '@nestjs/common';
import { OrderDto } from 'src/orders/dto/order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderStatusDto } from './dto/orderStatus.dto';

@Injectable()
export class OrderStatusService {
  constructor(private prisma: PrismaService) {}

  async createStatus(payload: OrderStatusDto) {
    const orderStatus = await this.prisma.orderStatus.create({
      data: {
        title: payload.title,
        description: payload.description,
      },
    });
    return { message: 'order successfully created', data: orderStatus };
  }

  async getOrderStatus() {
    const orderStatus = await this.prisma.orderStatus.findMany({
      select: {
        id: true,
        description: true,
        title: true,
      },
    });

    return { count: orderStatus.length, data: orderStatus };
  }
}
