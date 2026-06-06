import { Injectable, NotFoundException, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Tarea, EstadoTarea } from './entities/tarea.entity';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';
import { ListTareaDto } from './dto/list-tarea.dto';
import { ListProyectoDto } from '../proyectos/dto/list-proyecto.dto';
import { ListClienteDto } from '../clientes/dto/list-cliente.dto';

@Injectable()
export class TareasService {
  constructor(
    @InjectRepository(Tarea)
    private tareasRepository: Repository<Tarea>,
  ) {}

  async create(createTareaDto: CreateTareaDto): Promise<{ id: number }> {
    const tarea = this.tareasRepository.create(createTareaDto);
    const saved = await this.tareasRepository.save(tarea);
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

  async update(id: number, updateTareaDto: UpdateTareaDto): Promise<ListTareaDto> {
    const tarea = await this._findOneEntity(id);
    Object.assign(tarea, updateTareaDto);
    const saved = await this.tareasRepository.save(tarea);

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

  async remove(id: number): Promise<void> {
    const tarea = await this._findOneEntity(id);
    await this.tareasRepository.remove(tarea);
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
