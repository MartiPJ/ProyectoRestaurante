import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";
import { LocalStrategy } from "./local.strategy";
import { UsuarioModule } from "src/usuario/usuario.module";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";


@Module({
    controllers:[AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    imports: [
        UsuarioModule,
        JwtModule.registerAsync({
            imports:[ConfigModule],
            inject:[ConfigService],
            useFactory: (ConfigService:ConfigService)=> {
                return{
                    secret: ConfigService.get('JWT_SECRET'),
                    signOptions: {},
                }
            }
        })
    ],
})
export class AuthModule {}