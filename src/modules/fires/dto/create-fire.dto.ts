import { IsString } from 'class-validator';

export class CreateFireDto {
  @IsString()
  lat: string;

  @IsString()
  lng: string;
}
