import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { TareasService } from './tareas.service';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tareas')
@UseGuards(JwtAuthGuard)
export class TareasController {
  constructor(private readonly tareasService: TareasService) {}

  @Post()
  create(@Body() createTareaDto: CreateTareaDto, @Req() req: any) {
    return this.tareasService.create(createTareaDto, req.user);
  }

  @Get()
  findAll() {
    return this.tareasService.findAll();
  }

  @Get('proyecto/:idProyecto')
  findByProyecto(@Param('idProyecto') idProyecto: string) {
    return this.tareasService.findByProyecto(+idProyecto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tareasService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTareaDto: UpdateTareaDto, @Req() req: any) {
    return this.tareasService.update(+id, updateTareaDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.tareasService.remove(+id, req.user);
  }
}
