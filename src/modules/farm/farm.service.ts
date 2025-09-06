import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Farm } from './farm.entity';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { JoinFarm } from './join-farm.entity';
import { Logger } from 'nestjs-pino';

@Injectable()
export class FarmService {
  constructor(
    @InjectRepository(Farm)
    private readonly farmRepository: Repository<Farm>,
    @InjectRepository(JoinFarm)
    private readonly joinFarmRepo: Repository<JoinFarm>,
  ) {}

  private async createJoinFarmCodes(farmId: string, numberOfWorkers: number) {
    console.log('farmID', farmId);
    const codes: JoinFarm[] = [];
    for (let i = 0; i < numberOfWorkers; i++) {
      const code = this.joinFarmRepo.create({
        farm_id: farmId,
        isAdmin: false,
      });
      codes.push(code);
    }
    const adminCode = this.joinFarmRepo.create({
      farm_id: farmId,
      isAdmin: true,
    });
    codes.push(adminCode);
    // console.log(codes);
    await this.joinFarmRepo.save(codes);
  }

  async deleteJoinFarmByKey(id: number): Promise<void> {
    await this.joinFarmRepo.delete({ key: id });
  }

  async getJoinFarmByCode(code: number): Promise<JoinFarm | null> {
    return this.joinFarmRepo.findOne({ where: { key: code } });
  }

  async create(createFarmDto: CreateFarmDto): Promise<Farm> {
    const farm = this.farmRepository.create({ ...createFarmDto });
    const record = await this.farmRepository.save(farm);
    await this.createJoinFarmCodes(record.id, createFarmDto.workers);
    return record;
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
