import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Proyecto } from '../../proyectos/entities/proyecto.entity';

export enum EstadoTarea {
  PENDIENTE = 'PENDIENTE',
  FINALIZADA = 'FINALIZADA',
  BAJA = 'BAJA',
}

@Entity('tareas')
export class Tarea {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({
    type: 'enum',
    enum: EstadoTarea,
    default: EstadoTarea.PENDIENTE,
  })
  estado: EstadoTarea;

  @Column({ type: 'int' })
  id_proyecto: number;

  @ManyToOne(() => Proyecto, { eager: true })
  @JoinColumn({ name: 'id_proyecto' })
  proyecto: Proyecto;
}
