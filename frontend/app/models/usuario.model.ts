export enum EstadoUsuario {
  ACTIVO = 'ACTIVO',
  BAJA = 'BAJA',
}

export interface Usuario {
  id?: number;
  nombre: string;
  clave?: string;
  estado: EstadoUsuario;
}

export interface LoginResponse {
  access_token: string;
}

export interface LoginRequest {
  nombre: string;
  clave: string;
}
