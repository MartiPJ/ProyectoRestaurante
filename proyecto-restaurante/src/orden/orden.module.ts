import { Module } from '@nestjs/common';
import { OrdenService } from './orden.service';
import { OrdenController } from './orden.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Orden from './entities/orden.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Orden])],
  controllers: [OrdenController],
  providers: [OrdenService],
  exports: [OrdenService],
})
export class OrdenModule {}
