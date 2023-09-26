import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CartModule } from 'src/cart/cart.module';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [CartModule, ProductsModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
