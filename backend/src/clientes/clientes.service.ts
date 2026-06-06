import { Injectable, NotFoundException, ConflictException, BadRequestException, forwardRef, Inject } from '@nestjs/common';
import { EstadoCliente } from './entities/cliente.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { ProyectosService } from '../proyectos/proyectos.service';
import { ListClienteDto } from './dto/list-cliente.dto';
import { HistorialService, UsuarioAutenticado } from '../historial/historial.service';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private clientesRepository: Repository<Cliente>,
    @Inject(forwardRef(() => ProyectosService))
    private readonly proyectosService: ProyectosService,
    private readonly historialService: HistorialService,
  ) {}

  async create(createClienteDto: CreateClienteDto, usuario?: UsuarioAutenticado): Promise<{ id: number }> {
    const existing = await this.clientesRepository.findOne({
      where: { nombre: createClienteDto.nombre },
    });

    if (existing) {
      throw new ConflictException('Ya existe un cliente con ese nombre');
    }

    const cliente = this.clientesRepository.create(createClienteDto);
    const saved = await this.clientesRepository.save(cliente);
    await this.historialService.registrarCambio({
      entidad: 'Clientes',
      idRegistro: saved.id,
      accion: 'CREACION',
      usuario,
      detalle: { despues: { id: saved.id, nombre: saved.nombre, estado: saved.estado } },
    });
    return { id: saved.id };
  }

  async findAll(): Promise<ListClienteDto[]> {
    const clientes = await this.clientesRepository.find({ order: { id: 'ASC' } });
    return clientes.map(c => ({ id: c.id, nombre: c.nombre, estado: c.estado }));
  }

  async findActivos(): Promise<ListClienteDto[]> {
    const clientes = await this.clientesRepository.find({ where: { estado: EstadoCliente.ACTIVO }, order: { id: 'ASC' } });
    return clientes.map(c => ({ id: c.id, nombre: c.nombre, estado: c.estado }));
  }

  async findOne(id: number): Promise<ListClienteDto> {
    const cliente = await this._findOneEntity(id);
    return { id: cliente.id, nombre: cliente.nombre, estado: cliente.estado };
  }

  async update(id: number, updateClienteDto: UpdateClienteDto, usuario?: UsuarioAutenticado): Promise<ListClienteDto> {
    const cliente = await this._findOneEntity(id);
    const antes = { id: cliente.id, nombre: cliente.nombre, estado: cliente.estado };

    // Validar que no se pueda dar de baja un cliente con proyectos relacionados
    if (updateClienteDto.estado === EstadoCliente.BAJA) {
      const relacionadoConProyectos = await this.proyectosService.existeProyectoPorIdCliente(id);
      if (relacionadoConProyectos) {
        throw new BadRequestException('No se puede dar de baja un cliente con proyectos relacionados');
      }
    }

    Object.assign(cliente, updateClienteDto);
    const saved = await this.clientesRepository.save(cliente);
    await this.historialService.registrarCambio({
      entidad: 'Clientes',
      idRegistro: saved.id,
      accion: 'MODIFICACION',
      usuario,
      detalle: { antes, despues: { id: saved.id, nombre: saved.nombre, estado: saved.estado } },
    });
    return { id: saved.id, nombre: saved.nombre, estado: saved.estado };
  }

  async remove(id: number, usuario?: UsuarioAutenticado): Promise<ListClienteDto> {
    const cliente = await this._findOneEntity(id);
    const antes = { id: cliente.id, nombre: cliente.nombre, estado: cliente.estado };

    // Verificar que el cliente no esté asociado a ningún proyecto
    // Esto se manejará en el módulo de proyectos o con una constraint en la DB
    const relacionadoConProyectos = await this.proyectosService.existeProyectoPorIdCliente(id);
    if (relacionadoConProyectos) {
      throw new BadRequestException('No se puede dar de baja un cliente con proyectos relacionados');
    }

    cliente.estado = EstadoCliente.BAJA;
    const saved = await this.clientesRepository.save(cliente);
    await this.historialService.registrarCambio({
      entidad: 'Clientes',
      idRegistro: id,
      accion: 'ELIMINACION',
      usuario,
      detalle: {
        antes,
        despues: { id: saved.id, nombre: saved.nombre, estado: saved.estado },
      },
    });

    return { id: saved.id, nombre: saved.nombre, estado: saved.estado };
  }

  async existeClienteActivoPorId(id: number): Promise<boolean> {
    const existe = await this.clientesRepository.exists({
      where: { id, estado: EstadoCliente.ACTIVO },
    });
    return existe;
  }

  private async _findOneEntity(id: number): Promise<Cliente> {
    const cliente = await this.clientesRepository.findOne({ where: { id } });
    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
    return cliente;
  }
}
