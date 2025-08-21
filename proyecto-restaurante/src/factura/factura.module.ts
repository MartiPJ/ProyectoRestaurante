import { Module } from '@nestjs/common';
import { FacturaService } from './factura.service';
import { FacturaController } from './factura.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Factura from './entities/factura.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Factura])],
  controllers: [FacturaController],
  providers: [FacturaService],
  exports:[FacturaService],
})
export class FacturaModule {}
