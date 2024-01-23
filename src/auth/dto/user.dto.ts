import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { OmitType } from '@nestjs/mapped-types';

export class SignupDto {
  @IsEmail()
  @Matches(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, {
    message: 'invalid email format',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(30)
  password: string;

  @IsString()
  @Matches(/^0[0-9]{9}$/, {
    message: 'Invalid telephone format. Use 0xxxxxxxxx.',
  })
  telephone: string;
}

export class LoginDto extends OmitType(SignupDto, [
  'username',
  'telephone',
] as const) {}
