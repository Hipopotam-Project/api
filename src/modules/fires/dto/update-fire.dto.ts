import { PartialType } from '@nestjs/mapped-types';
import { CreateFireDto } from './create-fire.dto';

export class UpdateFireDto extends PartialType(CreateFireDto) {}
