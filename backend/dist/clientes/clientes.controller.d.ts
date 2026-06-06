import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
export declare class ClientesController {
    private readonly clientesService;
    constructor(clientesService: ClientesService);
    create(createClienteDto: CreateClienteDto): Promise<{
        id: number;
    }>;
    findAll(): Promise<import("./dto/list-cliente.dto").ListClienteDto[]>;
    findActivos(): Promise<import("./dto/list-cliente.dto").ListClienteDto[]>;
    findOne(id: string): Promise<import("./dto/list-cliente.dto").ListClienteDto>;
    update(id: string, updateClienteDto: UpdateClienteDto): Promise<import("./dto/list-cliente.dto").ListClienteDto>;
    remove(id: string): Promise<void>;
}
