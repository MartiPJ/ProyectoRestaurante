import { Injectable } from '@nestjs/common';
import CreateOrdenDto from './dto/create-orden.dto';
import { UpdateOrdenDto } from './dto/update-orden.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Orden from './entities/orden.entity';

@Injectable()
export class OrdenService {
  @InjectRepository(Orden)
  private readonly ordenRepository: Repository<Orden>;

  create(new_orden: CreateOrdenDto) {
    const orden = this.ordenRepository.create(new_orden);
    return this.ordenRepository.save(orden);
  }

  findAll() {
    return this.ordenRepository.find({
      relations: ['mesa', 'cliente', 'usuario' ] // Agrega todas las relaciones que necesites
    });
  }

  findOne(id_orden: number) {
    return this.ordenRepository.findOne({
      where: { id_orden },
      relations: ['mesa', 'cliente', 'usuario'] // Agrega todas las relaciones que necesites
    });
  }

  async update(id: number, update_orden: UpdateOrdenDto) {
    const orden = await this.findOne(id);
    
    this.ordenRepository.merge(orden,  update_orden);
    return this.ordenRepository.save(orden);
  }

  async remove(id: number) {
    const orden = await this.findOne(id);
    return this.ordenRepository.remove(orden);
  }
}
