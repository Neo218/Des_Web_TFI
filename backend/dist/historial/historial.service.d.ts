import { Repository } from 'typeorm';
import { HistorialCambio } from './entities/historial-cambio.entity';
export interface UsuarioAutenticado {
    userId?: number;
    username?: string;
}
interface RegistrarCambioParams {
    entidad: string;
    idRegistro?: number | null;
    accion: 'CREACION' | 'MODIFICACION' | 'ELIMINACION';
    usuario?: UsuarioAutenticado;
    detalle?: unknown;
}
export declare class HistorialService {
    private historialRepository;
    constructor(historialRepository: Repository<HistorialCambio>);
    registrarCambio(params: RegistrarCambioParams): Promise<void>;
    findAll(): Promise<HistorialCambio[]>;
}
export {};
