import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { HistorialService, UsuarioAutenticado } from '../historial/historial.service';
export declare class UsuariosService {
    private usuariosRepository;
    private readonly historialService;
    constructor(usuariosRepository: Repository<Usuario>, historialService: HistorialService);
    create(createUsuarioDto: CreateUsuarioDto, usuarioAutenticado?: UsuarioAutenticado): Promise<Usuario>;
    findAll(): Promise<Usuario[]>;
    findOne(id: number): Promise<Usuario>;
    update(id: number, updateUsuarioDto: UpdateUsuarioDto, usuarioAutenticado?: UsuarioAutenticado): Promise<Usuario>;
    remove(id: number, usuarioAutenticado?: UsuarioAutenticado): Promise<void>;
}
