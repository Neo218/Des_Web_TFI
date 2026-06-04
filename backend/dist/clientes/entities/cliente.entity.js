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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cliente = exports.EstadoCliente = void 0;
const typeorm_1 = require("typeorm");
const proyecto_entity_1 = require("../../proyectos/entities/proyecto.entity");
var EstadoCliente;
(function (EstadoCliente) {
    EstadoCliente["ACTIVO"] = "ACTIVO";
    EstadoCliente["BAJA"] = "BAJA";
})(EstadoCliente || (exports.EstadoCliente = EstadoCliente = {}));
let Cliente = class Cliente {
    id;
    nombre;
    estado;
    proyectos;
};
exports.Cliente = Cliente;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Cliente.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', unique: true }),
    __metadata("design:type", String)
], Cliente.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: EstadoCliente,
        default: EstadoCliente.ACTIVO,
    }),
    __metadata("design:type", String)
], Cliente.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => proyecto_entity_1.Proyecto, (proyecto) => proyecto.cliente),
    __metadata("design:type", Array)
], Cliente.prototype, "proyectos", void 0);
exports.Cliente = Cliente = __decorate([
    (0, typeorm_1.Entity)('clientes')
], Cliente);
//# sourceMappingURL=cliente.entity.js.map