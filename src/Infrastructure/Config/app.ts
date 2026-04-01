import express, { Application } from 'express';
import 'dotenv/config';
import cors from 'cors';

import cookieParser from 'cookie-parser';
import router from 'presentation/routes/router';
import { ErrorHandlerMiddleWare } from 'presentation/middlewares/error-handler.middleware';
import { Request, Response, NextFunction } from 'express';
import { globalLimiter } from 'presentation/middlewares/rate-limiter';
export class App {
    private _app!: Application;
    constructor() {
        this._app = express();
        this.middlewareConfigs();
        this.routeConfigs();
        this.setupErrorHandling();
    }

    private middlewareConfigs() {
        //   this._app.use(
        //     cors({
        //       origin: [process.env.CLIENT_SIDE_URL || `http://localhost:5173`],
        //       credentials: true,
        //     }),
        //   );

        const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];

        this._app.use(
            cors({
                origin: (origin, callback) => {
                    if (!origin) return callback(null, true);

                    if (allowedOrigins.includes(origin) || origin.includes('devtunnels.ms')) {
                        return callback(null, true);
                    }
                    return callback(new Error('CORS blocked'));
                },
                credentials: true,
            }),
        );

        this._app.use(express.json());
        this._app.use(cookieParser());
    }

    private routeConfigs() {
        this._app.use('/api', globalLimiter, router);
        this._app.get('/', (req, res) => {
            res.send('Hello World!');
        });
    }

    private setupErrorHandling(): void {
        const errorHandler = new ErrorHandlerMiddleWare();
        this._app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            errorHandler.handleError(err, req, res, next);
        });
    }

    public getApp(): Application {
        return this._app;
    }
}
