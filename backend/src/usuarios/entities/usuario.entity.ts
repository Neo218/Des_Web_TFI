import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum EstadoUsuario {
  ACTIVO = 'ACTIVO',
  BAJA = 'BAJA',
}
export enum RolUsuario {
  ADMIN = 'ADMIN',
  USUARIO = 'USUARIO',
}

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', unique: true })
  nombre: string;

  @Column({ type: 'text' })
  clave: string;

  @Column({
    type: 'enum',
    enum: EstadoUsuario,
    default: EstadoUsuario.ACTIVO,
  })
  estado: EstadoUsuario;

  @Column({
    type: 'text',
    default: RolUsuario.USUARIO,
  })
  rol: RolUsuario;
}
