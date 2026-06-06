import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('clientes')
@UseGuards(JwtAuthGuard)
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  create(@Body() createClienteDto: CreateClienteDto, @Req() req: any) {
    return this.clientesService.create(createClienteDto, req.user);
  }

  @Get()
  findAll() {
    return this.clientesService.findAll();
  }

  @Get('activos')
  findActivos() {
    return this.clientesService.findActivos();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientesService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateClienteDto: UpdateClienteDto, @Req() req: any) {
    return this.clientesService.update(+id, updateClienteDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.clientesService.remove(+id, req.user);
  }
}
