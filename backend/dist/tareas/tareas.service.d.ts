import { Repository } from 'typeorm';
import { Tarea } from './entities/tarea.entity';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';
import { ListTareaDto } from './dto/list-tarea.dto';
import { HistorialService, UsuarioAutenticado } from '../historial/historial.service';
export declare class TareasService {
    private tareasRepository;
    private readonly historialService;
    constructor(tareasRepository: Repository<Tarea>, historialService: HistorialService);
    create(createTareaDto: CreateTareaDto, usuario?: UsuarioAutenticado): Promise<{
        id: number;
    }>;
    findAll(): Promise<ListTareaDto[]>;
    findByProyecto(idProyecto: number): Promise<ListTareaDto[]>;
    findOne(id: number): Promise<ListTareaDto>;
    update(id: number, updateTareaDto: UpdateTareaDto, usuario?: UsuarioAutenticado): Promise<ListTareaDto>;
    remove(id: number, usuario?: UsuarioAutenticado): Promise<void>;
    private _findOneEntity;
    existeTareaPorIdProyecto(idProyecto: number): Promise<boolean>;
}
