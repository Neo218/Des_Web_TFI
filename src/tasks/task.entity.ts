import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';

import { Project } from '../../projects/entities/project.entity';

@Entity()
export class Task {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column({
    default: 'PENDIENTE',
  })
  status: string;

  @ManyToOne(() => Project)
  project: Project;
}