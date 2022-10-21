import express from "express";
import path from "path";

class App {
    public express: express.Application;

    constructor() {
        this.express = express();
        this.#middleware();
        this.#routes();
    }

    #middleware(): void {
        this.express.use(express.json())
        this.express.use(express.urlencoded({ extended: false }));
        if (process.env.NODE_ENV === 'production') {
            this.express.use(express.static(path.join(__dirname, '../client/build')));
          }
    }

    #routes(): void {
        // this.express.use("/", (req, res, next) => {
        //     res.send("Make sure url is correct!!!");
        // });
    }
}
export default new App().express;