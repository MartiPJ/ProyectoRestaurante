import { Injectable, PayloadTooLargeException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {ExtractJwt, Strategy} from 'passport-jwt';
import { UsuarioService } from "src/usuario/usuario.service";

type Payload = {
    sub: number;
    nombre:string;
    iat:number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private readonly usuarioService:UsuarioService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: Payload){
        const usuario = await this.usuarioService.findOne(payload.sub);
        return usuario;
    }
    
}