import { EstadoTarea } from '../entities/tarea.entity';
export declare class CreateTareaDto {
    descripcion: string;
    estado: EstadoTarea;
    id_proyecto: number;
}
