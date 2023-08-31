import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ProductsDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  price: number;

  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  quantity: number;

  @IsString()
  categoryId: never;

  @IsString()
  image: string;
}

export class UpdateProductDto extends PartialType(ProductsDto) {}
