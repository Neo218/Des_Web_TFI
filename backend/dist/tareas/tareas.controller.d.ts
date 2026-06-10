import { TareasService } from './tareas.service';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';
export declare class TareasController {
    private readonly tareasService;
    constructor(tareasService: TareasService);
    create(createTareaDto: CreateTareaDto, req: any): Promise<{
        id: number;
    }>;
    findAll(): Promise<import("./dto/list-tarea.dto").ListTareaDto[]>;
    findByProyecto(idProyecto: string): Promise<import("./dto/list-tarea.dto").ListTareaDto[]>;
    findOne(id: string): Promise<import("./dto/list-tarea.dto").ListTareaDto>;
    update(id: string, updateTareaDto: UpdateTareaDto, req: any): Promise<import("./dto/list-tarea.dto").ListTareaDto>;
    remove(id: string, req: any): Promise<void>;
}
