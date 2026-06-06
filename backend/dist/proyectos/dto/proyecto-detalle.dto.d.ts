import { ListClienteDto } from '../../clientes/dto/list-cliente.dto';
export declare class TareaResumenDto {
    id: number;
    descripcion: string;
    estado: string;
}
export declare class ProyectoDetalleDto {
    id: number;
    nombre: string;
    estado: string;
    cliente?: ListClienteDto;
    tareas?: TareaResumenDto[];
}
