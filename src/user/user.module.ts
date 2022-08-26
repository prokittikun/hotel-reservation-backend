import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { databaseProviders } from '../db/entities/db.provider';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
  ],
  controllers: [UserController],
  providers: [UserService, ...databaseProviders],
})
export class UserModule {}
