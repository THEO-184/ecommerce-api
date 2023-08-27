import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsDto } from './dto/products.dto';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}
  @Get()
  getAllProducts() {
    return this.productsService.getAllProducts();
  }

  @Get(':id')
  getProduct(@Param('id') id: string) {
    return this.productsService.getProduct(id);
  }

  @Put(':id')
  updateProduct(@Body() payload: ProductsDto, @Param('id') id: string) {
    return this.productsService.updateProduct(id, payload);
  }
}
