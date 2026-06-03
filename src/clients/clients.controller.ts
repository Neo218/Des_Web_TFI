import {
  Controller,
  Get,
  Post,
  Body,
} from '@nestjs/common';

@Controller('clients')
export class ClientsController {

  @Get()
  findAll() {
    return [];
  }

  @Post()
  create(@Body() body: any) {
    return body;
  }
}