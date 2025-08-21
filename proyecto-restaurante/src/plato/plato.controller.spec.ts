import { Test, TestingModule } from '@nestjs/testing';
import { PlatoController } from './plato.controller';
import { PlatoService } from './plato.service';

describe('PlatoController', () => {
  let controller: PlatoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlatoController],
      providers: [PlatoService],
    }).compile();

    controller = module.get<PlatoController>(PlatoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
