export interface HistorialCambio {
  id: number;
  entidad: string;
  id_registro: number | null;
  accion: 'CREACION' | 'MODIFICACION' | 'ELIMINACION';
  usuario_id: number | null;
  usuario_nombre: string;
  fecha: string;
  detalle: string | null;
}
