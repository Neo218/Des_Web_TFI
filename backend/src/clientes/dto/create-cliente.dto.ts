import { IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { EstadoCliente } from '../entities/cliente.entity';

export class CreateClienteDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsEnum(EstadoCliente)
  estado: EstadoCliente;
}
