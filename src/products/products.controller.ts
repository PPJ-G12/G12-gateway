import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { NATS_SERVICE } from "src/config";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { PaginationDto } from "src/common";
import { catchError } from "rxjs";
import { CreateProductDto, FindProductByNameDto, UpdateProductDto } from "./dto";

@Controller('products')
export class ProductsController {

  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) {
  }

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.client.send("createProduct", createProductDto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.client.send("findAllProducts", paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
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
  remove(@Param('id') id: string) {
    return this.client.send("deleteProduct", { id }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
}
