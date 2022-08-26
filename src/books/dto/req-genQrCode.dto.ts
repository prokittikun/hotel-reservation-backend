/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class ReqGenQrCode {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly roomId: number;

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
}
