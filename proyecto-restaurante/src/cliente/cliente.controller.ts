import {Body, Controller, Get, Param, Post, Put, Delete} from '@nestjs/common';
import CreateClienteDto from './dtos/create-cliente.dto';
import UpdateClienteDto from './dtos/update-cliente.dto';
import { ClienteService } from './cliente.service';

@Controller('cliente')
export class ClienteController {
    constructor(private readonly clienteService: ClienteService) {}
    
    @Get()
    findAll() {
        const records = this.clienteService.findAll();
        return records;
    }

    @Post()
    create(@Body() body: CreateClienteDto){
        return this.clienteService.create(body);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() body) {
        return this.clienteService.update(id,body)
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.clienteService.remove(id);
    }

}