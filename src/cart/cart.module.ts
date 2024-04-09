import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { ProductsModule } from 'src/products/products.module';
import { S3ServiceService } from 'src/aws-services/s3-service.service';

@Module({
  imports: [ProductsModule],
  controllers: [CartController],
  providers: [CartService, S3ServiceService],
  exports: [CartService],
})
export class CartModule {}
