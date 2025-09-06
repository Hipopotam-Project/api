import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('farm')
export class Farm {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'smallint', array: true })
  location_field: Array<Array<number>>;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  email: string;

  @Column({ type: 'text' })
  phone: string;

  @Column({ type: 'int', default: 0 })
  edur_rogat: number;

  @Column({ type: 'int', default: 0 })
  dreben_rogat: number;

  @Column({ type: 'int', default: 0 })
  svine: number;

  @Column({ type: 'int', default: 0 })
  konevudstvo: number;

  @Column({ type: 'int', default: 0 })
  pticevudstvo: number;

  @Column({ type: 'int', default: 0 })
  workers: number;
}
