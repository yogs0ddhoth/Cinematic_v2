import express from 'express';
import path from 'path';

class App {
  express = express();

  constructor() {
    this.#middleware();
    this.#routes();
  }

  #middleware(): void {
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: false }));
    // if (process.env.NODE_ENV === 'production') {
      this.express.use(express.static(path.join(__dirname, '../client/dist/cinematic')));
    // }
  }

  #routes(): void {
    this.express.get('*', (_, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/cinematic/index.html'));
    });
  }
}
export default new App().express;
