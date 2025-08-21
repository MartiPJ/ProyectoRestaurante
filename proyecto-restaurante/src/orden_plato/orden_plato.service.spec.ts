import { Test, TestingModule } from '@nestjs/testing';
import { OrdenPlatoService } from './orden_plato.service';

describe('OrdenPlatoService', () => {
  let service: OrdenPlatoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdenPlatoService],
    }).compile();

    service = module.get<OrdenPlatoService>(OrdenPlatoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
