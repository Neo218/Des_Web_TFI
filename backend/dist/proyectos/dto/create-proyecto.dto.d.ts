import { EstadoProyecto } from '../entities/proyecto.entity';
export declare class CreateProyectoDto {
    nombre: string;
    estado: EstadoProyecto;
    id_cliente?: number;
}
