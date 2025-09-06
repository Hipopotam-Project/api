import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FiresService } from './fires.service';
import { CreateFireDto } from './dto/create-fire.dto';
import { UpdateFireDto } from './dto/update-fire.dto';

@Controller('fires')
export class FiresController {
  constructor(private readonly firesService: FiresService) {}

  @Post('register')
  registerFire(@Body() createFireDto: CreateFireDto) {
    return this.firesService.registerFire(createFireDto);
  }
}
