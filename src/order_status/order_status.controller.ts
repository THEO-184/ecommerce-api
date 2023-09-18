import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrderDto } from 'src/orders/dto/order.dto';
import { OrderStatusService } from './order_status.service';
import { OrderStatusDto } from './dto/orderStatus.dto';

@Controller('order-status')
export class OrderStatusController {
  constructor(private orderStatus: OrderStatusService) {}

  @Post()
  createStatus(@Body() dto: OrderStatusDto) {
    return this.orderStatus.createStatus(dto);
  }

  @Get()
  getOrderStatus() {
    return this.orderStatus.getOrderStatus();
  }
}
