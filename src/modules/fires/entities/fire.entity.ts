import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
} from 'typeorm';
import { Farm } from 'src/modules/farm/farm.entity';
import { Farmer } from 'src/modules/farmers/farmers.entity';

@Entity('fires')
export class Fire {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  lat: string;

  @Column({ type: 'text' })
  lng: string;

  @Column({ type: 'text', nullable: true, default: null })
  sensor_id?: string;

  @Column({ type: 'text', nullable: true, default: null })
  farmer_id?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'timestamptz', nullable: false })
  expiresAt: Date;
}
