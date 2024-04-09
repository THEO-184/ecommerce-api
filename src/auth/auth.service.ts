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
import { SeSServiceService } from 'src/aws-services/ses-service/ses-service.service';
import { ListIdentitiesCommand, SESClient } from '@aws-sdk/client-ses';

@Injectable()
export class AuthService {
  private SeSClient: SESClient;
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private SesService: SeSServiceService,
  ) {
    this.SeSClient = this.SesService.getSESClient();
  }

  async signUp(payload: SignupDto) {
    const verifyEmail = await this.SesService.verifyEmailAddress(payload.email);
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(payload.password, salt);

    const user = await this.prisma.user.create({
      data: { ...payload, password },
    });

    delete user.password;

    return { user, message: 'user successfully created', verifyEmail };
  }

  async login(payload: LoginDto) {
    const verifiedUsers = await this.getVerifiedUsers();

    if (!verifiedUsers.response.Identities.includes(payload.email)) {
      throw new UnauthorizedException();
    }

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
      type: user.type,
    };

    const token = this.createToken(userPayload);

    delete user.password;
    return { user, token, verifiedUsers };
  }

  private async getVerifiedUsers() {
    const command = new ListIdentitiesCommand({ IdentityType: 'EmailAddress' });

    try {
      const response = await this.SeSClient.send(command);
      return { response };
    } catch (error) {
      throw error;
    }
  }

  private createToken(payload: IJwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
