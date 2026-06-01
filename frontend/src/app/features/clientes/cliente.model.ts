export enum EstadoCliente {
  ACTIVO = 'ACTIVO',
  BAJA = 'BAJA',
}

export interface Cliente {
  id?: number;
  nombre: string;
  estado: EstadoCliente;
}
