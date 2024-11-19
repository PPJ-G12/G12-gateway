import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Inject } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PaginationDto } from 'src/common';

@Controller('products')
export class ProductsController {
  
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) {
  }
 
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.client.send("createProduct", createProductDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.client.send("findAllProducts", paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.client.send("findOneProduct",+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.client.send("updateProduct",{id, updateProductDto});
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.client.send("deleteProduct",+id);
  }

 
  @Get('search')
  async search(@Query('name') name?: string) {
    try{
      return this.client.send("findByName",name);
    }catch(error){
      throw new RpcException(error);
    }
  }

}
