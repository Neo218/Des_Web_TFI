import { Repository } from 'typeorm';
import { Tarea } from './entities/tarea.entity';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';
import { ListTareaDto } from './dto/list-tarea.dto';
export declare class TareasService {
    private tareasRepository;
    constructor(tareasRepository: Repository<Tarea>);
    create(createTareaDto: CreateTareaDto): Promise<{
        id: number;
    }>;
    findAll(): Promise<ListTareaDto[]>;
    findByProyecto(idProyecto: number): Promise<ListTareaDto[]>;
    findOne(id: number): Promise<ListTareaDto>;
    update(id: number, updateTareaDto: UpdateTareaDto): Promise<ListTareaDto>;
    remove(id: number): Promise<void>;
    private _findOneEntity;
    existeTareaPorIdProyecto(idProyecto: number): Promise<boolean>;
}
