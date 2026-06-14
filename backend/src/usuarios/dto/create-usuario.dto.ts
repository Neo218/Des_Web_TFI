import { IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { EstadoUsuario } from '../entities/usuario.entity';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  clave: string;

  @IsEnum(EstadoUsuario)
  estado: EstadoUsuario;
}
