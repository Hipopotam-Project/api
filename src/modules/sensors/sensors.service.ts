import { Injectable } from '@nestjs/common';
import { InitializeSensorDTO } from './dto/initialize-sensor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sensor } from './sensors.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SensorsService {
  constructor(
    @InjectRepository(Sensor)
    private readonly sensorRepository: Repository<Sensor>,
  ) {}

  async initializeSensor(initializeDto: InitializeSensorDTO) {
    const doesExist = await this.sensorRepository.exists({
      where: { id: initializeDto.sensor_id },
    });
    if (doesExist) return;
    const sensor = this.sensorRepository.create({
      id: initializeDto.sensor_id,
      farm: { id: initializeDto.farm_id },
      lat: initializeDto.lat,
      lng: initializeDto.lng,
    });
    return this.sensorRepository.save(sensor);
  }
}
