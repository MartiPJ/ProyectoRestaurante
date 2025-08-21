import { Module } from '@nestjs/common';
import { OrdenPlatoService } from './orden_plato.service';
import { OrdenPlatoController } from './orden_plato.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import OrdenPlato from './entities/orden_plato.entity';
import { OrdenModule } from '../orden/orden.module'; // importa el módulo que expone OrdenRepository
import { PlatoModule } from '../plato/plato.module'; // importa también si necesitas PlatoRepository

@Module({
  imports: [
    TypeOrmModule.forFeature([OrdenPlato]),
    OrdenModule,
    PlatoModule,
  ],
  controllers: [OrdenPlatoController],
  providers: [OrdenPlatoService],
  exports: [OrdenPlatoService],
})
export class OrdenPlatoModule {}
