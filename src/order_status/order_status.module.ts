import { Module } from '@nestjs/common';
import { OrderStatusController } from './order_status.controller';
import { OrderStatusService } from './order_status.service';

@Module({
  controllers: [OrderStatusController],
  providers: [OrderStatusService]
})
export class OrderStatusModule {}
