import { Injectable } from '@nestjs/common';
import { SignupDto } from '../auth/dto/user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
}
