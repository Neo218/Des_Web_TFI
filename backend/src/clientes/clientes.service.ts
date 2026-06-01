import { Injectable, NotFoundException, ConflictException, BadRequestException, forwardRef, Inject } from '@nestjs/common';
import { EstadoCliente } from './entities/cliente.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { ProyectosService } from '../proyectos/proyectos.service';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private clientesRepository: Repository<Cliente>,
    @Inject(forwardRef(() => ProyectosService))
    private readonly proyectosService: ProyectosService,
  ) {}

  async create(createClienteDto: CreateClienteDto): Promise<Cliente> {
    const existing = await this.clientesRepository.findOne({
      where: { nombre: createClienteDto.nombre },
    });

    if (existing) {
      throw new ConflictException('Ya existe un cliente con ese nombre');
    }

    const cliente = this.clientesRepository.create(createClienteDto);
    return this.clientesRepository.save(cliente);
  }

  async findAll(): Promise<Cliente[]> {
    return this.clientesRepository.find();
  }

  async findActivos(): Promise<Cliente[]> {
    return this.clientesRepository.find({ where: { estado: EstadoCliente.ACTIVO } });
  }

  async findOne(id: number): Promise<Cliente> {
    const cliente = await this.clientesRepository.findOne({ where: { id } });
    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
    return cliente;
  }

  async update(id: number, updateClienteDto: UpdateClienteDto): Promise<Cliente> {
    const cliente = await this.findOne(id);

    // Validar que no se pueda dar de baja un cliente con proyectos relacionados
    if (updateClienteDto.estado === EstadoCliente.BAJA) {
      const relacionadoConProyectos = await this.proyectosService.existeProyectoPorIdCliente(id);
      if (relacionadoConProyectos) {
        throw new BadRequestException('No se puede dar de baja un cliente con proyectos relacionados');
      }
    }

    Object.assign(cliente, updateClienteDto);
    return this.clientesRepository.save(cliente);
  }

  async remove(id: number): Promise<void> {
    const cliente = await this.findOne(id);

    // Verificar que el cliente no esté asociado a ningún proyecto
    // Esto se manejará en el módulo de proyectos o con una constraint en la DB
    await this.clientesRepository.remove(cliente);
  }

  async existeClienteActivoPorId(id: number): Promise<boolean> {
    const existe = await this.clientesRepository.exists({
      where: { id, estado: EstadoCliente.ACTIVO },
    });
    return existe;
  }
}
