import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('historial_cambios')
export class HistorialCambio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  entidad: string;

  @Column({ type: 'int', nullable: true })
  id_registro: number | null;

  @Column({ type: 'text' })
  accion: string;

  @Column({ type: 'int', nullable: true })
  usuario_id: number | null;

  @Column({ type: 'text' })
  usuario_nombre: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;

  @Column({ type: 'text', nullable: true })
  detalle: string | null;
}
