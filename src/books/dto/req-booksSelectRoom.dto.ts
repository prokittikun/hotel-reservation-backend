/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
export class ReqBookSelectRoom {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly checkInDate: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly checkOutDate: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly roomService: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly roomId: string;
}
