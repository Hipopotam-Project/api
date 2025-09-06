import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Farm } from './farm.entity';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';

@Injectable()
export class FarmService {
  constructor(
    @InjectRepository(Farm)
    private readonly farmRepository: Repository<Farm>,
  ) {}

  async create(createFarmDto: CreateFarmDto): Promise<Farm> {
    const farm = this.farmRepository.create(createFarmDto);
    return this.farmRepository.save(farm);
  }

  async findAll(): Promise<Farm[]> {
    return this.farmRepository.find();
  }

  async findOne(id: string): Promise<Farm | null> {
    return this.farmRepository.findOne({ where: { id } });
  }

  async update(id: string, updateFarmDto: UpdateFarmDto): Promise<Farm | null> {
    await this.farmRepository.update(id, updateFarmDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.farmRepository.delete(id);
  }
}
