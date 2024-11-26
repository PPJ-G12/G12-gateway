import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
/* import { NATS_SERVICE } from 'src/config'; */
import { NatsModule } from 'src/transports/nast.module';

@Module({
  imports: [
    NatsModule,
    JwtModule.register({
      secret: 'JWT_SECRET', 
      signOptions: { expiresIn: '1h' }, 
    }),
  ],
  controllers: [AuthController],
  providers: [],
})
export class AuthModule {}
