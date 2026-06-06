import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientesService } from './clientes.service';
import { ClientesController } from './clientes.controller';
import { Cliente } from './entities/cliente.entity';
import { ProyectosModule } from '../proyectos/proyectos.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cliente]), forwardRef(() => ProyectosModule)],
  providers: [ClientesService],
  controllers: [ClientesController],
  exports: [ClientesService],
})
export class ClientesModule {}
