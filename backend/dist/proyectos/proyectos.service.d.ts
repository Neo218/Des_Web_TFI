import { Repository } from 'typeorm';
import { Proyecto } from './entities/proyecto.entity';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { ListProyectoDto } from './dto/list-proyecto.dto';
import { ProyectoDetalleDto } from './dto/proyecto-detalle.dto';
import { ClientesService } from '../clientes/clientes.service';
import { TareasService } from '../tareas/tareas.service';
import { HistorialService, UsuarioAutenticado } from '../historial/historial.service';
export declare class ProyectosService {
    private proyectosRepository;
    private readonly clientesService;
    private readonly tareasService;
    private readonly historialService;
    constructor(proyectosRepository: Repository<Proyecto>, clientesService: ClientesService, tareasService: TareasService, historialService: HistorialService);
    create(createProyectoDto: CreateProyectoDto, usuario?: UsuarioAutenticado): Promise<{
        id: number;
    }>;
    findAll(): Promise<ListProyectoDto[]>;
    findOne(id: number): Promise<ListProyectoDto>;
    findOneWithTareas(id: number): Promise<ProyectoDetalleDto>;
    update(id: number, updateProyectoDto: UpdateProyectoDto, usuario?: UsuarioAutenticado): Promise<ListProyectoDto>;
    remove(id: number, usuario?: UsuarioAutenticado): Promise<void>;
    existeProyectoPorIdCliente(idCliente: number): Promise<boolean>;
    private _findOneEntity;
}
