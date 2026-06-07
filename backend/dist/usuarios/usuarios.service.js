"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuariosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const usuario_entity_1 = require("./entities/usuario.entity");
const historial_service_1 = require("../historial/historial.service");
let UsuariosService = class UsuariosService {
    usuariosRepository;
    historialService;
    constructor(usuariosRepository, historialService) {
        this.usuariosRepository = usuariosRepository;
        this.historialService = historialService;
    }
    async create(createUsuarioDto, usuarioAutenticado) {
        const existing = await this.usuariosRepository.findOne({
            where: { nombre: createUsuarioDto.nombre },
        });
        if (existing) {
            throw new common_1.ConflictException('Ya existe un usuario con ese nombre');
        }
        const hashedPassword = await bcrypt.hash(createUsuarioDto.clave, 10);
        const usuario = this.usuariosRepository.create({
            ...createUsuarioDto,
            clave: hashedPassword,
        });
        const saved = await this.usuariosRepository.save(usuario);
        await this.historialService.registrarCambio({
            entidad: 'Usuarios',
            idRegistro: saved.id,
            accion: 'CREACION',
            usuario: usuarioAutenticado,
            detalle: { despues: { id: saved.id, nombre: saved.nombre, estado: saved.estado } },
        });
        return saved;
    }
    async findAll() {
        return this.usuariosRepository.find();
    }
    async findOne(id) {
        const usuario = await this.usuariosRepository.findOne({ where: { id } });
        if (!usuario) {
            throw new common_1.NotFoundException(`Usuario con ID ${id} no encontrado`);
        }
        return usuario;
    }
    async update(id, updateUsuarioDto, usuarioAutenticado) {
        const usuario = await this.findOne(id);
        const antes = { id: usuario.id, nombre: usuario.nombre, estado: usuario.estado };
        const dto = updateUsuarioDto;
        if (dto.clave) {
            dto.clave = await bcrypt.hash(dto.clave, 10);
        }
        Object.assign(usuario, updateUsuarioDto);
        const saved = await this.usuariosRepository.save(usuario);
        await this.historialService.registrarCambio({
            entidad: 'Usuarios',
            idRegistro: saved.id,
            accion: 'MODIFICACION',
            usuario: usuarioAutenticado,
            detalle: { antes, despues: { id: saved.id, nombre: saved.nombre, estado: saved.estado } },
        });
        return saved;
    }
    async remove(id, usuarioAutenticado) {
        const usuario = await this.findOne(id);
        const antes = { id: usuario.id, nombre: usuario.nombre, estado: usuario.estado };
        await this.usuariosRepository.remove(usuario);
        await this.historialService.registrarCambio({
            entidad: 'Usuarios',
            idRegistro: id,
            accion: 'ELIMINACION',
            usuario: usuarioAutenticado,
            detalle: { antes },
        });
    }
};
exports.UsuariosService = UsuariosService;
exports.UsuariosService = UsuariosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(usuario_entity_1.Usuario)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        historial_service_1.HistorialService])
], UsuariosService);
//# sourceMappingURL=usuarios.service.js.map