import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { NATS_SERVICE } from "src/config";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { PaginationDto } from "src/common";
import { catchError } from "rxjs";

@Controller('products')
export class ProductsController {

  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) {
  }

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    try {
      return this.client.send("createProduct", createProductDto);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    try{
      return this.client.send("findAllProducts", paginationDto);
    } catch(error) {
      throw new RpcException(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.client.send("findOneProduct", { id }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Patch(':id')
  patchProduct(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.client.send("updateProduct", { id, updateProductDto }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.client.send("deleteProduct", { id }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
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
