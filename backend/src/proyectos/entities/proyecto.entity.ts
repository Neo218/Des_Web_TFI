import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Cliente } from '../../clientes/entities/cliente.entity';
import { Tarea } from '../../tareas/entities/tarea.entity';

export enum EstadoProyecto {
  ACTIVO = 'ACTIVO',
  FINALIZADO = 'FINALIZADO',
  BAJA = 'BAJA',
}

@Entity('proyectos')
export class Proyecto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', unique: true })
  nombre: string;

  @Column({
    type: 'enum',
    enum: EstadoProyecto,
    default: EstadoProyecto.ACTIVO,
  })
  estado: EstadoProyecto;

  @Column({ type: 'int', nullable: true })
  id_cliente: number;

  @ManyToOne(() => Cliente, { nullable: true })
  @JoinColumn({ name: 'id_cliente' })
  cliente?: Cliente;

  @OneToMany(() => Tarea, (tarea) => tarea.proyecto)
  tareas?: Tarea[];

  @Column({ name: 'fecha_objetivo', type: 'date', nullable: true })
  fechaObjetivo?: Date;
}
