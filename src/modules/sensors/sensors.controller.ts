import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { SensorsService } from './sensors.service';
import { InitializeSensorDTO } from './dto/initialize-sensor.dto';

@Controller('sensor')
export class SensorsController {
  constructor(private readonly sensorsService: SensorsService) {}

  @Post('initialize')
  initializeSensor(@Body() initializeDto: InitializeSensorDTO) {
    if (!this.sensorsService.isMasterKeyCorrect(initializeDto.master_key))
      throw new UnauthorizedException('Master key does not match');
    return this.sensorsService.initializeSensor(initializeDto);
  }

  @Post('data')
  updateSensorData(
    @Body()
    updateDto: {
      sensor_id: string;
      temp: number;
      humidity: number;
      fireDetected: boolean;
      master_key: string;
    },
  ) {
    if (!this.sensorsService.isMasterKeyCorrect(updateDto.master_key))
      throw new UnauthorizedException('Master key does not match');
    return this.sensorsService.updateSensorData(
      updateDto.sensor_id,
      updateDto.temp,
      updateDto.humidity,
      updateDto.fireDetected,
    );
  }
}
