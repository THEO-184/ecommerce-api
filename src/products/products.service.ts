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
import { S3ServiceService } from 'src/s3-service/s3-service.service';

@Injectable()
export class ProductsService {
  s3: S3Client;
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private s3Service: S3ServiceService,
  ) {
    this.s3 = this.s3Service.getS3Client();
  }

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

  async getAllProducts() {
    const products = await this.prisma.product.findMany({
      where: {
        quantity: {
          gte: 1,
        },
      },

      orderBy: {
        updatedAt: 'desc',
      },

      include: {
        cartegory: {
          select: {
            id: true,
            title: true,
          },
        },
        reviews: true,
      },
    });

    const productsWithImgUrls = await this.s3Service.getAWSProducts(products);

    return { count: productsWithImgUrls.length, data: productsWithImgUrls };
  }

  async getProduct(id: string) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: id,
      },
      include: {
        cartegory: {
          select: {
            id: true,
            title: true,
          },
        },
        reviews: {
          select: {
            id: true,
            description: true,
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
    });

    const command = new GetObjectCommand({
      Bucket: this.config.get('BUCKET_NAME'),
      Key: product.image,
    });

    const url = await getSignedUrl(this.s3, command);
    product.image = url;

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

  async getProductsByIds(IDs: string[]) {
    const products = await this.prisma.product.findMany({
      where: {
        id: {
          in: [...IDs],
        },
        quantity: {
          gt: 0,
        },
      },
    });
    return products;
  }

  async uploadProductImgToS3(
    file: Express.Multer.File,
    bucketName: string,
    fileName: string,
  ) {
    console.log('uploading product img to aws...');
    console.log('file', file);
    console.log('bucketName', bucketName);

    const buffer = await sharp(file.buffer)
      .resize({ height: 1920, width: 1080, fit: 'contain' })
      .toBuffer();
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: buffer,
      ContentType: file.mimetype,
    });

    await this.s3.send(command);
    console.log('uploaded..');
  }
}
