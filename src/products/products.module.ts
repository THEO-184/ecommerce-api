import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { S3ServiceService } from 'src/aws-services/s3-service.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, S3ServiceService],
  exports: [ProductsService],
})
export class ProductsModule {}
