import { ListProyectoDto } from '../../proyectos/dto/list-proyecto.dto';

export class ListTareaDto {
  id: number;
  descripcion: string;
  estado: string;
  proyecto: ListProyectoDto;
}
