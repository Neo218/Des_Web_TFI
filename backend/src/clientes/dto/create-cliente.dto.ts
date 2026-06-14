import { IsString, IsEnum, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';
import { EstadoCliente } from '../entities/cliente.entity';

export class CreateClienteDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  direccion?: string;

  @IsEnum(EstadoCliente)
  estado: EstadoCliente;
}
