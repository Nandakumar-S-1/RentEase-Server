import { TokenTypes } from '@shared/types/tokens';
import { inject, injectable } from 'tsyringe';
import { Request, Response } from 'express';
import { logger } from '@shared/log/logger';
import { Http_StatusCodes } from '@shared/enums/http-status-codes.enum';
import {
    ICreatePropertyUseCase,
    IGetMyPropertiesUseCase,
} from '@application/interfaces/profile/property.usecase.interface';
import { IS3Service } from '@application/interfaces/services/s3.service.interface';
import { PropertyStatus } from '@shared/enums/property-type-status.enum';

@injectable()
export class PropertyController {
    constructor(
        @inject(TokenTypes.ICreatePropertyUseCase)
        private readonly _createPropertyUseCase: ICreatePropertyUseCase,
        @inject(TokenTypes.IGetMyPropertiesUseCase)
        private readonly _getMyPropertiesUseCase: IGetMyPropertiesUseCase,
        @inject(TokenTypes.IS3Service)
        private readonly _s3Service: IS3Service,
    ) {}
    createProperty = async (req: Request, res: Response): Promise<Response> => {
        logger.info('initiating property creation');
        //here overriding TypeScript .Skip safety checks Assume req.user exists
        const ownerId = req.user!.id;
        const dto = {
            ...req.body,
            ownerId,
        };
        const property = await this._createPropertyUseCase.execute(dto);
        return res.status(Http_StatusCodes.CREATED).json({
            success: true,
            data: property,
        });
    };

    getMyProperties = async (req: Request, res: Response): Promise<Response> => {
        logger.info('fetching owner properties');
        const ownerId = req.user!.id;
        const { status, page = 1, limit = 10 } = req.query;

        const result = await this._getMyPropertiesUseCase.execute({
            ownerId,
            status: status as PropertyStatus,
            page: Number(page),
            limit: Number(limit),
        });

        return res.status(Http_StatusCodes.OK).json({
            success: true,
            data: result,
        });
    };

    uploadPropertyPhotoUrls = async (req: Request, res: Response): Promise<Response> => {
        const ownerId = req.user!.id;
        const { files } = req.body as {
            files?: Array<{ fileName: string; contentType: string }>;
        };

        if (!Array.isArray(files) || files.length === 0) {
            return res.status(Http_StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'Files are required',
            });
        }

        const awsBucket = process.env.AWS_BUCKET_NAME;
        const awsRegion = process.env.AWS_REGION;
        if (!awsBucket || !awsRegion) {
            return res.status(Http_StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'S3 is not configured',
            });
        }

        const uploads = await Promise.all(
            files.map(async (file, index) => {
                const safeFileName = (file.fileName || `photo-${index}`).replace(
                    /[^a-zA-Z0-9._-]/g,
                    '',
                );

                const key = `rentease/properties/${ownerId}/${crypto.randomUUID()}-${index}-${safeFileName}`;
                const uploadUrl = await this._s3Service.getUrl(
                    key,
                    file.contentType || 'image/jpeg',
                );

                const publicUrl = `https://${awsBucket}.s3.${awsRegion}.amazonaws.com/${key}`;
                return { key, uploadUrl, publicUrl };
            }),
        );

        return res.status(Http_StatusCodes.OK).json({
            success: true,
            data: { uploads },
        });
    };
}
