import { ListClienteDto } from '../../clientes/dto/list-cliente.dto';

export class TareaResumenDto {
  id: number;
  descripcion: string;
  estado: string;
}

export class ProyectoDetalleDto {
  id: number;
  nombre: string;
  estado: string;
  cliente?: ListClienteDto;
  tareas?: TareaResumenDto[];
}
