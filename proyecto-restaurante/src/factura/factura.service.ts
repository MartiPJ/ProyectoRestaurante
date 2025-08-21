import { Injectable } from '@nestjs/common';
import CreateFacturaDto from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';
import { Repository } from 'typeorm';
import Factura from './entities/factura.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FacturaService {
  constructor(
    @InjectRepository(Factura)
    private readonly facturaRepository: Repository<Factura>
  ) {}

  create(createFacturaDto: CreateFacturaDto) {
    const factura = this.facturaRepository.create(createFacturaDto);
    return this.facturaRepository.save(factura);
  }

  findAll() {
    return this.facturaRepository.find();
  }

  async findOne(id_factura: number) {
    const record = await this.facturaRepository.findOne({ 
      where: { id_factura },
    });
    if (record === null) {
      throw new Error(`Factura with id ${id_factura} not found`);
    }
    return record;
  }

  async update(id_factura: number, updateFactura: UpdateFacturaDto) {
    const factura = await this.findOne(id_factura);
    this.facturaRepository.merge(factura, updateFactura);
    return this.facturaRepository.save(factura);
  }

  async remove(id: number) {
    const factura = await this.findOne(id);
    return this.facturaRepository.remove(factura);
  }
}
