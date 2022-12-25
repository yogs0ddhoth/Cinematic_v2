import { Test, TestingModule } from '@nestjs/testing';
import { ActorService } from './actor.service';

describe('StarService', () => {
  let service: ActorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActorService],
    }).compile();

    service = module.get<ActorService>(ActorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
