import { Module } from '@nestjs/common';
import { FiresService } from './fires.service';
import { FiresController } from './fires.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fire } from './entities/fire.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Fire])],
  controllers: [FiresController],
  providers: [FiresService],
  exports: [FiresService],
})
export class FiresModule {}
