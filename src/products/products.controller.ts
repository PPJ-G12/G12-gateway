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
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to create product',
          details: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    try {
      return await this.client.send("findAllProducts", paginationDto).toPromise();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to retrieve products',
          details: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const idNumber = parseInt(id, 10);
    if (isNaN(idNumber)) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `Invalid ID format: ${id}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      return await this.client.send("findOneProduct", idNumber).toPromise();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `Product with ID ${idNumber} not found`,
          details: error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    try {
      const idNumber = parseInt(id, 10);
      if (isNaN(idNumber)) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: `Invalid ID format: ${id}`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      return await this.client.send("updateProduct", { id: idNumber, updateProductDto }).toPromise();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to update product',
          details: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const idNumber = parseInt(id, 10);
    if (isNaN(idNumber)) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `Invalid ID format: ${id}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      await this.client.send("deleteProduct", idNumber).toPromise();
      return { message: `Product with ID ${idNumber} deleted successfully` };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to delete product',
          details: error.message,
        },
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
