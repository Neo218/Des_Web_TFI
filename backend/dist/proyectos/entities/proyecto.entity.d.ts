import { Cliente } from '../../clientes/entities/cliente.entity';
import { Tarea } from '../../tareas/entities/tarea.entity';
export declare enum EstadoProyecto {
    ACTIVO = "ACTIVO",
    FINALIZADO = "FINALIZADO",
    BAJA = "BAJA"
}
export declare class Proyecto {
    id: number;
    nombre: string;
    estado: EstadoProyecto;
    id_cliente: number;
    cliente?: Cliente;
    tareas?: Tarea[];
    fechaObjetivo?: Date;
}
