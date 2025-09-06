import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('join_farm')
export class JoinFarm {
  @PrimaryGeneratedColumn('uuid')
  key: string;

  @Column({ type: 'uuid' })
  farm_id: string;

  @Column({ type: 'bool', default: false })
  isAdmin: boolean;
}
