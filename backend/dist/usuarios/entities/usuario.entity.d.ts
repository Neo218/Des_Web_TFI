export declare enum EstadoUsuario {
    ACTIVO = "ACTIVO",
    BAJA = "BAJA"
}
export declare class Usuario {
    id: number;
    nombre: string;
    clave: string;
    estado: EstadoUsuario;
}
