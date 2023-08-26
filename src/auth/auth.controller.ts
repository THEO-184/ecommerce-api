import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto, SignupDto } from 'src/auth/dto/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signUp(@Body() payload: SignupDto) {
    return this.authService.signUp(payload);
  }

  @Post('signin')
  login(@Body() payload: LoginDto) {
    return this.authService.login(payload);
  }
}
