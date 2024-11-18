import { Module } from "@nestjs/common";
import { OrdersModule } from "./orders/orders.module";
import { NatsModule } from "./transports/nast.module";
import { ProductsModule } from "./products/products.module";

@Module({
  imports: [OrdersModule, NatsModule, ProductsModule]
})
export class AppModule {
}
