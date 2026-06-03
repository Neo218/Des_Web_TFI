import { ListClienteDto } from '../../clientes/dto/list-cliente.dto';

export class ListProyectoDto {
  id: number;
  nombre: string;
  estado: string;
  cliente?: ListClienteDto;
}
