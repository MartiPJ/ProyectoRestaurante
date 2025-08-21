import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PlatoService } from './plato.service';
import CreatePlatoDto from './dto/create-plato.dto';
import { UpdatePlatoDto } from './dto/update-plato.dto';

@Controller('plato')
export class PlatoController {
  constructor(private readonly platoService: PlatoService) {}

  @Post()
  create(@Body() body: CreatePlatoDto) {
    return this.platoService.create(body);
  }

  @Get()
  findAll() {
    return this.platoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.platoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdatePlatoDto) {
    return this.platoService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.platoService.remove(+id);
  }
}
