/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
export class CreatePagination {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly perPages: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly currentPage: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly guest: number;
}
