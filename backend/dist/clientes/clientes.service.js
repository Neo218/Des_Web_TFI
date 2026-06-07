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
exports.ClientesService = void 0;
const common_1 = require("@nestjs/common");
const cliente_entity_1 = require("./entities/cliente.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cliente_entity_2 = require("./entities/cliente.entity");
const proyectos_service_1 = require("../proyectos/proyectos.service");
const historial_service_1 = require("../historial/historial.service");
let ClientesService = class ClientesService {
    clientesRepository;
    proyectosService;
    historialService;
    constructor(clientesRepository, proyectosService, historialService) {
        this.clientesRepository = clientesRepository;
        this.proyectosService = proyectosService;
        this.historialService = historialService;
    }
    async create(createClienteDto, usuario) {
        const existing = await this.clientesRepository.findOne({
            where: { nombre: createClienteDto.nombre },
        });
        if (existing) {
            throw new common_1.ConflictException('Ya existe un cliente con ese nombre');
        }
        const cliente = this.clientesRepository.create(createClienteDto);
        const saved = await this.clientesRepository.save(cliente);
        await this.historialService.registrarCambio({
            entidad: 'Clientes',
            idRegistro: saved.id,
            accion: 'CREACION',
            usuario,
            detalle: { despues: { id: saved.id, nombre: saved.nombre, estado: saved.estado } },
        });
        return { id: saved.id };
    }
    async findAll() {
        const clientes = await this.clientesRepository.find({ order: { id: 'ASC' } });
        return clientes.map(c => ({ id: c.id, nombre: c.nombre, estado: c.estado }));
    }
    async findActivos() {
        const clientes = await this.clientesRepository.find({ where: { estado: cliente_entity_1.EstadoCliente.ACTIVO }, order: { id: 'ASC' } });
        return clientes.map(c => ({ id: c.id, nombre: c.nombre, estado: c.estado }));
    }
    async findOne(id) {
        const cliente = await this._findOneEntity(id);
        return { id: cliente.id, nombre: cliente.nombre, estado: cliente.estado };
    }
    async update(id, updateClienteDto, usuario) {
        const cliente = await this._findOneEntity(id);
        const antes = { id: cliente.id, nombre: cliente.nombre, estado: cliente.estado };
        if (updateClienteDto.estado === cliente_entity_1.EstadoCliente.BAJA) {
            const relacionadoConProyectos = await this.proyectosService.existeProyectoPorIdCliente(id);
            if (relacionadoConProyectos) {
                throw new common_1.BadRequestException('No se puede dar de baja un cliente con proyectos relacionados');
            }
        }
        Object.assign(cliente, updateClienteDto);
        const saved = await this.clientesRepository.save(cliente);
        await this.historialService.registrarCambio({
            entidad: 'Clientes',
            idRegistro: saved.id,
            accion: 'MODIFICACION',
            usuario,
            detalle: { antes, despues: { id: saved.id, nombre: saved.nombre, estado: saved.estado } },
        });
        return { id: saved.id, nombre: saved.nombre, estado: saved.estado };
    }
    async remove(id, usuario) {
        const cliente = await this._findOneEntity(id);
        const antes = { id: cliente.id, nombre: cliente.nombre, estado: cliente.estado };
        const relacionadoConProyectos = await this.proyectosService.existeProyectoPorIdCliente(id);
        if (relacionadoConProyectos) {
            throw new common_1.BadRequestException('No se puede dar de baja un cliente con proyectos relacionados');
        }
        cliente.estado = cliente_entity_1.EstadoCliente.BAJA;
        const saved = await this.clientesRepository.save(cliente);
        await this.historialService.registrarCambio({
            entidad: 'Clientes',
            idRegistro: id,
            accion: 'ELIMINACION',
            usuario,
            detalle: {
                antes,
                despues: { id: saved.id, nombre: saved.nombre, estado: saved.estado },
            },
        });
        return { id: saved.id, nombre: saved.nombre, estado: saved.estado };
    }
    async existeClienteActivoPorId(id) {
        const existe = await this.clientesRepository.exists({
            where: { id, estado: cliente_entity_1.EstadoCliente.ACTIVO },
        });
        return existe;
    }
    async _findOneEntity(id) {
        const cliente = await this.clientesRepository.findOne({ where: { id } });
        if (!cliente) {
            throw new common_1.NotFoundException(`Cliente con ID ${id} no encontrado`);
        }
        return cliente;
    }
};
exports.ClientesService = ClientesService;
exports.ClientesService = ClientesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cliente_entity_2.Cliente)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => proyectos_service_1.ProyectosService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        proyectos_service_1.ProyectosService,
        historial_service_1.HistorialService])
], ClientesService);
//# sourceMappingURL=clientes.service.js.map