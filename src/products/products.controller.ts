import { ConfigService } from '@nestjs/config';
import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
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
import { S3ServiceService } from 'src/s3-service/s3-service.service';

@Controller('products')
export class ProductsController {
  bucketName: string;

  constructor(
    private productsService: ProductsService,
    private config: ConfigService,
  ) {
    this.bucketName = this.config.get('BUCKET_NAME');
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createProduct(
    @Body() payload: Omit<ProductsDto, 'image'>,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000 * 1024 }),
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const randomFileName = crypto.randomBytes(32).toString('hex');
    await this.productsService.uploadProductImgToS3(
      file,
      this.bucketName,
      randomFileName,
    );

    return this.productsService.createProduct(payload, randomFileName);
  }

  @Get()
  getAllProducts() {
    return this.productsService.getAllProducts();
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
