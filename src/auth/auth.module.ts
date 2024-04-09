import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SeSServiceService } from 'src/aws-services/ses-service/ses-service.service';

@Module({
  providers: [AuthService, SeSServiceService],
  controllers: [AuthController],
})
export class AuthModule {}
