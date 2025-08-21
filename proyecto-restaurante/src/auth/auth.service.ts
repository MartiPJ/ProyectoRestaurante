import { Injectable, UnauthorizedException } from "@nestjs/common";
import Usuario from "src/usuario/entities/usuario.entity";
import { UsuarioService } from "src/usuario/usuario.service";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService{
    constructor(private readonly usuarioService: UsuarioService) {}
    async signIn(nombre: string, password: string):Promise<Usuario> {
        const usuario = await this.usuarioService.findByNombre(nombre);
        if (usuario === undefined) {
            throw new UnauthorizedException();
        }

        const isMatch = await bcrypt.compare(password, usuario.password);

        if (!isMatch) {
            throw new UnauthorizedException();
        }

        return usuario;
    }
}