import { Controller, Post, Req, UseGuards } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { LocalGuard } from "./local.guard";
import Usuario from "src/usuario/entities/usuario.entity";
import { Request } from "express";
import { IsPublic } from 'src/common/is-public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly jwtService: JwtService) {}

  @Post('login')
  @IsPublic()
  @UseGuards(LocalGuard)
  async login(@Req() request: Request) {
    const usuario = request.user as Usuario;
    const payload = {
        sub: usuario.id_usuario,
        name: `${usuario.nombre}`,
        iat: new Date().getTime(),
    }

    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken: accessToken,
    }
  }
}