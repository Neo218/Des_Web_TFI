"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProyectosModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const proyectos_service_1 = require("./proyectos.service");
const proyectos_controller_1 = require("./proyectos.controller");
const proyecto_entity_1 = require("./entities/proyecto.entity");
const clientes_module_1 = require("../clientes/clientes.module");
const tareas_module_1 = require("../tareas/tareas.module");
const historial_module_1 = require("../historial/historial.module");
let ProyectosModule = class ProyectosModule {
};
exports.ProyectosModule = ProyectosModule;
exports.ProyectosModule = ProyectosModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([proyecto_entity_1.Proyecto]),
            (0, common_1.forwardRef)(() => clientes_module_1.ClientesModule),
            (0, common_1.forwardRef)(() => tareas_module_1.TareasModule),
            historial_module_1.HistorialModule,
        ],
        providers: [proyectos_service_1.ProyectosService],
        controllers: [proyectos_controller_1.ProyectosController],
        exports: [proyectos_service_1.ProyectosService],
    })
], ProyectosModule);
//# sourceMappingURL=proyectos.module.js.map