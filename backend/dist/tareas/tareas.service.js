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
exports.TareasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const tarea_entity_1 = require("./entities/tarea.entity");
const historial_service_1 = require("../historial/historial.service");
let TareasService = class TareasService {
    tareasRepository;
    historialService;
    constructor(tareasRepository, historialService) {
        this.tareasRepository = tareasRepository;
        this.historialService = historialService;
    }
    async create(createTareaDto, usuario) {
        const tarea = this.tareasRepository.create(createTareaDto);
        const saved = await this.tareasRepository.save(tarea);
        await this.historialService.registrarCambio({
            entidad: 'Tareas',
            idRegistro: saved.id,
            accion: 'CREACION',
            usuario,
            detalle: {
                despues: {
                    id: saved.id,
                    descripcion: saved.descripcion,
                    estado: saved.estado,
                    id_proyecto: saved.id_proyecto,
                },
            },
        });
        return { id: saved.id };
    }
    async findAll() {
        const tareas = await this.tareasRepository.find({
            relations: { proyecto: { cliente: true } },
            order: { id: 'ASC' },
        });
        return tareas.map(t => {
            const clienteDto = t.proyecto?.cliente ? {
                id: t.proyecto.cliente.id,
                nombre: t.proyecto.cliente.nombre,
                estado: t.proyecto.cliente.estado,
            } : undefined;
            const proyectoDto = {
                id: t.proyecto.id,
                nombre: t.proyecto.nombre,
                estado: t.proyecto.estado,
                cliente: clienteDto,
            };
            return {
                id: t.id,
                descripcion: t.descripcion,
                estado: t.estado,
                proyecto: proyectoDto,
            };
        });
    }
    async findByProyecto(idProyecto) {
        const tareas = await this.tareasRepository.find({
            where: { id_proyecto: idProyecto },
            relations: { proyecto: { cliente: true } },
            order: { id: 'ASC' },
        });
        return tareas.map(t => {
            const clienteDto = t.proyecto?.cliente ? {
                id: t.proyecto.cliente.id,
                nombre: t.proyecto.cliente.nombre,
                estado: t.proyecto.cliente.estado,
            } : undefined;
            const proyectoDto = {
                id: t.proyecto.id,
                nombre: t.proyecto.nombre,
                estado: t.proyecto.estado,
                cliente: clienteDto,
            };
            return {
                id: t.id,
                descripcion: t.descripcion,
                estado: t.estado,
                proyecto: proyectoDto,
            };
        });
    }
    async findOne(id) {
        const tarea = await this._findOneEntity(id);
        const clienteDto = tarea.proyecto?.cliente ? {
            id: tarea.proyecto.cliente.id,
            nombre: tarea.proyecto.cliente.nombre,
            estado: tarea.proyecto.cliente.estado,
        } : undefined;
        const proyectoDto = {
            id: tarea.proyecto.id,
            nombre: tarea.proyecto.nombre,
            estado: tarea.proyecto.estado,
            cliente: clienteDto,
        };
        return {
            id: tarea.id,
            descripcion: tarea.descripcion,
            estado: tarea.estado,
            proyecto: proyectoDto,
        };
    }
    async update(id, updateTareaDto, usuario) {
        const tarea = await this._findOneEntity(id);
        const antes = {
            id: tarea.id,
            descripcion: tarea.descripcion,
            estado: tarea.estado,
            id_proyecto: tarea.id_proyecto,
            proyecto: tarea.proyecto?.nombre,
        };
        Object.assign(tarea, updateTareaDto);
        const saved = await this.tareasRepository.save(tarea);
        await this.historialService.registrarCambio({
            entidad: 'Tareas',
            idRegistro: saved.id,
            accion: 'MODIFICACION',
            usuario,
            detalle: {
                antes,
                despues: {
                    id: saved.id,
                    descripcion: saved.descripcion,
                    estado: saved.estado,
                    id_proyecto: saved.id_proyecto,
                },
            },
        });
        const clienteDto = saved.proyecto?.cliente ? {
            id: saved.proyecto.cliente.id,
            nombre: saved.proyecto.cliente.nombre,
            estado: saved.proyecto.cliente.estado,
        } : undefined;
        const proyectoDto = {
            id: saved.proyecto.id,
            nombre: saved.proyecto.nombre,
            estado: saved.proyecto.estado,
            cliente: clienteDto,
        };
        return {
            id: saved.id,
            descripcion: saved.descripcion,
            estado: saved.estado,
            proyecto: proyectoDto,
        };
    }
    async remove(id, usuario) {
        const tarea = await this._findOneEntity(id);
        const antes = {
            id: tarea.id,
            descripcion: tarea.descripcion,
            estado: tarea.estado,
            id_proyecto: tarea.id_proyecto,
            proyecto: tarea.proyecto?.nombre,
        };
        await this.tareasRepository.remove(tarea);
        await this.historialService.registrarCambio({
            entidad: 'Tareas',
            idRegistro: id,
            accion: 'ELIMINACION',
            usuario,
            detalle: { antes },
        });
    }
    async _findOneEntity(id) {
        const tarea = await this.tareasRepository.findOne({
            where: { id },
            relations: { proyecto: { cliente: true } },
        });
        if (!tarea) {
            throw new common_1.NotFoundException(`Tarea con ID ${id} no encontrada`);
        }
        return tarea;
    }
    async existeTareaPorIdProyecto(idProyecto) {
        const existe = await this.tareasRepository.exists({
            where: {
                id_proyecto: idProyecto,
                estado: (0, typeorm_2.In)([tarea_entity_1.EstadoTarea.PENDIENTE, tarea_entity_1.EstadoTarea.FINALIZADA]),
            },
        });
        return existe;
    }
};
exports.TareasService = TareasService;
exports.TareasService = TareasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tarea_entity_1.Tarea)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        historial_service_1.HistorialService])
], TareasService);
//# sourceMappingURL=tareas.service.js.map