import { Test, TestingModule } from '@nestjs/testing';
import { OrdenPlatoController } from './orden_plato.controller';
import { OrdenPlatoService } from './orden_plato.service';

describe('OrdenPlatoController', () => {
  let controller: OrdenPlatoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdenPlatoController],
      providers: [OrdenPlatoService],
    }).compile();

    controller = module.get<OrdenPlatoController>(OrdenPlatoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
