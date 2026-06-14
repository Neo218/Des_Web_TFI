import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistorialCambio } from './entities/historial-cambio.entity';

export interface UsuarioAutenticado {
  userId?: number;
  username?: string;
}

interface RegistrarCambioParams {
  entidad: string;
  idRegistro?: number | null;
  accion: 'CREACION' | 'MODIFICACION' | 'ELIMINACION';
  usuario?: UsuarioAutenticado;
  detalle?: unknown;
}

@Injectable()
export class HistorialService {
  constructor(
    @InjectRepository(HistorialCambio)
    private historialRepository: Repository<HistorialCambio>,
  ) {}

  async registrarCambio(params: RegistrarCambioParams): Promise<void> {
    const cambio = this.historialRepository.create({
      entidad: params.entidad,
      id_registro: params.idRegistro ?? null,
      accion: params.accion,
      usuario_id: params.usuario?.userId ?? null,
      usuario_nombre: params.usuario?.username ?? 'Sistema',
      detalle: params.detalle ? JSON.stringify(params.detalle) : null,
    });

    await this.historialRepository.save(cambio);
  }

  async findAll(): Promise<HistorialCambio[]> {
    return this.historialRepository.find({
      order: { fecha: 'DESC', id: 'DESC' },
      take: 200,
    });
  }
}
