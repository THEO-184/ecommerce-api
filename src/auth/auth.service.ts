import { JwtService } from '@nestjs/jwt';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto, SignupDto } from 'src/auth/dto/user.dto';
import * as bcrypt from 'bcrypt';
import { IJwtPayload } from './interfaces';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async signUp(payload: SignupDto) {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(payload.password, salt);

    const user = await this.prisma.user.create({
      data: { ...payload, password },
    });

    delete user.password;

    return { user, message: 'user successfully created' };
  }

  async login(payload: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: payload.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const isPasswordCorrect = await bcrypt.compare(
      payload.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new UnauthorizedException();
    }

    const userPayload: IJwtPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };

    const token = this.createToken(userPayload);

    delete user.password;
    return { user, token };
  }

  private createToken(payload: IJwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
