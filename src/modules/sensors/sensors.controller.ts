import { Body, Controller, Post } from '@nestjs/common';
import { SensorsService } from './sensors.service';
import { InitializeSensorDTO } from './dto/initialize-sensor.dto';

@Controller('sensor')
export class SensorsController {
  constructor(private readonly sensorsService: SensorsService) {}

  @Post('initialize')
  initializeSensor(@Body() initializeDto: InitializeSensorDTO) {
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
    },
  ) {
    return this.sensorsService.updateSensorData(
      updateDto.sensor_id,
      updateDto.temp,
      updateDto.humidity,
      updateDto.fireDetected,
    );
  }
}
