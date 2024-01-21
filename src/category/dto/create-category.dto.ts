import { PartialType } from '@nestjs/mapped-types';
import { CategoryEnum } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class CreateCategoryDto {
  @IsEnum(CategoryEnum, { message: 'not a valid title type' })
  title: CategoryEnum;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
