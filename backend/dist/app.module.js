"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const usuarios_module_1 = require("./usuarios/usuarios.module");
const clientes_module_1 = require("./clientes/clientes.module");
const proyectos_module_1 = require("./proyectos/proyectos.module");
const tareas_module_1 = require("./tareas/tareas.module");
const usuario_entity_1 = require("./usuarios/entities/usuario.entity");
const cliente_entity_1 = require("./clientes/entities/cliente.entity");
const proyecto_entity_1 = require("./proyectos/entities/proyecto.entity");
const tarea_entity_1 = require("./tareas/entities/tarea.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DB_HOST || 'localhost',
                port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
                username: process.env.DB_USERNAME || 'postgres',
                password: process.env.DB_PASSWORD || 'postgres',
                database: process.env.DB_DATABASE || 'gestion_proyectos',
                entities: [usuario_entity_1.Usuario, cliente_entity_1.Cliente, proyecto_entity_1.Proyecto, tarea_entity_1.Tarea],
                synchronize: false,
            }),
            auth_module_1.AuthModule,
            usuarios_module_1.UsuariosModule,
            clientes_module_1.ClientesModule,
            proyectos_module_1.ProyectosModule,
            tareas_module_1.TareasModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map