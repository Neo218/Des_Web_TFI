import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';

import { Client } from '../../clients/entities/client.entity';

@Entity()
export class Project {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    default: 'ACTIVO',
  })
  status: string;

  @ManyToOne(() => Client, {
    nullable: true,
  })
  client: Client;
}