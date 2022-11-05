import { Test, TestingModule } from '@nestjs/testing';
import { ImDbController } from './imdb.controller';
import { ImDbService } from './imdb.service';

describe('ImDbController', () => {
  let ImDbController: ImDbController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ImDbController],
      providers: [ImDbService],
    }).compile();

    ImDbController = app.get<ImDbController>(ImDbController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(ImDbController.getHello()).toBe('Hello World!');
    });
  });
});
