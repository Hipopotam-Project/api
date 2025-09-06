import { MoreThan } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateFireDto } from './dto/create-fire.dto';
import { UpdateFireDto } from './dto/update-fire.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Fire } from './entities/fire.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FiresService {
  registerFire(createFireDto: CreateFireDto) {
    const fire = this.firesRepository.create({
      lat: createFireDto.lat,
      lng: createFireDto.lng,
      farmer_id: createFireDto.farmer_id,
      expiresAt: new Date(new Date().getTime() + 24 * 60 * 60000), // 24 hours from now
    });
    return this.firesRepository.save(fire);
  }
  constructor(
    @InjectRepository(Fire) private firesRepository: Repository<Fire>,
  ) {}

  create(createFireDto: CreateFireDto) {
    const fire = this.firesRepository.create({
      lat: createFireDto.lat,
      lng: createFireDto.lng,
      expiresAt: new Date(new Date().getTime() + 24 * 60 * 60000), // 24 hours from now
    });
    return this.firesRepository.save(fire);
  }

  createFromSensor(lat: string, lng: string, sensor_id: string) {
    const newFire = this.firesRepository.create({
      lat,
      lng,
      sensor_id,
      expiresAt: new Date(new Date().getTime() + 24 * 60 * 60000), // 24 hours from now
    });
    return this.firesRepository.save(newFire);
  }

  // isSensorOnFire(sensor_id: string) {
  //   return this.firesRepository.exists({
  //     where: { sensor_id, expiresAt: MoreThan(new Date()) },
  //   });
  // }

  deleteForSensor(sensor_id: string) {
    return this.firesRepository.update(
      { sensor_id, expiresAt: MoreThan(new Date()) },
      { expiresAt: new Date() },
    );
  }

  findAll() {
    return `This action returns all fires`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fire`;
  }

  update(id: number, updateFireDto: UpdateFireDto) {
    return `This action updates a #${id} fire`;
  }

  async remove(id: string) {
    await this.firesRepository.update(id, { expiresAt: new Date() });
  }
}
