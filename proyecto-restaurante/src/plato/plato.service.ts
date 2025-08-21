import { Injectable } from '@nestjs/common';
import CreatePlatoDto from './dto/create-plato.dto';
import { UpdatePlatoDto } from './dto/update-plato.dto';
import { InjectRepository } from '@nestjs/typeorm';
import Plato from './entities/plato.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PlatoService {
  constructor(
    @InjectRepository(Plato)
    private readonly platoRepository: Repository<Plato>,
  ) {}

  create(createPlatoDto: CreatePlatoDto) {
    const plato = this.platoRepository.create(createPlatoDto);
    return this.platoRepository.save(plato);
  }

  findAll() {
    return this.platoRepository.find();
  }

  findOne(id: number) {
    return this.platoRepository.findOneBy({ id_plato: id });
  }

  async update(id: number, updatePlatoDto: UpdatePlatoDto) {
    const plato = await this.findOne(id);
    this.platoRepository.merge(plato, updatePlatoDto);
    return this.platoRepository.save(plato);
  }

  async remove(id: number) {
    const plato = await this.findOne(id);
    return this.platoRepository.remove(plato);
  }
}
