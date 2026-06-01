import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tarea } from './entities/tarea.entity';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';

@Injectable()
export class TareasService {
  constructor(
    @InjectRepository(Tarea)
    private tareasRepository: Repository<Tarea>,
  ) {}

  async create(createTareaDto: CreateTareaDto): Promise<Tarea> {
    const tarea = this.tareasRepository.create(createTareaDto);
    return this.tareasRepository.save(tarea);
  }

  async findAll(): Promise<Tarea[]> {
    return this.tareasRepository.find({
      relations: { proyecto: { cliente: true } },
    });
  }

  async findByProyecto(idProyecto: number): Promise<Tarea[]> {
    return this.tareasRepository.find({
      where: { id_proyecto: idProyecto },
      relations: { proyecto: { cliente: true } },
    });
  }

  async findOne(id: number): Promise<Tarea> {
    const tarea = await this.tareasRepository.findOne({
      where: { id },
      relations: { proyecto: { cliente: true } },
    });

    if (!tarea) {
      throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
    }

    return tarea;
  }

  async update(id: number, updateTareaDto: UpdateTareaDto): Promise<Tarea> {
    const tarea = await this.findOne(id);
    Object.assign(tarea, updateTareaDto);
    return this.tareasRepository.save(tarea);
  }

  async remove(id: number): Promise<void> {
    const tarea = await this.findOne(id);
    await this.tareasRepository.remove(tarea);
  }
}
