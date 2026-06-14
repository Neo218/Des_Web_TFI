import { IsString, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { EstadoTarea } from '../entities/tarea.entity';

export class CreateTareaDto {
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsEnum(EstadoTarea)
  estado: EstadoTarea;

  @IsNumber()
  id_proyecto: number;
}
