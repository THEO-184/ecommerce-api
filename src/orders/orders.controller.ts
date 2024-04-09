import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { UpdateOrderStatusDto } from './dto/order.dto';
import GetUser from 'src/auth/decorators/user.decorator';
import { UserEnum } from '@prisma/client';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { IJwtPayload } from 'src/auth/interfaces';

@UseGuards(AuthGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private orderService: OrdersService) {}

  @Get()
  getOrder(@GetUser('sub') userId: string) {
    return this.orderService.getOrder(userId);
  }

  @Post()
  createOrder(@GetUser() user: IJwtPayload) {
    return this.orderService.createOrder(user);
  }

  @Delete(':id')
  cancelOrder(@Param('id') orderId: string, @GetUser('sub') userId: string) {
    return this.orderService.cancelOrder(orderId, userId);
  }

  @Patch(':id')
  @Roles(UserEnum.admin)
  updateOrder(
    @Param('id') orderId: string,
    @Body() { orderStatusId }: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateOrderStatus(orderId, orderStatusId);
  }
}
