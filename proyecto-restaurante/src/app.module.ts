import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClienteController } from './cliente/cliente.controller';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { ClienteModule } from './cliente/cliente.module';
import { ConfigModule } from '@nestjs/config';
import { MesaModule } from './mesa/mesa.module';
import { OrdenModule } from './orden/orden.module';
import { OrdenPlatoModule } from './orden_plato/orden_plato.module';
import { PlatoModule } from './plato/plato.module';
import { FacturaModule } from './factura/factura.module';
import * as joi from 'joi';
import { Db } from 'typeorm';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:'.env',
      validationSchema:joi.object({
        DB_HOST: joi.string().required(),
        DB_PORT: joi.number().default(5432),
        DB_NAME: joi.string().required(),
        DB_USER: joi.string().required(),
        DB_PASSWORD: joi.string().required(),
        
      })
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST, // nombre del servicio en docker-compose
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true, // solo en desarrollo
    }),  
    ClienteModule, MesaModule, 
    OrdenModule, OrdenPlatoModule, 
    PlatoModule, FacturaModule,
    UsuarioModule,AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
