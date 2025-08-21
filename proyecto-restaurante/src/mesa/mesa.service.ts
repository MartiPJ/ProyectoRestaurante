import { Injectable } from '@nestjs/common';
import CreateMesaDto from './dto/create-mesa.dto';
import { UpdateMesaDto } from './dto/update-mesa.dto';
import { Repository } from 'typeorm';
import Mesa from './entities/mesa.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MesaService {
  constructor(
    @InjectRepository(Mesa)
    private readonly mesaRepository: Repository<Mesa>,
  ){}

  create(new_mesa: CreateMesaDto) {
    const mesa = this.mesaRepository.create(new_mesa);
    return this.mesaRepository.save(mesa);
  }

  findAll() {
    return this.mesaRepository.find();
  }

  async findOne(id_mesa: number) {
    const record = await this.mesaRepository.findOne({
      where: { id_mesa },
    });
    if (record === null) {
      throw new Error(`Mesa with id ${id_mesa} not found`);
    }
    return record;
  }

  async update(id: number, update_mesa: UpdateMesaDto) {
    const mesa = await this.findOne(id);

    this.mesaRepository.merge(mesa, update_mesa);

    return this.mesaRepository.save(mesa);
  }

  async remove(id: number) {
    const mesa = await this.findOne(id);

    return this.mesaRepository.remove(mesa);
  }
}
