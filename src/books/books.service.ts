import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { EnumStatus } from '../enum/enum-status';
import { LogService } from '../services/log/log.service';
import { Room } from '../db/entities/room.entity';
import { CreatePagination } from './dto/req-pagination.dto';
import { PaginationService } from '../services/pagination/createPagination.service';
import { Op } from 'sequelize';
// import { ReqRoomId } from './dto/req-roomId.dto';
import { Reserve } from '../db/entities/reserve.entity';
import * as QRCode from 'qrcode';
import * as generatePayload from 'promptpay-qr';
import { ReqGenQrCode } from './dto/req-genQrCode.dto';
import * as moment from 'moment';
import { ReqBookSelectRoom } from './dto/req-booksSelectRoom.dto';
@Injectable()
export class BooksService implements OnApplicationBootstrap {
  private logger = new LogService(BooksService.name);

  constructor(
    @Inject('ROOMS_REPOSITORY')
    private roomDB: typeof Room,
    @Inject('RESERVES_REPOSITORY')
    private reserveDB: typeof Reserve,
    private paginationService: PaginationService,
  ) {}
  onApplicationBootstrap() {
    // const x: ReqBookSelectRoom = {
    //   checkInDate: '2022-2-11',
    //   checkOutDate: '2022-2-12',
    //   roomService: '0',
    //   roomId: '1',
    // };
    // this.bookSelected('asas', 'asdasd', x);
  }
  async api_pagination(createPagination: CreatePagination) {
    const tag = this.api_pagination.name;
    try {
      if (createPagination.guest === 1 || createPagination.guest === 2) {
        const count = await this.roomDB.count({
          where: {
            guest: {
              [Op.ne]: 3,
            },
          },
        });
        this.logger.debug('count ->', count);
        const calPaging = this.paginationService.paginationCal(
          count,
          createPagination.perPages,
          createPagination.currentPage,
        );
        const result = await this.roomDB.findAll({
          limit: calPaging.limit,
          offset: calPaging.skips,
          where: {
            guest: {
              [Op.ne]: 3,
            },
          },
        });
        for (let i = 0; i < result.length; i++) {
          // if (result[i] !== null) continue;
          result[i].image = `http://localhost:3000/public/${result[i].image}`;
        }
        const itemPerpage = result.length;

        const res = {
          totalItems: count,
          itemsPerPage: itemPerpage,
          totalPages: calPaging.totalPages,
          currentPage: createPagination.currentPage,
          datas: result,
        };
        //   const res = {
        //     resCode: EnumStatus.success,
        //     resData: await this.pagination(calPaging.skips, calPaging.limit),
        //     msg: '',
        //   };
        return res;
      }
      if (createPagination.guest === 3) {
        const count = await this.roomDB.count({
          where: {
            guest: {
              [Op.eq]: 3,
            },
          },
        });
        this.logger.debug('count ->', count);
        const calPaging = this.paginationService.paginationCal(
          count,
          createPagination.perPages,
          createPagination.currentPage,
        );
        const result = await this.roomDB.findAll({
          limit: calPaging.limit,
          offset: calPaging.skips,
          where: {
            guest: {
              [Op.eq]: 3,
            },
          },
        });
        for (let i = 0; i < result.length; i++) {
          // if (result[i] !== null) continue;
          result[i].image = `http://localhost:3000/public/${result[i].image}`;
        }
        const itemPerpage = result.length;

        const res = {
          totalItems: count,
          itemsPerPage: itemPerpage,
          totalPages: calPaging.totalPages,
          currentPage: createPagination.currentPage,
          datas: result,
        };
        //   const res = {
        //     resCode: EnumStatus.success,
        //     resData: await this.pagination(calPaging.skips, calPaging.limit),
        //     msg: '',
        //   };
        return res;
      }
    } catch (error) {
      this.logger.error(`${tag} -> `, error);
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  // async api_findRoomById(reqRoomId: ReqRoomId) {
  //   const tag = this.api_findRoomById.name;
  //   try {
  //     const x = this.roomDB.findOne({
  //       where: {
  //         room_id: reqRoomId.roomId,
  //       },
  //     });
  //     this.logger.debug('x ->', x);
  //     return x;
  //   } catch (error) {
  //     this.logger.error(`${tag} -> `, error);
  //     throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  async api_genQrCode(reqGenQrCode: ReqGenQrCode) {
    const tag = this.api_genQrCode.name;
    try {
      const result = await this.roomDB.findOne({
        where: {
          room_id: reqGenQrCode.roomId,
        },
      });
      const start = reqGenQrCode.checkInDate;
      const end = reqGenQrCode.checkOutDate;
      const startDate = moment(start, 'YYYY-MM-DD');
      const endDate = moment(end, 'YYYY-MM-DD');
      const night = endDate.diff(startDate, 'days');
      // const night = dayDiff - 1;
      // this.logger.debug('dayDiff ->', dayDiff);
      this.logger.debug('night ->', night);
      let price: number;
      if (reqGenQrCode.roomService === '0') {
        price = (result.price * night) / 2;
      }
      if (reqGenQrCode.roomService === '1') {
        price = (result.foodPrice * night) / 2;
      }

      const mobileNumber = '082-830-2070'; // เปลี่ยนเบอร์โทรศัพท์ตรงนี้
      const amount = Number(price); // จำนวนเงิน
      const payload = generatePayload(mobileNumber, { amount });
      const option = {
        color: {
          dark: '#000000', // สีตัว QRcode ตรงนี้กำหนดไว้เป็นสีน้ำ
          light: '#FFFFFF', // สีพื้นหลัง
        },
      };
      const randomChars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let name = '';
      for (let i = 0; i < 10; i++) {
        name += randomChars.charAt(
          Math.floor(Math.random() * randomChars.length),
        );
      }
      QRCode.toFile(`public/qrcode/${name}.png`, payload, option, (err) => {
        if (err) throw err;
        console.log('done');
      });
      // this.reserveDB.create();
      // logger.debug('x ->', x);
      const res = {
        resCode: EnumStatus.success,
        resData: `http://localhost:3000/qrcode/${name}.png`,
        msg: '',
      };
      return res;
    } catch (error) {
      this.logger.error(`${tag} -> `, error);
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async api_bookSelected(
    req: any,
    fileName: string,
    reqSelectData: ReqBookSelectRoom,
  ) {
    const tag = this.api_bookSelected.name;
    try {
      const res = {
        resCode: EnumStatus.success,
        resData: await this.bookSelected(req, fileName, reqSelectData),
        msg: '',
      };
      return res;
    } catch (error) {
      this.logger.error(`${tag} -> `, error);
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async bookSelected(
    req: any,
    reqFileName: string,
    reqSelectData: ReqBookSelectRoom,
  ) {
    const tag = this.bookSelected.name;
    try {
      const checkInDate = moment(
        reqSelectData.checkInDate,
        'YYYY-MM-DD',
      ).format('YYYY-MM-DD');
      const checkOutDate = moment(
        reqSelectData.checkOutDate,
        'YYYY-MM-DD',
      ).format('YYYY-MM-DD');
      const roomService = Number(reqSelectData.roomService);
      const userId = req.user.user_id;
      const fileName = reqFileName;
      const roomId = Number(reqSelectData.roomId);
      const data = {
        user_id: userId,
        room_id: roomId,
        roomService: roomService,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        slip: fileName,
        status: 0,
      };
      this.logger.debug(data);
      this.reserveDB.create(data);
      return this.reserveDB.create(data);
    } catch (error) {
      this.logger.error(`${tag} -> `, error);
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
