import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Farmer } from './farmers.entity';

@Injectable()
export class FarmersService {
  constructor(
    @InjectRepository(Farmer) private readonly repo: Repository<Farmer>,
  ) {}

  async create(email: string, passwordHash: string): Promise<Farmer> {
    const exists = await this.repo.findOne({
      where: { email: email.toLowerCase() },
    });
    if (exists) throw new ConflictException('Email already in use');
    const farmer = this.repo.create({
      email: email.toLowerCase(),
      passwordHash,
    });
    return this.repo.save(farmer);
  }

  findByEmail(email: string): Promise<Farmer | null> {
    return this.repo.findOne({ where: { email: email.toLowerCase() } });
  }

  findById(id: string): Promise<Farmer | null> {
    return this.repo.findOne({ where: { id } });
  }

  async setRefreshTokenHash(farmerId: string, rtHash: string): Promise<void> {
    await this.repo.update({ id: farmerId }, { refreshTokenHash: rtHash });
  }

  async clearRefreshToken(farmerId: string): Promise<void> {
    await this.repo.update({ id: farmerId }, { refreshTokenHash: null });
  }
}
