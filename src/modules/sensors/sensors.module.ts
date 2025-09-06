import { Module } from '@nestjs/common';
import { SensorsService } from './sensors.service';
import { SensorsController } from './sensors.controller';
import { FiresModule } from '../fires/fires.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sensor } from './sensors.entity';

@Module({
  imports: [FiresModule, TypeOrmModule.forFeature([Sensor])],
  controllers: [SensorsController],
  providers: [SensorsService],
})
export class SensorsModule {}
