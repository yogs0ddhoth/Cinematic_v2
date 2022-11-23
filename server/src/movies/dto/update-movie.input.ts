import { CreateMovieInput } from './create-movie.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateMovieInput extends PartialType(CreateMovieInput) {
  id: number;
}
