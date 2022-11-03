import { Injectable } from '@nestjs/common';
import { CreateMovieInput, UpdateMovieInput } from 'src/graphql';

@Injectable()
export class MoviesService {
  create(createMovieInput: CreateMovieInput) {
    return 'This action adds a new movie';
  }

  createMany(addMoviesInput: CreateMovieInput[]) {
    return 'This action batch adds new movies';
  }

  findAll() {
    return `This action returns all movies`;
  }

  findOne(id: string) {
    return `This action returns a #${id} movie`;
  }

  update(id: string, updateMovieInput: UpdateMovieInput) {
    return `This action updates a #${id} movie`;
  }

  remove(id: string) {
    return `This action removes a #${id} movie`;
  }
}
