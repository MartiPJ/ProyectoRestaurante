import { Injectable } from '@nestjs/common';
import CreateUsuarioDto from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Repository } from 'typeorm';
import Usuario from './entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ){}
  create(createUsuarioDto: CreateUsuarioDto) {
    const usuario = this.usuarioRepository.create(createUsuarioDto);
    return this.usuarioRepository.save(usuario);
  }

  findAll() {
    return this.usuarioRepository.find();
  }

  async findOne(id_usuario: number) {
    const record = await this.usuarioRepository.findOne({ 
      where: { id_usuario },
    });

    if(record === null){
      throw new Error(`Usuario with id ${id_usuario} not found`);
    }
    return record;
  }

  async findByNombre(nombre:string):Promise<Usuario | undefined>{
    return this.usuarioRepository.findOne({
      where: { nombre }
    });
  }


  async update(id_usuario: number, updateUsuario: UpdateUsuarioDto) {
    const usuario = await this.findOne(id_usuario);
    this.usuarioRepository.merge(usuario, updateUsuario);
    return this.usuarioRepository.save(usuario);
  }

  async remove(id_usuario: number) {
    const usuario = await this.findOne(id_usuario);
    return this.usuarioRepository.remove(usuario);
  }
}
