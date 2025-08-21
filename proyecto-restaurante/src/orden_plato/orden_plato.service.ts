import { Injectable, NotFoundException } from '@nestjs/common';
import CreateOrdenPlatoDto from './dto/create-orden_plato.dto';
import { UpdateOrdenPlatoDto } from './dto/update-orden_plato.dto';
import { InjectRepository } from '@nestjs/typeorm';
import OrdenPlato from './entities/orden_plato.entity';
import { Repository } from 'typeorm';
import Orden from 'src/orden/entities/orden.entity';
import Plato from 'src/plato/entities/plato.entity';

@Injectable()
export class OrdenPlatoService {
  constructor(
    @InjectRepository(OrdenPlato)
    private readonly ordenPlatoRepository: Repository<OrdenPlato>,
    @InjectRepository(Orden)
    private readonly ordenRepository: Repository<Orden>,
    @InjectRepository(Plato)
    private readonly platoRepository: Repository<Plato>,
  ) { }

  create(new_ordenPlato: CreateOrdenPlatoDto) {
    const ordenPlato = this.ordenPlatoRepository.create(new_ordenPlato);
    return this.ordenPlatoRepository.save(ordenPlato);
  }

  findAll() {
    return this.ordenPlatoRepository.find({
     relations: ['orden', 'orden.mesa', 'orden.cliente', 'orden.usuario', 'plato'] // Agrega todas las relaciones que necesites
    });
  }

  findOne(id_ordenPlato: number) {
    return this.ordenPlatoRepository.findOne({
      where: { id_ordenPlato },
      relations: ['orden', 'orden.mesa', 'orden.cliente', 'orden.usuario', 'plato'] // Agrega todas las relaciones que necesites
    });
  }

  async update(id_ordenPlato: number, updateDto: UpdateOrdenPlatoDto) {
    const ordenPlato = await this.findOne(id_ordenPlato);

    if (!ordenPlato) {
      throw new NotFoundException(`OrdenPlato con ID ${id_ordenPlato} no encontrada`);
    }

    // Actualizar cantidad y observaciones si vienen en el body
    if (updateDto.cantidad !== undefined) {
      ordenPlato.cantidad = updateDto.cantidad;
    }

    if (updateDto.observaciones !== undefined) {
      ordenPlato.observaciones = updateDto.observaciones;
    }

    // Actualizar la relación con Orden si viene id_orden
    if (updateDto.id_orden) {
      const nuevaOrden = await this.ordenRepository.findOne({ where: { id_orden: updateDto.id_orden } });
      if (!nuevaOrden) {
        throw new NotFoundException(`Orden con ID ${updateDto.id_orden} no encontrada`);
      }
      ordenPlato.orden = nuevaOrden;
    }

    // Actualizar la relación con Plato si viene id_plato
    if (updateDto.id_plato) {
      const nuevoPlato = await this.platoRepository.findOne({ where: { id_plato: updateDto.id_plato } });
      if (!nuevoPlato) {
        throw new NotFoundException(`Plato con ID ${updateDto.id_plato} no encontrado`);
      }
      ordenPlato.plato = nuevoPlato;
    }

    return await this.ordenPlatoRepository.save(ordenPlato);
  }


  async remove(id_ordenPlato: number) {
    const ordenPlato = await this.findOne(id_ordenPlato);
    return this.ordenPlatoRepository.remove(ordenPlato);
  }
}
