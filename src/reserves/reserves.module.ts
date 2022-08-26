import { Module } from '@nestjs/common';
import { ReservesService } from './reserves.service';
import { ReservesController } from './reserves.controller';
import { databaseProviders } from '../db/entities/db.provider';
import { PaginationService } from '../services/pagination/createPagination.service';
@Module({
  controllers: [ReservesController],
  providers: [ReservesService, ...databaseProviders, PaginationService],
})
export class ReservesModule {}
