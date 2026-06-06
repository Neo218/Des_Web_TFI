import { Injectable, NotFoundException, ConflictException, BadRequestException, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Proyecto, EstadoProyecto } from './entities/proyecto.entity';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { ListProyectoDto } from './dto/list-proyecto.dto';
import { ProyectoDetalleDto } from './dto/proyecto-detalle.dto';
import { ListClienteDto } from '../clientes/dto/list-cliente.dto';
import { ClientesService } from '../clientes/clientes.service';
import { TareasService } from '../tareas/tareas.service';
import { HistorialService, UsuarioAutenticado } from '../historial/historial.service';

@Injectable()
export class ProyectosService {
  constructor(
    @InjectRepository(Proyecto)
    private proyectosRepository: Repository<Proyecto>,
    @Inject(forwardRef(() => ClientesService))
    private readonly clientesService: ClientesService,
    @Inject(forwardRef(() => TareasService))
    private readonly tareasService: TareasService,
    private readonly historialService: HistorialService,
  ) {}

  async create(createProyectoDto: CreateProyectoDto, usuario?: UsuarioAutenticado): Promise<{ id: number }> {
    const existing = await this.proyectosRepository.findOne({
      where: { nombre: createProyectoDto.nombre },
    });

    if (existing) {
      throw new ConflictException('Ya existe un proyecto con ese nombre');
    }

    // Validar que el cliente esté activo si se especifica
    if (createProyectoDto.id_cliente) {
      const clienteActivo = await this.clientesService.existeClienteActivoPorId(createProyectoDto.id_cliente);
      if (!clienteActivo) {
        throw new BadRequestException('Se debe especificar un cliente activo para el proyecto');
      }
    }

    const proyecto = this.proyectosRepository.create(createProyectoDto);
    const saved = await this.proyectosRepository.save(proyecto);
    await this.historialService.registrarCambio({
      entidad: 'Proyectos',
      idRegistro: saved.id,
      accion: 'CREACION',
      usuario,
      detalle: {
        despues: {
          id: saved.id,
          nombre: saved.nombre,
          estado: saved.estado,
          id_cliente: saved.id_cliente ?? null,
        },
      },
    });
    return { id: saved.id };
  }

  async findAll(): Promise<ListProyectoDto[]> {
    const proyectos = await this.proyectosRepository.find({
      relations: { cliente: true },
      order: { id: 'ASC' },
    });

    return proyectos.map(p => {
      const dto: ListProyectoDto = {
        id: p.id,
        nombre: p.nombre,
        estado: p.estado,
      };
      if (p.cliente) {
        dto.cliente = {
          id: p.cliente.id,
          nombre: p.cliente.nombre,
          estado: p.cliente.estado,
        };
      }
      return dto;
    });
  }

  async findOne(id: number): Promise<ListProyectoDto> {
    const proyecto = await this._findOneEntity(id);

    const dto: ListProyectoDto = {
      id: proyecto.id,
      nombre: proyecto.nombre,
      estado: proyecto.estado,
    };
    if (proyecto.cliente) {
      dto.cliente = {
        id: proyecto.cliente.id,
        nombre: proyecto.cliente.nombre,
        estado: proyecto.cliente.estado,
      };
    }
    return dto;
  }

  async findOneWithTareas(id: number): Promise<ProyectoDetalleDto> {
    const proyecto = await this.proyectosRepository.findOne({
      where: { id },
      relations: { cliente: true, tareas: true },
      order: { tareas: { id: 'ASC' } },
    });

    if (!proyecto) {
      throw new NotFoundException(`Proyecto con ID ${id} no encontrado`);
    }

    const dto: ProyectoDetalleDto = {
      id: proyecto.id,
      nombre: proyecto.nombre,
      estado: proyecto.estado,
      tareas: proyecto.tareas?.map(t => ({
        id: t.id,
        descripcion: t.descripcion,
        estado: t.estado,
      })),
    };
    if (proyecto.cliente) {
      dto.cliente = {
        id: proyecto.cliente.id,
        nombre: proyecto.cliente.nombre,
        estado: proyecto.cliente.estado,
      };
    }
    return dto;
  }

  async update(id: number, updateProyectoDto: UpdateProyectoDto, usuario?: UsuarioAutenticado): Promise<ListProyectoDto> {
    const proyecto = await this._findOneEntity(id);
    const antes = {
      id: proyecto.id,
      nombre: proyecto.nombre,
      estado: proyecto.estado,
      id_cliente: proyecto.id_cliente ?? null,
      cliente: proyecto.cliente?.nombre ?? null,
    };

    // Validar que el cliente esté activo si se especifica
    if (updateProyectoDto.id_cliente) {
      const clienteActivo = await this.clientesService.existeClienteActivoPorId(updateProyectoDto.id_cliente);
      if (!clienteActivo) {
        throw new BadRequestException('Se debe especificar un cliente activo para el proyecto');
      }
    }

    Object.assign(proyecto, updateProyectoDto);
    const saved = await this.proyectosRepository.save(proyecto);
    await this.historialService.registrarCambio({
      entidad: 'Proyectos',
      idRegistro: saved.id,
      accion: 'MODIFICACION',
      usuario,
      detalle: {
        antes,
        despues: {
          id: saved.id,
          nombre: saved.nombre,
          estado: saved.estado,
          id_cliente: saved.id_cliente ?? null,
        },
      },
    });

    const dto: ListProyectoDto = {
      id: saved.id,
      nombre: saved.nombre,
      estado: saved.estado,
    };
    if (saved.cliente) {
      dto.cliente = {
        id: saved.cliente.id,
        nombre: saved.cliente.nombre,
        estado: saved.cliente.estado,
      };
    }
    return dto;
  }

  async remove(id: number, usuario?: UsuarioAutenticado): Promise<void> {
    const proyecto = await this._findOneEntity(id);
    const antes = {
      id: proyecto.id,
      nombre: proyecto.nombre,
      estado: proyecto.estado,
      id_cliente: proyecto.id_cliente ?? null,
      cliente: proyecto.cliente?.nombre ?? null,
    };

    // Verificar que el proyecto no tenga tareas asociadas
    const tieneTareas = await this.tareasService.existeTareaPorIdProyecto(id);
    if (tieneTareas) {
      throw new BadRequestException('No se puede eliminar: el proyecto tiene tareas asociadas');
    }

    await this.proyectosRepository.remove(proyecto);
    await this.historialService.registrarCambio({
      entidad: 'Proyectos',
      idRegistro: id,
      accion: 'ELIMINACION',
      usuario,
      detalle: { antes },
    });
  }

  async existeProyectoPorIdCliente(idCliente: number): Promise<boolean> {
    const existe = await this.proyectosRepository.exists({
      where: {
        cliente: { id: idCliente },
        estado: In([EstadoProyecto.ACTIVO, EstadoProyecto.FINALIZADO]),
      },
    });
    return existe;
  }

  private async _findOneEntity(id: number): Promise<Proyecto> {
    const proyecto = await this.proyectosRepository.findOne({
      where: { id },
      relations: { cliente: true },
    });

    if (!proyecto) {
      throw new NotFoundException(`Proyecto con ID ${id} no encontrado`);
    }

    return proyecto;
  }
}
