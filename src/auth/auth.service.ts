import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignupDto } from 'src/auth/dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signUp(payload: SignupDto) {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(payload.password, salt);

    const user = await this.prisma.user.create({
      data: { ...payload, password },
    });

    delete user.password;

    return { user, message: 'user successfully created' };
  }
}
