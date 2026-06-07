export declare enum EstadoUsuario {
    ACTIVO = "ACTIVO",
    BAJA = "BAJA"
}
export declare enum RolUsuario {
    ADMIN = "ADMIN",
    USUARIO = "USUARIO"
}
export declare class Usuario {
    id: number;
    nombre: string;
    clave: string;
    estado: EstadoUsuario;
    rol: RolUsuario;
}
