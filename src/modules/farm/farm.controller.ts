import { Controller, Post, Body } from '@nestjs/common';
import { FarmService } from './farm.service';
import { CreateFarmDto } from './dto/create-farm.dto';

@Controller('farm')
export class FarmController {
  constructor(private readonly farmService: FarmService) {}

  @Post()
  async create(@Body() createFarmDto: CreateFarmDto) {
    return this.farmService.create(createFarmDto);
  }
}
