"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TareasModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const tareas_service_1 = require("./tareas.service");
const tareas_controller_1 = require("./tareas.controller");
const tarea_entity_1 = require("./entities/tarea.entity");
const proyectos_module_1 = require("../proyectos/proyectos.module");
const historial_module_1 = require("../historial/historial.module");
let TareasModule = class TareasModule {
};
exports.TareasModule = TareasModule;
exports.TareasModule = TareasModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([tarea_entity_1.Tarea]), (0, common_1.forwardRef)(() => proyectos_module_1.ProyectosModule), historial_module_1.HistorialModule],
        providers: [tareas_service_1.TareasService],
        controllers: [tareas_controller_1.TareasController],
        exports: [tareas_service_1.TareasService],
    })
], TareasModule);
//# sourceMappingURL=tareas.module.js.map