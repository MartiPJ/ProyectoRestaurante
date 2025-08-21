import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrdenPlatoService } from './orden_plato.service';
import CreateOrdenPlatoDto from './dto/create-orden_plato.dto';
import { UpdateOrdenPlatoDto } from './dto/update-orden_plato.dto';

@Controller('orden-plato')
export class OrdenPlatoController {
  constructor(private readonly ordenPlatoService: OrdenPlatoService) {}

  @Post()
  create(@Body() body: CreateOrdenPlatoDto) {
    return this.ordenPlatoService.create(body);
  }

  @Get()
  findAll() {
    return this.ordenPlatoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordenPlatoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateOrdenPlatoDto) {
    return this.ordenPlatoService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordenPlatoService.remove(+id);
  }
}
