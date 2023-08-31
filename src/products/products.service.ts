import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductsDto, UpdateProductDto } from './dto/products.dto';
import {
  PutObjectCommand,
  S3Client,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as sharp from 'sharp';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async createProduct(payload: Omit<ProductsDto, 'image'>, productImg: string) {
    const productPayload = {
      ...payload,
      image: productImg,
      price: Number(payload.price),
      quantity: Number(payload.quantity),
    };
    const product = await this.prisma.product.create({
      data: productPayload,
    });

    return { product, message: 'Product created successfully ' };
  }

  async getAllProducts(s3: S3Client) {
    const products = await this.prisma.product.findMany({
      where: {
        quantity: {
          gte: 1,
        },
      },
      include: {
        cartegory: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    let productsWithImgUrls = [
      ...products.filter((product) => product.image.includes('https://')),
    ];
    const awsProducts = [
      ...products.filter((product) => !product.image.includes('https://')),
    ];

    for (const product of awsProducts) {
      const command = new GetObjectCommand({
        Bucket: this.config.get('BUCKET_NAME'),
        Key: product.image,
      });
      const url = await getSignedUrl(s3, command);
      product.image = url;
      productsWithImgUrls.push(product);
    }

    return { count: productsWithImgUrls.length, data: productsWithImgUrls };
  }

  async getProduct(id: string) {
    const product = await this.prisma.product.findUniqueOrThrow({
      where: {
        id: id,
      },
    });

    return product;
  }

  async updateProduct(id: string, payload: UpdateProductDto) {
    await this.prisma.product.update({
      where: {
        id,
      },
      data: { ...payload },
    });

    return { message: 'product successfully updated' };
  }

  async deleteProduct(id: string) {
    await this.prisma.product.delete({
      where: {
        id,
      },
    });

    return { message: 'product successfully deleted' };
  }

  async uploadProductImgToS3(
    s3: S3Client,
    file: Express.Multer.File,
    bucketName: string,
    fileName: string,
  ) {
    console.log('uploading product img to aws...');

    const buffer = await sharp(file.buffer)
      .resize({ height: 1920, width: 1080, fit: 'contain' })
      .toBuffer();
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: buffer,
      ContentType: file.mimetype,
    });

    await s3.send(command);
    console.log('uploaded..');
  }
}
