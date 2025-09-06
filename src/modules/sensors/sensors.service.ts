import { Injectable } from '@nestjs/common';
import { InitializeSensorDTO } from './dto/initialize-sensor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sensor } from './sensors.entity';
import { Repository } from 'typeorm';
import { FiresService } from '../fires/fires.service';

@Injectable()
export class SensorsService {
  constructor(
    @InjectRepository(Sensor)
    private readonly sensorRepository: Repository<Sensor>,
    private readonly firesService: FiresService,
  ) {}

  isMasterKeyCorrect(key: string) {
    return key === process.env.MASTER_KEY;
  }

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

  async updateSensorData(
    sensor_id: string,
    temp: number,
    humidity: number,
    fireDetected: boolean,
  ) {
    const updated = await this.sensorRepository.update(sensor_id, {
      temp,
      humidity,
      fire_detected: fireDetected,
    });

    if (!fireDetected) return;

    const data = await this.sensorRepository.findOne({
      where: { id: sensor_id },
    });

    await this.firesService.createFromSensor(data!.lat, data!.lng, sensor_id);
  }
}
