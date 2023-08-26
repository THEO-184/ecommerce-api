import { Injectable } from '@nestjs/common';
import { SignupDto } from '../auth/dto/user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(payload: SignupDto) {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(payload.password, salt);

    const user = await this.prisma.user.create({
      data: { ...payload, password },
    });

    delete user.password;

    return { user, message: 'user successfully created' };
  }
}
