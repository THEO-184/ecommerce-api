import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductsDto } from './dto/products.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async getAllProducts() {
    const products = await this.prisma.product.findMany({});

    return { count: products.length, data: products };
  }

  async getProduct(id: string) {
    const product = await this.prisma.product.findUniqueOrThrow({
      where: {
        id: id,
      },
    });

    return product;
  }

  async updateProduct(id: string, payload: ProductsDto) {
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
}
