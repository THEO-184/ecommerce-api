import {
  Body,
  Controller,
  Delete,
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

  @Post()
  createOrder(@GetUser('sub') userId: string) {
    return this.orderService.createOrder(userId);
  }

  @Delete(':id')
  deleteOrder(@Param('id') id: string) {
    return this.orderService.deleteOrder(id);
  }
}
