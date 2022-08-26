import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { LogService } from './services/log/log.service';
import { DatabaseModule } from './db/database.module';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';
import { ReservesModule } from './reserves/reserves.module';

@Module({
  imports: [
    UserModule,
    DatabaseModule,
    AuthModule,
    BooksModule,
    ReservesModule,
  ],
  controllers: [AppController],
  providers: [AppService, LogService],
})
export class AppModule {}
