import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { HistorialService, UsuarioAutenticado } from '../historial/historial.service';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
    private readonly historialService: HistorialService,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto, usuarioAutenticado?: UsuarioAutenticado): Promise<Usuario> {
    const existing = await this.usuariosRepository.findOne({
      where: { nombre: createUsuarioDto.nombre },
    });

    if (existing) {
      throw new ConflictException('Ya existe un usuario con ese nombre');
    }

    const hashedPassword = await bcrypt.hash(createUsuarioDto.clave, 10);
    const usuario = this.usuariosRepository.create({
      ...createUsuarioDto,
      clave: hashedPassword,
    });

    const saved = await this.usuariosRepository.save(usuario);
    await this.historialService.registrarCambio({
      entidad: 'Usuarios',
      idRegistro: saved.id,
      accion: 'CREACION',
      usuario: usuarioAutenticado,
      detalle: { despues: { id: saved.id, nombre: saved.nombre, estado: saved.estado } },
    });
    return saved;
  }

  async findAll(): Promise<Usuario[]> {
    return this.usuariosRepository.find();
  }

  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuariosRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return usuario;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto, usuarioAutenticado?: UsuarioAutenticado): Promise<Usuario> {
    const usuario = await this.findOne(id);
    const antes = { id: usuario.id, nombre: usuario.nombre, estado: usuario.estado };

    const dto = updateUsuarioDto as any;
    if (dto.clave) {
      dto.clave = await bcrypt.hash(dto.clave, 10);
    }

    Object.assign(usuario, updateUsuarioDto);
    const saved = await this.usuariosRepository.save(usuario);
    await this.historialService.registrarCambio({
      entidad: 'Usuarios',
      idRegistro: saved.id,
      accion: 'MODIFICACION',
      usuario: usuarioAutenticado,
      detalle: { antes, despues: { id: saved.id, nombre: saved.nombre, estado: saved.estado } },
    });
    return saved;
  }

  async remove(id: number, usuarioAutenticado?: UsuarioAutenticado): Promise<void> {
    const usuario = await this.findOne(id);
    const antes = { id: usuario.id, nombre: usuario.nombre, estado: usuario.estado };
    await this.usuariosRepository.remove(usuario);
    await this.historialService.registrarCambio({
      entidad: 'Usuarios',
      idRegistro: id,
      accion: 'ELIMINACION',
      usuario: usuarioAutenticado,
      detalle: { antes },
    });
  }
}
