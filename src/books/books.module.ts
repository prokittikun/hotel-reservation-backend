import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { databaseProviders } from '../db/entities/db.provider';
import { PaginationService } from '../services/pagination/createPagination.service';

@Module({
  controllers: [BooksController],
  providers: [BooksService, ...databaseProviders, PaginationService],
})
export class BooksModule {}
