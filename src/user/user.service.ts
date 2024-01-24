import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUser(id: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        cart: {
          select: {
            id: true,
            cartItems: true,
          },
        },
      },
    });

    return user;
  }
}
