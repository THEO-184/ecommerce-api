import { ConfigService } from '@nestjs/config';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsDto, UpdateProductDto } from './dto/products.dto';
import * as crypto from 'crypto';

import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { S3Client } from '@aws-sdk/client-s3';

@Controller('products')
export class ProductsController {
  bucketName: string;
  s3: S3Client;

  constructor(
    private productsService: ProductsService,
    private config: ConfigService,
  ) {
    this.bucketName = this.config.get('BUCKET_NAME');
    this.s3 = new S3Client({
      credentials: {
        accessKeyId: this.config.get('BUCKET_ACCESS_KEY'),
        secretAccessKey: this.config.get('BUCKET_SECRET_ACCESS_KEY'),
      },
      region: this.config.get('BUCKET_REGION'),
    });
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createProduct(
    @Body() payload: Omit<ProductsDto, 'image'>,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const randomFileName = crypto.randomBytes(32).toString('hex');
    await this.productsService.uploadProductImgToS3(
      this.s3,
      file,
      this.bucketName,
      randomFileName,
    );

    return this.productsService.createProduct(payload, randomFileName);
  }

  @Get()
  getAllProducts() {
    return this.productsService.getAllProducts(this.s3);
  }

  @Get(':id')
  getProduct(@Param('id') id: string) {
    return this.productsService.getProduct(id);
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.productsService.deleteProduct(id);
  }

  @Put(':id')
  updateProduct(@Body() payload: UpdateProductDto, @Param('id') id: string) {
    return this.productsService.updateProduct(id, payload);
  }
}
