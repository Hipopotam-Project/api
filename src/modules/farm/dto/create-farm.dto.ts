import { IsArray, IsEmail, IsInt, IsString } from 'class-validator';

export class CreateFarmDto {
  @IsArray()
  location_field: Array<Array<number>>;

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
}
