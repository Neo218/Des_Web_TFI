export enum EstadoProyecto {
  ACTIVO = 'ACTIVO',
  FINALIZADO = 'FINALIZADO',
  BAJA = 'BAJA',
}

export interface ClienteReference {
  id?: number;
  nombre: string;
  estado: string;
}

export interface TareaReference {
  id?: number;
  descripcion: string;
  estado: string;
  id_proyecto: number;
}

export interface Proyecto {
  id?: number;
  nombre: string;
  estado: EstadoProyecto;
  id_cliente?: number;
  cliente?: ClienteReference;
  tareas?: TareaReference[];
}
