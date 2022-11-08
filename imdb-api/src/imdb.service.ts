import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import axios, { AxiosInstance } from 'axios';
import { ImDbParams } from './types';

// const instance = axios.create({
//   baseURL: 'https://imdb-api.com/API/AdvancedSearch/',
// });
dotenv.config();

@Injectable()
export class ImDbService {
  #imdb: AxiosInstance;
  // #baseURL;

  constructor() {
    this.#imdb = axios.create({
      baseURL:
        'https://imdb-api.com/API/AdvancedSearch/' + process.env.IMDB_KEY1,
    });
    // this.#baseURL =
    //   'https://imdb-api.com/API/AdvancedSearch/' + process.env.IMDB_KEY1;
  }
  getHello() {
    return 'Itz Johhn';
  }

  async axiosGet(params: ImDbParams, url?: string) {
    const imdbGet = await this.#imdb.get('/', {
      params: {
        ...params,
      },
    });
    console.log(imdbGet);
  }
}
