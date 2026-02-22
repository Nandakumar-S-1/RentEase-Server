import express, { Application } from 'express';
import 'dotenv/config';
import cors from 'cors';

import router from '@presentation/Routes/router';
import { ErrorHandlerMiddleWare } from '@presentation/Middlewares/ErrorHandlerMiddleware';
import {Request,Response,NextFunction} from 'express'
export class App {
  private _app!: Application;
  constructor() {
    this._app = express();
    this.middlewareConfigs();
    this.routeConfigs();
    this.setupErrorHandling()
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

  private setupErrorHandling():void{
    const errorHandler = new ErrorHandlerMiddleWare()
    this._app.use((
      err:Error,req:Request,res:Response,next:NextFunction
    )=>{
      errorHandler.handleError(err,req,res,next)
    }
    )
  }

  public getApp(): Application {
    return this._app;
  }
}
