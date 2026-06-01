import { Injectable, NotFoundException, ConflictException, BadRequestException, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Proyecto, EstadoProyecto } from './entities/proyecto.entity';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { ClientesService } from '../clientes/clientes.service';

@Injectable()
export class ProyectosService {
  constructor(
    @InjectRepository(Proyecto)
    private proyectosRepository: Repository<Proyecto>,
    @Inject(forwardRef(() => ClientesService))
    private readonly clientesService: ClientesService,
  ) {}

  async create(createProyectoDto: CreateProyectoDto): Promise<Proyecto> {
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
    return this.proyectosRepository.save(proyecto);
  }

  async findAll(): Promise<Proyecto[]> {
    return this.proyectosRepository.find({
      relations: { cliente: true },
    });
  }

  async findOne(id: number): Promise<Proyecto> {
    const proyecto = await this.proyectosRepository.findOne({
      where: { id },
      relations: { cliente: true },
    });

    if (!proyecto) {
      throw new NotFoundException(`Proyecto con ID ${id} no encontrado`);
    }

    return proyecto;
  }

  async findOneWithTareas(id: number): Promise<Proyecto> {
    const proyecto = await this.proyectosRepository.findOne({
      where: { id },
      relations: { cliente: true, tareas: true },
    });

    if (!proyecto) {
      throw new NotFoundException(`Proyecto con ID ${id} no encontrado`);
    }

    return proyecto;
  }

  async update(id: number, updateProyectoDto: UpdateProyectoDto): Promise<Proyecto> {
    const proyecto = await this.findOne(id);

    // Validar que el cliente esté activo si se especifica
    if (updateProyectoDto.id_cliente) {
      const clienteActivo = await this.clientesService.existeClienteActivoPorId(updateProyectoDto.id_cliente);
      if (!clienteActivo) {
        throw new BadRequestException('Se debe especificar un cliente activo para el proyecto');
      }
    }

    Object.assign(proyecto, updateProyectoDto);
    return this.proyectosRepository.save(proyecto);
  }

  async remove(id: number): Promise<void> {
    const proyecto = await this.findOne(id);
    await this.proyectosRepository.remove(proyecto);
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
}
