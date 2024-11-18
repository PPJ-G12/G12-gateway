import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { NatsModule } from "../transports/nast.module";

@Module({
  imports: [NatsModule],
  controllers: [ProductsController],
  
})
export class ProductsModule {}
