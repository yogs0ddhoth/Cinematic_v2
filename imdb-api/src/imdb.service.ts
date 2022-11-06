import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ImDbParams } from './types';

// const instance = axios.create({
//   baseURL: 'https://imdb-api.com/API/AdvancedSearch/',
// });

@Injectable()
export class ImDbService {
  #imdb;
  #baseURL;

  constructor() {
    this.#imdb = axios;
    this.#baseURL =
      'https://imdb-api.com/API/AdvancedSearch/' + process.env.IMDB_KEY1;
  }
  getHello() {
    return 'Itz Johhn';
  }

  async axiosGet(params: ImDbParams, url?: string) {
    return await this.#imdb.get(
      this.#baseURL +
        '?title=' +
        params.title +
        '&title_type=feature,tv_movie,documentary',
    );
  }
}
