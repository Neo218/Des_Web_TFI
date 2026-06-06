import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const usuario = await this.usuariosRepository.findOne({
      where: { nombre: loginDto.nombre },
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const claveValida = await bcrypt.compare(loginDto.clave, usuario.clave);
    if (!claveValida) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (usuario.estado !== 'ACTIVO') {
      throw new UnauthorizedException('Usuario no está activo');
    }

    const payload = { sub: usuario.id, nombre: usuario.nombre };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async validateUser(userId: number): Promise<Usuario> {
    const usuario = await this.usuariosRepository.findOne({
      where: { id: userId },
    });

    if (!usuario || usuario.estado !== 'ACTIVO') {
      throw new UnauthorizedException('Usuario no válido');
    }

    return usuario;
  }
}
