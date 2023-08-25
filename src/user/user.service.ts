import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor() {}

  async createUser(payload: CreateUserDto) {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(payload.password, salt);

    return { user: payload, password };
  }
}
