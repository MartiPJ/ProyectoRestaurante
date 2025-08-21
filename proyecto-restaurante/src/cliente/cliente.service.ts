import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import cliente from './entities/cliente.entity';
import { Repository } from 'typeorm';
import CreateClienteDto from './dtos/create-cliente.dto';
import UpdateClienteDto from './dtos/update-cliente.dto';

@Injectable()
export class ClienteService { 
    constructor(
        @InjectRepository(cliente)
        private readonly clienteRepository: Repository<cliente>,
    ){}

    findAll(){
        return this.clienteRepository.find();
    }

    async findOne(id_cliente: number) {
        const record = await this.clienteRepository.findOne({
            where: { id_cliente },
        });

        if (record === null) {
            throw new NotFoundException(`Cliente #${id_cliente} not found`);
        }

        return record;
    }

    create(new_cliente: CreateClienteDto) {
        const cliente = this.clienteRepository.create(new_cliente);
        return this.clienteRepository.save(cliente);
    }

    async update(id: number, update_cliente: UpdateClienteDto) {
        const cliente = await this.findOne(id);

        this.clienteRepository.merge(cliente, update_cliente);

        return this.clienteRepository.save(cliente);
    }

    async remove(id_cliente: number) {
        const cliente = await this.findOne(id_cliente);

        return this.clienteRepository.remove(cliente);
    }

}