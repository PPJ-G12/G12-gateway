import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { NatsModule } from 'src/transports/nast.module';

@Module({
  imports: [NatsModule],
  controllers: [AuthController],
  
})
export class AuthModule {}
