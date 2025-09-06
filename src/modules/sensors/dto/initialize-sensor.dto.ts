import { IsString } from 'class-validator';

export class InitializeSensorDTO {
  @IsString()
  sensor_id: string;

  @IsString()
  farm_id: string;

  @IsString()
  lat: string;

  @IsString()
  lng: string;
}
