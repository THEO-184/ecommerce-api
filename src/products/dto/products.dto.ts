import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ProductsDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsNumber()
  quantity: number;

  @IsString()
  categoryId: never;

  @IsString()
  image: string;
}

export class UpdateProductDto extends PartialType(ProductsDto) {}
