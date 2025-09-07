import { Transform } from 'class-transformer';
import {
  Allow,
  IsArray,
  IsEmail,
  IsInt,
  IsNumber,
  IsString,
} from 'class-validator';
import { isFloat16Array } from 'util/types';

export class CoordinateDto {
  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
}

export class CreateFarmDto {
  @Allow()
  location_field: number[][];

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsInt()
  edur_rogat: number;

  @IsInt()
  dreben_rogat: number;

  @IsInt()
  svine: number;

  @IsInt()
  konevudstvo: number;

  @IsInt()
  pticevudstvo: number;

  @IsInt()
  workers: number;
}
