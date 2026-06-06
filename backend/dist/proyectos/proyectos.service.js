"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProyectosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const proyecto_entity_1 = require("./entities/proyecto.entity");
const clientes_service_1 = require("../clientes/clientes.service");
const tareas_service_1 = require("../tareas/tareas.service");
let ProyectosService = class ProyectosService {
    proyectosRepository;
    clientesService;
    tareasService;
    constructor(proyectosRepository, clientesService, tareasService) {
        this.proyectosRepository = proyectosRepository;
        this.clientesService = clientesService;
        this.tareasService = tareasService;
    }
    async create(createProyectoDto) {
        const existing = await this.proyectosRepository.findOne({
            where: { nombre: createProyectoDto.nombre },
        });
        if (existing) {
            throw new common_1.ConflictException('Ya existe un proyecto con ese nombre');
        }
        if (createProyectoDto.id_cliente) {
            const clienteActivo = await this.clientesService.existeClienteActivoPorId(createProyectoDto.id_cliente);
            if (!clienteActivo) {
                throw new common_1.BadRequestException('Se debe especificar un cliente activo para el proyecto');
            }
        }
        const proyecto = this.proyectosRepository.create(createProyectoDto);
        const saved = await this.proyectosRepository.save(proyecto);
        return { id: saved.id };
    }
    async findAll() {
        const proyectos = await this.proyectosRepository.find({
            relations: { cliente: true },
            order: { id: 'ASC' },
        });
        return proyectos.map(p => {
            const dto = {
                id: p.id,
                nombre: p.nombre,
                estado: p.estado,
            };
            if (p.cliente) {
                dto.cliente = {
                    id: p.cliente.id,
                    nombre: p.cliente.nombre,
                    estado: p.cliente.estado,
                };
            }
            return dto;
        });
    }
    async findOne(id) {
        const proyecto = await this._findOneEntity(id);
        const dto = {
            id: proyecto.id,
            nombre: proyecto.nombre,
            estado: proyecto.estado,
        };
        if (proyecto.cliente) {
            dto.cliente = {
                id: proyecto.cliente.id,
                nombre: proyecto.cliente.nombre,
                estado: proyecto.cliente.estado,
            };
        }
        return dto;
    }
    async findOneWithTareas(id) {
        const proyecto = await this.proyectosRepository.findOne({
            where: { id },
            relations: { cliente: true, tareas: true },
            order: { tareas: { id: 'ASC' } },
        });
        if (!proyecto) {
            throw new common_1.NotFoundException(`Proyecto con ID ${id} no encontrado`);
        }
        const dto = {
            id: proyecto.id,
            nombre: proyecto.nombre,
            estado: proyecto.estado,
            tareas: proyecto.tareas?.map(t => ({
                id: t.id,
                descripcion: t.descripcion,
                estado: t.estado,
            })),
        };
        if (proyecto.cliente) {
            dto.cliente = {
                id: proyecto.cliente.id,
                nombre: proyecto.cliente.nombre,
                estado: proyecto.cliente.estado,
            };
        }
        return dto;
    }
    async update(id, updateProyectoDto) {
        const proyecto = await this._findOneEntity(id);
        if (updateProyectoDto.id_cliente) {
            const clienteActivo = await this.clientesService.existeClienteActivoPorId(updateProyectoDto.id_cliente);
            if (!clienteActivo) {
                throw new common_1.BadRequestException('Se debe especificar un cliente activo para el proyecto');
            }
        }
        Object.assign(proyecto, updateProyectoDto);
        const saved = await this.proyectosRepository.save(proyecto);
        const dto = {
            id: saved.id,
            nombre: saved.nombre,
            estado: saved.estado,
        };
        if (saved.cliente) {
            dto.cliente = {
                id: saved.cliente.id,
                nombre: saved.cliente.nombre,
                estado: saved.cliente.estado,
            };
        }
        return dto;
    }
    async remove(id) {
        const proyecto = await this._findOneEntity(id);
        const tieneTareas = await this.tareasService.existeTareaPorIdProyecto(id);
        if (tieneTareas) {
            throw new common_1.BadRequestException('No se puede eliminar: el proyecto tiene tareas asociadas');
        }
        await this.proyectosRepository.remove(proyecto);
    }
    async existeProyectoPorIdCliente(idCliente) {
        const existe = await this.proyectosRepository.exists({
            where: {
                cliente: { id: idCliente },
                estado: (0, typeorm_2.In)([proyecto_entity_1.EstadoProyecto.ACTIVO, proyecto_entity_1.EstadoProyecto.FINALIZADO]),
            },
        });
        return existe;
    }
    async _findOneEntity(id) {
        const proyecto = await this.proyectosRepository.findOne({
            where: { id },
            relations: { cliente: true },
        });
        if (!proyecto) {
            throw new common_1.NotFoundException(`Proyecto con ID ${id} no encontrado`);
        }
        return proyecto;
    }
};
exports.ProyectosService = ProyectosService;
exports.ProyectosService = ProyectosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(proyecto_entity_1.Proyecto)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => clientes_service_1.ClientesService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => tareas_service_1.TareasService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        clientes_service_1.ClientesService,
        tareas_service_1.TareasService])
], ProyectosService);
//# sourceMappingURL=proyectos.service.js.map