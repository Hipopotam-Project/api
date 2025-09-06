import { Module } from '@nestjs/common';
import { FarmService } from './farm.service';
import { FarmController } from './farm.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Farm } from './farm.entity';
import { JoinFarm } from './join-farm.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Farm, JoinFarm])],
  controllers: [FarmController],
  providers: [FarmService],
  exports: [FarmService],
})
export class FarmModule {}
