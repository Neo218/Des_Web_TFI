import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ProyectosService } from './proyectos.service';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('proyectos')
@UseGuards(JwtAuthGuard)
export class ProyectosController {
  constructor(private readonly proyectosService: ProyectosService) {}

  @Post()
  create(@Body() createProyectoDto: CreateProyectoDto, @Req() req: any) {
    return this.proyectosService.create(createProyectoDto, req.user);
  }

  @Get()
  findAll() {
    return this.proyectosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.proyectosService.findOne(+id);
  }

  @Get(':id/tareas')
  findOneWithTareas(@Param('id') id: string) {
    return this.proyectosService.findOneWithTareas(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateProyectoDto: UpdateProyectoDto, @Req() req: any) {
    return this.proyectosService.update(+id, updateProyectoDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.proyectosService.remove(+id, req.user);
  }
}
