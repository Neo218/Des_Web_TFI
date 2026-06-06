export enum EstadoTarea {
  PENDIENTE = 'PENDIENTE',
  FINALIZADA = 'FINALIZADA',
  BAJA = 'BAJA',
}

export interface ClienteReference {
  id?: number;
  nombre: string;
  estado: string;
}

export interface ProyectoReference {
  id?: number;
  nombre: string;
  estado: string;
  cliente?: ClienteReference;
}

export interface Tarea {
  id?: number;
  descripcion: string;
  estado: EstadoTarea;
  proyecto: ProyectoReference;
}
