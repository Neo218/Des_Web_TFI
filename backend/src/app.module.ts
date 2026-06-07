import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ClientesModule } from './clientes/clientes.module';
import { ProyectosModule } from './proyectos/proyectos.module';
import { TareasModule } from './tareas/tareas.module';
import { Usuario } from './usuarios/entities/usuario.entity';
import { Cliente } from './clientes/entities/cliente.entity';
import { Proyecto } from './proyectos/entities/proyecto.entity';
import { Tarea } from './tareas/entities/tarea.entity';
import { HistorialModule } from './historial/historial.module';
import { HistorialCambio } from './historial/entities/historial-cambio.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'gestion_proyectos',
      entities: [Usuario, Cliente, Proyecto, Tarea, HistorialCambio],
      synchronize: false,
    }),
    AuthModule,
    UsuariosModule,
    ClientesModule,
    ProyectosModule,
    TareasModule,
    HistorialModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
    console.log('DB_HOST=', process.env.DB_HOST);
    console.log('DB_PORT=', process.env.DB_PORT);
    console.log('DB_USERNAME=', process.env.DB_USERNAME);
    console.log('DB_PASSWORD=', process.env.DB_PASSWORD);
    console.log('DB_DATABASE=', process.env.DB_DATABASE);
  }
}