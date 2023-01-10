import { Test, TestingModule } from '@nestjs/testing';
import { MovieDbResolver } from './movie-db.resolver';
import { MovieDbService } from './movie-db.service';

describe('MovieDbResolver', () => {
  let movieDbResolver: MovieDbResolver;
  let movieDbService: MovieDbService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MovieDbResolver],
      providers: [MovieDbService],
    }).compile();

    movieDbResolver = app.get<MovieDbResolver>(MovieDbResolver);
    movieDbService = app.get<MovieDbService>(MovieDbService);
  });
});
