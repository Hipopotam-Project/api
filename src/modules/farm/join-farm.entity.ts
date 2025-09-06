import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  BeforeInsert,
  PrimaryColumn,
} from 'typeorm';

@Entity('join_farm')
export class JoinFarm {
  @PrimaryColumn()
  key: number;

  @Column({ type: 'uuid' })
  farm_id: string;

  @Column({ type: 'bool', default: false })
  isAdmin: boolean;

  @BeforeInsert()
  generateKey() {
    this.key = Math.floor(100000 + Math.random() * 900000);
  }
}
