import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError, ZodRawShape } from 'zod';
import fs from 'fs/promises';
import { logger } from '@shared/Log/logger';
import { Http_StatusCodes } from '@shared/Enums/Http_StatusCodes';

export const validationRequestMiddleware = (schema: ZodObject<ZodRawShape>) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            req.body = await schema.parseAsync(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const requestAny = req as Request & { file?: Express.Multer.File; files?: Express.Multer.File[] };

                if (requestAny.file) {
                    await fs.unlink(requestAny.file.path).catch(() => {});
                }
                if (requestAny.files && Array.isArray(requestAny.files)) {
                    await Promise.all(
                        (requestAny.files as Express.Multer.File[]).map((file) =>
                            fs.unlink(file.path).catch((err) => {
                                logger.error(`error delete files: ${err}`);
                            }),
                        ),
                    );
                }
                const formatted = error.flatten();
                res.status(Http_StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: 'Invalid request data',
                    errors: formatted.fieldErrors,
                });
                return;
            }
            next(error);
        }
    };
};
