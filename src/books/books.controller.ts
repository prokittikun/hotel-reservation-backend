import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageFileFilter } from './../until/file-upload';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { BooksService } from './books.service';
import { ReqGenQrCode } from './dto/req-genQrCode.dto';
import { CreatePagination } from './dto/req-pagination.dto';
// import { ReqRoomId } from './dto/req-roomId.dto';
import * as path from 'path';
import { LogService } from '../services/log/log.service';
import { ReqBookSelectRoom } from './dto/req-booksSelectRoom.dto';
import { uuid } from 'uuidv4';
import { AuthGuard } from '@nestjs/passport';

@Controller('books')
@ApiTags('Books')
export class BooksController {
  private logger = new LogService(BooksController.name);

  constructor(private readonly booksService: BooksService) {}

  @Post('pagination')
  async login(@Body() ReqPaginationRoom: CreatePagination) {
    return this.booksService.api_pagination(ReqPaginationRoom);
  }

  @Post('sendSlip')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('photoUrl', {
      storage: diskStorage({
        destination: `${path.resolve(__dirname, '../', '../', 'public/slip')}`,
        filename: (req, file, cb) => {
          cb(null, uuid() + path.extname(file.originalname));
        },
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async booksRoom(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: ReqBookSelectRoom,
  ) {
    console.log(req);

    return this.booksService.api_bookSelected(req, file.filename, body);
  }

  @Post('genQrCode')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async genQrCode(@Body() reqGenQrCode: ReqGenQrCode) {
    return this.booksService.api_genQrCode(reqGenQrCode);
  }
}
