import { IsString, IsEnum, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';
import { EstadoProyecto } from '../entities/proyecto.entity';

export class CreateProyectoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsEnum(EstadoProyecto)
  estado: EstadoProyecto;

  @IsOptional()
  @IsNumber()
  id_cliente?: number;
}
