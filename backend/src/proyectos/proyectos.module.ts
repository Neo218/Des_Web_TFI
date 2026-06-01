import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProyectosService } from './proyectos.service';
import { ProyectosController } from './proyectos.controller';
import { Proyecto } from './entities/proyecto.entity';
import { ClientesModule } from '../clientes/clientes.module';

@Module({
  imports: [TypeOrmModule.forFeature([Proyecto]), forwardRef(() => ClientesModule)],
  providers: [ProyectosService],
  controllers: [ProyectosController],
  exports: [ProyectosService],
})
export class ProyectosModule {}
