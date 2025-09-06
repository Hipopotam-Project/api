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

  @Post()
  create(@Body() createFireDto: CreateFireDto) {
    return this.firesService.create(createFireDto);
  }

  @Get()
  findAll() {
    return this.firesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.firesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFireDto: UpdateFireDto) {
    return this.firesService.update(+id, updateFireDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.firesService.remove(id);
  }
}
