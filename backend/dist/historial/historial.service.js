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
exports.HistorialService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const historial_cambio_entity_1 = require("./entities/historial-cambio.entity");
let HistorialService = class HistorialService {
    historialRepository;
    constructor(historialRepository) {
        this.historialRepository = historialRepository;
    }
    async registrarCambio(params) {
        const cambio = this.historialRepository.create({
            entidad: params.entidad,
            id_registro: params.idRegistro ?? null,
            accion: params.accion,
            usuario_id: params.usuario?.userId ?? null,
            usuario_nombre: params.usuario?.username ?? 'Sistema',
            detalle: params.detalle ? JSON.stringify(params.detalle) : null,
        });
        await this.historialRepository.save(cambio);
    }
    async findAll() {
        return this.historialRepository.find({
            order: { fecha: 'DESC', id: 'DESC' },
            take: 200,
        });
    }
};
exports.HistorialService = HistorialService;
exports.HistorialService = HistorialService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(historial_cambio_entity_1.HistorialCambio)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], HistorialService);
//# sourceMappingURL=historial.service.js.map