import { Body, Controller, Post } from '@nestjs/common';
import { SignupDto } from 'src/auth/dto/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  signUp(@Body() payload: SignupDto) {
    return this.authService.signUp(payload);
  }
}
