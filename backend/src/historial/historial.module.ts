import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistorialCambio } from './entities/historial-cambio.entity';
import { HistorialController } from './historial.controller';
import { HistorialService } from './historial.service';

@Module({
  imports: [TypeOrmModule.forFeature([HistorialCambio])],
  controllers: [HistorialController],
  providers: [HistorialService],
  exports: [HistorialService],
})
export class HistorialModule {}
