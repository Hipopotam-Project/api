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
}
