import { Module } from '@nestjs/common';
import { ProfileUsersController } from './profile-users.controller';
import { NatsModule } from 'src/transports/nast.module';

@Module({
  imports: [NatsModule],
  controllers: [ProfileUsersController],  
})
export class ProfileUsersModule {}
