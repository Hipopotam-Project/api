import { Test, TestingModule } from '@nestjs/testing';
import { FiresController } from './fires.controller';
import { FiresService } from './fires.service';

describe('FiresController', () => {
  let controller: FiresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FiresController],
      providers: [FiresService],
    }).compile();

    controller = module.get<FiresController>(FiresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
