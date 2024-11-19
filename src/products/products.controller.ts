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
  async findOne(@Param('id') id: string) {
    const idNumber = parseInt(id, 10); // Convertir el ID a número
    if (isNaN(idNumber)) {
      throw new RpcException(`Invalid ID format: ${id}`); // Manejar error si no es un número
    }

    return this.client.send("findOneProduct", idNumber).toPromise(); // Enviar como número
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.client.send("updateProduct",{id, updateProductDto});
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const idNumber = parseInt(id, 10);
    if (isNaN(idNumber)) {
      throw new RpcException(`Invalid ID format: ${id}`);
    }
    return this.client.send("deleteProduct", idNumber).toPromise();
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
