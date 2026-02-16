import express, { Application } from 'express';
import 'dotenv/config';
import cors from 'cors';

import router from '@presentation/Routes/router';

export class App {
  private _app!: Application;
  constructor() {
    this._app = express();

    this.middlewareConfigs();
    this.routeConfigs();
  }

  private middlewareConfigs() {
    this._app.use(
      cors({
        origin: [process.env.CLIENT_SIDE_URL || `http://localhost:5173`],
        credentials: true,
      }),
    );
    this._app.use(express.json());
  }

  private routeConfigs() {
    this._app.use('/api', router);
    this._app.get('/', (req, res) => {
      res.send('Hello World!');
    });
  }

  public getApp(): Application {
    return this._app;
  }
}
