import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { NatsModule } from "../transports/nast.module";

@Module({
  imports: [NatsModule],
  controllers: [ProductsController],
  
})
export class ProductsModule {}
