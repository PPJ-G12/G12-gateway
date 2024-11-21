import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Inject ,HttpException, HttpStatus} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy } from '@nestjs/microservices';
import { PaginationDto } from 'src/common';

@Controller('products')
export class ProductsController {
  
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) {
  }
 
  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    try {
      return await this.client.send("createProduct", createProductDto).toPromise();
    } catch (error) {
      this.handleError(error);
    }
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    try {
      return await this.client.send("findAllProducts", paginationDto).toPromise();
    } catch (error) {
      this.handleError(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const idNumber = parseInt(id, 10);
    if (isNaN(idNumber)) {
      throw new HttpException(
        `Invalid ID format: ${id}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const product = await this.client.send("findOneProduct", idNumber).toPromise();
      if (!product) {
        throw new HttpException(
          `Product with ID ${idNumber} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      return product;
    } catch (error) {
      this.handleError(error);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    const idNumber = parseInt(id, 10);
    if (isNaN(idNumber)) {
      throw new HttpException(
        `Invalid ID format: ${id}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      return await this.client.send("updateProduct", { id: idNumber, updateProductDto }).toPromise();
    } catch (error) {
      this.handleError(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const idNumber = parseInt(id, 10);
    if (isNaN(idNumber)) {
      throw new HttpException(
        `Invalid ID format: ${id}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const result = await this.client.send("deleteProduct", idNumber).toPromise();
      if (!result) {
        throw new HttpException(
          `Product with ID ${idNumber} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      return { message: `Product with ID ${idNumber} deleted successfully` };
    } catch (error) {
      this.handleError(error);
    }
  }

  
  private handleError(error: any): never {
    if (error?.response?.status) {
      
      throw new HttpException(
        error.response.message || 'Unexpected error',
        error.response.status,
      );
    } else if (error.code === 'ECONNREFUSED') {
      
      throw new HttpException(
        'Service unavailable',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    } else if (error.message?.includes('timeout')) {
      
      throw new HttpException(
        'Request timed out',
        HttpStatus.GATEWAY_TIMEOUT,
      );
    } else {
      
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  


 
 /*  @Get('search')
  async search(@Query('name') name?: string) {
    try{
      return this.client.send("findByName",name);
    }catch(error){
      throw new RpcException(error);
    }
  }
 */
}
