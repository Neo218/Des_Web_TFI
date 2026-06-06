import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { ProyectosService } from '../proyectos/proyectos.service';
import { ListClienteDto } from './dto/list-cliente.dto';
export declare class ClientesService {
    private clientesRepository;
    private readonly proyectosService;
    constructor(clientesRepository: Repository<Cliente>, proyectosService: ProyectosService);
    create(createClienteDto: CreateClienteDto): Promise<{
        id: number;
    }>;
    findAll(): Promise<ListClienteDto[]>;
    findActivos(): Promise<ListClienteDto[]>;
    findOne(id: number): Promise<ListClienteDto>;
    update(id: number, updateClienteDto: UpdateClienteDto): Promise<ListClienteDto>;
    remove(id: number): Promise<void>;
    existeClienteActivoPorId(id: number): Promise<boolean>;
    private _findOneEntity;
}
