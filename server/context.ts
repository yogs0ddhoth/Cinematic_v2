import { PrismaClient } from '@prisma/client';
import axios, { AxiosInstance } from 'axios';

import * as dotenv from 'dotenv';
dotenv.config();

export interface Context {
  prisma: PrismaClient;
  imdb: AxiosInstance;
}

export const context: Context = {
  prisma: new PrismaClient(),
  imdb: axios.create({
    baseURL: 'https://imdb-api.com/API/AdvancedSearch/' + process.env.IMDB_KEY1,
  }),
};
