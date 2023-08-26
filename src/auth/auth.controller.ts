import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/auth/dto/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  signUp(@Body() payload: CreateUserDto) {
    return this.authService.signUp(payload);
  }
}
