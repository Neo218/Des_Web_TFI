import { Injectable, NotFoundException, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Tarea, EstadoTarea } from './entities/tarea.entity';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';
import { ListTareaDto } from './dto/list-tarea.dto';
import { ListProyectoDto } from '../proyectos/dto/list-proyecto.dto';
import { ListClienteDto } from '../clientes/dto/list-cliente.dto';
import { HistorialService, UsuarioAutenticado } from '../historial/historial.service';

@Injectable()
export class TareasService {
  constructor(
    @InjectRepository(Tarea)
    private tareasRepository: Repository<Tarea>,
    private readonly historialService: HistorialService,
  ) {}

  async create(createTareaDto: CreateTareaDto, usuario?: UsuarioAutenticado): Promise<{ id: number }> {
    const tarea = this.tareasRepository.create(createTareaDto);
    const saved = await this.tareasRepository.save(tarea);
    await this.historialService.registrarCambio({
      entidad: 'Tareas',
      idRegistro: saved.id,
      accion: 'CREACION',
      usuario,
      detalle: {
        despues: {
          id: saved.id,
          descripcion: saved.descripcion,
          estado: saved.estado,
          id_proyecto: saved.id_proyecto,
        },
      },
    });
    return { id: saved.id };
  }

  async findAll(): Promise<ListTareaDto[]> {
    const tareas = await this.tareasRepository.find({
      relations: { proyecto: { cliente: true } },
      order: { id: 'ASC' },
    });

    return tareas.map(t => {
      const clienteDto: ListClienteDto | undefined = t.proyecto?.cliente ? {
        id: t.proyecto.cliente.id,
        nombre: t.proyecto.cliente.nombre,
        estado: t.proyecto.cliente.estado,
      } : undefined;

      const proyectoDto: ListProyectoDto = {
        id: t.proyecto.id,
        nombre: t.proyecto.nombre,
        estado: t.proyecto.estado,
        cliente: clienteDto,
      };

      return {
        id: t.id,
        descripcion: t.descripcion,
        estado: t.estado,
        proyecto: proyectoDto,
      };
    });
  }

  async findByProyecto(idProyecto: number): Promise<ListTareaDto[]> {
    const tareas = await this.tareasRepository.find({
      where: { id_proyecto: idProyecto },
      relations: { proyecto: { cliente: true } },
      order: { id: 'ASC' },
    });

    return tareas.map(t => {
      const clienteDto: ListClienteDto | undefined = t.proyecto?.cliente ? {
        id: t.proyecto.cliente.id,
        nombre: t.proyecto.cliente.nombre,
        estado: t.proyecto.cliente.estado,
      } : undefined;

      const proyectoDto: ListProyectoDto = {
        id: t.proyecto.id,
        nombre: t.proyecto.nombre,
        estado: t.proyecto.estado,
        cliente: clienteDto,
      };

      return {
        id: t.id,
        descripcion: t.descripcion,
        estado: t.estado,
        proyecto: proyectoDto,
      };
    });
  }

  async findOne(id: number): Promise<ListTareaDto> {
    const tarea = await this._findOneEntity(id);

    const clienteDto: ListClienteDto | undefined = tarea.proyecto?.cliente ? {
      id: tarea.proyecto.cliente.id,
      nombre: tarea.proyecto.cliente.nombre,
      estado: tarea.proyecto.cliente.estado,
    } : undefined;

    const proyectoDto: ListProyectoDto = {
      id: tarea.proyecto.id,
      nombre: tarea.proyecto.nombre,
      estado: tarea.proyecto.estado,
      cliente: clienteDto,
    };

    return {
      id: tarea.id,
      descripcion: tarea.descripcion,
      estado: tarea.estado,
      proyecto: proyectoDto,
    };
  }

  async update(id: number, updateTareaDto: UpdateTareaDto, usuario?: UsuarioAutenticado): Promise<ListTareaDto> {
    const tarea = await this._findOneEntity(id);
    const antes = {
      id: tarea.id,
      descripcion: tarea.descripcion,
      estado: tarea.estado,
      id_proyecto: tarea.id_proyecto,
      proyecto: tarea.proyecto?.nombre,
    };
    Object.assign(tarea, updateTareaDto);
    const saved = await this.tareasRepository.save(tarea);
    await this.historialService.registrarCambio({
      entidad: 'Tareas',
      idRegistro: saved.id,
      accion: 'MODIFICACION',
      usuario,
      detalle: {
        antes,
        despues: {
          id: saved.id,
          descripcion: saved.descripcion,
          estado: saved.estado,
          id_proyecto: saved.id_proyecto,
        },
      },
    });

    const clienteDto: ListClienteDto | undefined = saved.proyecto?.cliente ? {
      id: saved.proyecto.cliente.id,
      nombre: saved.proyecto.cliente.nombre,
      estado: saved.proyecto.cliente.estado,
    } : undefined;

    const proyectoDto: ListProyectoDto = {
      id: saved.proyecto.id,
      nombre: saved.proyecto.nombre,
      estado: saved.proyecto.estado,
      cliente: clienteDto,
    };

    return {
      id: saved.id,
      descripcion: saved.descripcion,
      estado: saved.estado,
      proyecto: proyectoDto,
    };
  }

  async remove(id: number, usuario?: UsuarioAutenticado): Promise<void> {
    const tarea = await this._findOneEntity(id);
    const antes = {
      id: tarea.id,
      descripcion: tarea.descripcion,
      estado: tarea.estado,
      id_proyecto: tarea.id_proyecto,
      proyecto: tarea.proyecto?.nombre,
    };
    await this.tareasRepository.remove(tarea);
    await this.historialService.registrarCambio({
      entidad: 'Tareas',
      idRegistro: id,
      accion: 'ELIMINACION',
      usuario,
      detalle: { antes },
    });
  }

  private async _findOneEntity(id: number): Promise<Tarea> {
    const tarea = await this.tareasRepository.findOne({
      where: { id },
      relations: { proyecto: { cliente: true } },
    });

    if (!tarea) {
      throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
    }

    return tarea;
  }

  async existeTareaPorIdProyecto(idProyecto: number): Promise<boolean> {
    const existe = await this.tareasRepository.exists({
      where: {
        id_proyecto: idProyecto,
        estado: In([EstadoTarea.PENDIENTE, EstadoTarea.FINALIZADA]),
      },
    });
    return existe;
  }
}
