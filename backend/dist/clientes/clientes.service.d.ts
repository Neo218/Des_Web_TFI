import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { ProyectosService } from '../proyectos/proyectos.service';
import { ListClienteDto } from './dto/list-cliente.dto';
import { HistorialService, UsuarioAutenticado } from '../historial/historial.service';
export declare class ClientesService {
    private clientesRepository;
    private readonly proyectosService;
    private readonly historialService;
    constructor(clientesRepository: Repository<Cliente>, proyectosService: ProyectosService, historialService: HistorialService);
    create(createClienteDto: CreateClienteDto, usuario?: UsuarioAutenticado): Promise<{
        id: number;
    }>;
    findAll(): Promise<ListClienteDto[]>;
    findActivos(): Promise<ListClienteDto[]>;
    findOne(id: number): Promise<ListClienteDto>;
    update(id: number, updateClienteDto: UpdateClienteDto, usuario?: UsuarioAutenticado): Promise<ListClienteDto>;
    remove(id: number, usuario?: UsuarioAutenticado): Promise<ListClienteDto>;
    existeClienteActivoPorId(id: number): Promise<boolean>;
    private _findOneEntity;
}
