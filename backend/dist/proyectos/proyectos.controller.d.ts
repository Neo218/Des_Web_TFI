import { ProyectosService } from './proyectos.service';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
export declare class ProyectosController {
    private readonly proyectosService;
    constructor(proyectosService: ProyectosService);
    create(createProyectoDto: CreateProyectoDto, req: any): Promise<{
        id: number;
    }>;
    findAll(): Promise<import("./dto/list-proyecto.dto").ListProyectoDto[]>;
    findOne(id: string): Promise<import("./dto/list-proyecto.dto").ListProyectoDto>;
    findOneWithTareas(id: string): Promise<import("./dto/proyecto-detalle.dto").ProyectoDetalleDto>;
    update(id: string, updateProyectoDto: UpdateProyectoDto, req: any): Promise<import("./dto/list-proyecto.dto").ListProyectoDto>;
    remove(id: string, req: any): Promise<void>;
}
