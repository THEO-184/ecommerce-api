import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';

@Injectable()
export class S3ServiceService {
  private s3: S3Client;
  constructor(private config: ConfigService) {
    this.s3 = new S3Client({
      credentials: {
        accessKeyId: this.config.get('BUCKET_ACCESS_KEY'),
        secretAccessKey: this.config.get('BUCKET_SECRET_ACCESS_KEY'),
      },
      region: this.config.get('BUCKET_REGION'),
    });
  }

  getS3Client() {
    return this.s3;
  }

  async getAWSProducts(products: any[]) {
    console.log('products', products);
    // image in products or image in cart items
    const awsProducts = [];
    for (const product of products) {
      const command = new GetObjectCommand({
        Bucket: this.config.get('BUCKET_NAME'),
        Key: product.image || product?.product?.image,
      });
      // images from cart
      if (product?.product?.image) {
        const url = await this.getImageUrl(product.product.image, command);
        product.product.image = url;
      } else {
        // images from products
        const url = await this.getImageUrl(product.image, command);
        product.image = url;
      }
      awsProducts.push(product);
    }

    return awsProducts;
  }

  private async getImageUrl(imageUrl: string, command: GetObjectCommand) {
    return imageUrl.includes('https://')
      ? imageUrl
      : await getSignedUrl(this.s3, command);
  }
}
