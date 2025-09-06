import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Farm } from '../farm/farm.entity';

@Entity('sensors')
export class Sensor {
  @PrimaryColumn('text')
  id: string;

  @ManyToOne(() => Farm, { onDelete: 'CASCADE' })
  farm: Farm;

  @Column({ type: 'text' })
  lat: string;

  @Column({ type: 'text' })
  lng: string;

  @Column({ type: 'float', default: 0 })
  temp: number;

  @Column({ type: 'float', default: 0 })
  humidity: number;

  @Column({ type: 'boolean', default: false })
  fire_detected: boolean;
}
