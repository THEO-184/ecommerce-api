import { ForbiddenException, Injectable } from '@nestjs/common';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from './dto/create-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateCategoryDto) {
    const categories = await this.prisma.category.create({ data });
    return { message: 'category created successfully', data: categories };
  }

  async findAll() {
    const categories = await this.prisma.category.findMany({
      include: {
        _count: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return { count: categories.length, data: categories };
  }

  async remove(id: string) {
    const category = await this.prisma.category.deleteMany({
      where: {
        AND: [
          {
            id,
          },
          {
            products: {
              none: {},
            },
          },
        ],
      },
    });

    if (category.count === 0) {
      throw new ForbiddenException(
        'products have been assigned to this category',
      );
    } else {
      return { message: `category successfully deleted` };
    }
  }

  async findOne(id: string) {
    return await this.prisma.category.findUnique({
      where: {
        id,
      },
      include: {
        products: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
    });
  }

  async update(id: string, data: UpdateCategoryDto) {
    const category = await this.prisma.category.update({
      where: {
        id,
      },
      data,
    });
    return { message: 'category successfully updated', data: category };
  }
}
