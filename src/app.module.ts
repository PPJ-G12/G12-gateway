import { Module } from "@nestjs/common";
import { OrdersModule } from "./orders/orders.module";
import { NatsModule } from "./transports/nast.module";
import { ProductsModule } from "./products/products.module";
import { ProfileUsersModule } from "./profile-users/profile-users.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [OrdersModule, NatsModule, ProductsModule, ProfileUsersModule,AuthModule]
})
export class AppModule {
}
