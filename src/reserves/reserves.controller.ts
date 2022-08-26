import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreatePagination } from './dto/req-pagination.dto';
import { ReservesService } from './reserves.service';

@Controller('reserves')
@ApiTags('Reserves')
export class ReservesController {
  constructor(private readonly reservesService: ReservesService) {}

  @Post('pagination')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  create(@Req() req: any, @Body() reqPaginationReserves: CreatePagination) {
    return this.reservesService.api_pagination(req, reqPaginationReserves);
  }

  // @Get()
  // findAll() {
  //   return this.reservesService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.reservesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateReserveDto: UpdateReserveDto) {
  //   return this.reservesService.update(+id, updateReserveDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.reservesService.remove(+id);
  // }
}
