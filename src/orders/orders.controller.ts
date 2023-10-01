import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { OrderDto } from './dto/order.dto';
import GetUser from 'src/auth/decorators/user.decorator';

@UseGuards(AuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private orderService: OrdersService) {}

  @Get()
  getOrder(@GetUser('sub') userId: string) {
    return this.orderService.getOrder(userId);
  }

  @Post()
  createOrder(@GetUser('sub') userId: string) {
    return this.orderService.createOrder(userId);
  }

  @Delete(':id')
  cancelOrder(@Param('id') orderId: string, @GetUser('sub') userId: string) {
    return this.orderService.cancelOrder(orderId, userId);
  }
}
