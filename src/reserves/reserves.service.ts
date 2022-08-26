import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  OnApplicationBootstrap,
  UnauthorizedException,
} from '@nestjs/common';
import { PaginationService } from '../services/pagination/createPagination.service';
import { LogService } from '../services/log/log.service';
import { CreatePagination } from './dto/req-pagination.dto';
import { Reserve } from '../db/entities/reserve.entity';
import { Room } from '../db/entities/room.entity';
import { EnumStatus } from '../enum/enum-status';

@Injectable()
export class ReservesService implements OnApplicationBootstrap {
  private logger = new LogService(ReservesService.name);

  constructor(
    @Inject('ROOMS_REPOSITORY')
    private roomDB: typeof Room,
    @Inject('RESERVES_REPOSITORY')
    private reserveDB: typeof Reserve,
    private paginationService: PaginationService,
  ) {}
  onApplicationBootstrap() {
    // const x: CreatePagination = {
    //   perPages: 10,
    //   currentPage: 1,
    // };
    // this.api_pagination(x);
  }
  async api_pagination(req: any, reqPaginationReserves: CreatePagination) {
    const tag = this.api_pagination.name;
    try {
      if (!req.user.user_id) throw new UnauthorizedException();
      const userId = Number(req.user.user_id);
      const count = await this.reserveDB.count({
        where: {
          user_id: userId,
        },
      });
      this.logger.debug('count ->', count);
      const calPaging = this.paginationService.paginationCal(
        count,
        reqPaginationReserves.perPages,
        reqPaginationReserves.currentPage,
      );
      const result = await this.reserveDB.findAll({
        // attributes: { exclude: ['roomService'] }, //{ exclude: ['roomService'] }
        limit: calPaging.limit,
        offset: calPaging.skips,
        where: {
          user_id: userId,
        },
      });

      for (const [i, iterator] of result.entries()) {
        if (!iterator) return;
        const roomId = Number(iterator.room_id);
        const x = await this.roomDB.findOne({
          where: {
            room_id: roomId,
          },
        });
        if (!x) return;
        result[i] = Object.assign(JSON.parse(JSON.stringify(result[i])), {
          roomInfo: x,
        });
      }
      this.logger.debug('result ->', result);
      const itemPerpage = result.length;

      const res = {
        totalItems: count,
        itemsPerPage: itemPerpage,
        totalPages: calPaging.totalPages,
        currentPage: reqPaginationReserves.currentPage,
        datas: result,
      };
      return res;
    } catch (error) {
      this.logger.error(`${tag} -> `, error);
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // async pagin(reqPaginationReserves: CreatePagination) {
  //   const tag = this.api_pagination.name;
  //   try {
  //     const res = {
  //       // resCode: EnumStatus.success,
  //       // resData: await this.bookSelected(req, fileName, reqSelectData),
  //       // msg: '',
  //     };
  //     return res;
  //   } catch (error) {
  //     this.logger.error(`${tag} -> `, error);
  //     throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  // findAll() {
  //   return `This action returns all reserves`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} reserve`;
  // }

  // update(id: number, updateReserveDto: UpdateReserveDto) {
  //   return `This action updates a #${id} reserve`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} reserve`;
  // }
}
