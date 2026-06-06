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
exports.TareasController = void 0;
const common_1 = require("@nestjs/common");
const tareas_service_1 = require("./tareas.service");
const create_tarea_dto_1 = require("./dto/create-tarea.dto");
const update_tarea_dto_1 = require("./dto/update-tarea.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let TareasController = class TareasController {
    tareasService;
    constructor(tareasService) {
        this.tareasService = tareasService;
    }
    create(createTareaDto) {
        return this.tareasService.create(createTareaDto);
    }
    findAll() {
        return this.tareasService.findAll();
    }
    findByProyecto(idProyecto) {
        return this.tareasService.findByProyecto(+idProyecto);
    }
    findOne(id) {
        return this.tareasService.findOne(+id);
    }
    update(id, updateTareaDto) {
        return this.tareasService.update(+id, updateTareaDto);
    }
    remove(id) {
        return this.tareasService.remove(+id);
    }
};
exports.TareasController = TareasController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_tarea_dto_1.CreateTareaDto]),
    __metadata("design:returntype", void 0)
], TareasController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TareasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('proyecto/:idProyecto'),
    __param(0, (0, common_1.Param)('idProyecto')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TareasController.prototype, "findByProyecto", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TareasController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_tarea_dto_1.UpdateTareaDto]),
    __metadata("design:returntype", void 0)
], TareasController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TareasController.prototype, "remove", null);
exports.TareasController = TareasController = __decorate([
    (0, common_1.Controller)('tareas'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [tareas_service_1.TareasService])
], TareasController);
//# sourceMappingURL=tareas.controller.js.map