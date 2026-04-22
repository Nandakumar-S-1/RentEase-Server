import { TokenTypes } from '@shared/types/tokens';
import { inject, injectable } from 'tsyringe';
import { Request, Response } from 'express';
import { logger } from '@shared/log/logger';
import { Http_StatusCodes } from '@shared/enums/http-status-codes.enum';
import {
    ICreatePropertyUseCase,
    IGetPropertyByIdUseCase,
    IUpdatePropertyUseCase,
    IUnlistPropertyUseCase,
    IDeletePropertyUseCase,
    IGetMyPropertiesUseCase,
    IGetAllPropertiesUseCase,
} from '@application/interfaces/property/property.usecase.interface';
import { IS3Service } from '@application/interfaces/services/s3.service.interface';
import { IModerationService } from '@application/interfaces/services/moderation.service.interface';
import { PropertyStatus } from '@shared/enums/property-type-status.enum';
import { ResponseHandler } from '../../utils/response-handler';
import { Property_Response_Messages } from '@shared/types/messages/Response.messages';
import { BadRequestError } from '@shared/errors/common-errors';
import axios from 'axios';

@injectable()
export class PropertyController {
    constructor(
        @inject(TokenTypes.ICreatePropertyUseCase)
        private readonly _createPropertyUseCase: ICreatePropertyUseCase,
        @inject(TokenTypes.IGetPropertyByIdUseCase)
        private readonly _getPropertyByIdUseCase: IGetPropertyByIdUseCase,
        @inject(TokenTypes.IUpdatePropertyUseCase)
        private readonly _updatePropertyUseCase: IUpdatePropertyUseCase,
        @inject(TokenTypes.IUnlistPropertyUseCase)
        private readonly _unlistPropertyUseCase: IUnlistPropertyUseCase,
        @inject(TokenTypes.IDeletePropertyUseCase)
        private readonly _deletePropertyUseCase: IDeletePropertyUseCase,
        @inject(TokenTypes.IGetMyPropertiesUseCase)
        private readonly _getMyPropertiesUseCase: IGetMyPropertiesUseCase,
        @inject(TokenTypes.IGetAllPropertiesUseCase)
        private readonly _getAllPropertiesUseCase: IGetAllPropertiesUseCase,
        @inject(TokenTypes.IS3Service)
        private readonly _s3Service: IS3Service,
        @inject(TokenTypes.IModerationService)
        private readonly _moderationService: IModerationService,
    ) {}

    getAllProperties = async (req: Request, res: Response): Promise<Response> => {
        logger.info('fetching all properties for search');
        const { status, page = 1, limit = 10 } = req.query;
        const queryStatus = req.user ? (status as PropertyStatus) : PropertyStatus.APPROVED;

        const result = await this._getAllPropertiesUseCase.execute({
            status: queryStatus,
            page: Number(page),
            limit: Number(limit),
        });

        return ResponseHandler.success(res, result, Property_Response_Messages.FETCHED);
    };

    getPropertyById = async (req: Request, res: Response): Promise<Response> => {
        logger.info(`fetching property by id: ${req.params.id}`);
        const id = req.params.id as string;
        const result = await this._getPropertyByIdUseCase.execute(id);
        return ResponseHandler.success(res, result, Property_Response_Messages.FETCHED);
    };

    createProperty = async (req: Request, res: Response): Promise<Response> => {
        logger.info('initiating property creation');
        const ownerId = req.user!.id;
        const dto = {
            ...req.body,
            ownerId,
        };

        // image ai Check
        if (dto.photos && Array.isArray(dto.photos)) {
            logger.info(`Moderating ${dto.photos.length} property photos...`);
            for (const url of dto.photos) {
                try {
                    const response = await axios.get(url, { responseType: 'arraybuffer' });
                    const buffer = Buffer.from(response.data);
                    const moderation = await this._moderationService.checkImage(buffer);

                    if (moderation.status === 'UNSAFE') {
                        logger.warn(`Property creation blocked: Unsafe image detected at ${url}`);
                        return ResponseHandler.error(
                            res,
                            `One or more images failed safety moderation: ${moderation.reason}`,
                            Http_StatusCodes.BAD_REQUEST,
                        );
                    }
                } catch (error) {
                    logger.error(`Failed to moderate image at ${url}:`, error);
                    return ResponseHandler.error(
                        res,
                        'Failed to perform safety check on property images.',
                        Http_StatusCodes.INTERNAL_SERVER_ERROR,
                    );
                }
            }
        }

        const property = await this._createPropertyUseCase.execute(dto);

        logger.info(`creted the property ${property}`);
        return ResponseHandler.success(
            res,
            property,
            Property_Response_Messages.CREATED,
            Http_StatusCodes.CREATED,
        );
    };

    getMyProperties = async (req: Request, res: Response): Promise<Response> => {
        logger.info('fetching owner propert');
        const ownerId = req.user!.id;
        const { status, page = 1, limit = 10 } = req.query;

        const result = await this._getMyPropertiesUseCase.execute({
            ownerId,
            status: status as PropertyStatus,
            page: Number(page),
            limit: Number(limit),
        });

        return ResponseHandler.success(res, result, Property_Response_Messages.FETCHED);
    };

    updateProperty = async (req: Request, res: Response): Promise<Response> => {
        logger.info(`updating property: ${req.params.id}`);
        const id = req.params.id as string;
        const result = await this._updatePropertyUseCase.execute(id, req.body);
        return ResponseHandler.success(res, result, Property_Response_Messages.UPDATED);
    };

    unlistProperty = async (req: Request, res: Response): Promise<Response> => {
        logger.info(`unlisting property: ${req.params.id}`);
        const id = req.params.id as string;
        await this._unlistPropertyUseCase.execute(id);
        return ResponseHandler.success(res, null, Property_Response_Messages.UNLISTED);
    };

    deleteProperty = async (req: Request, res: Response): Promise<Response> => {
        logger.info(`deleting property: ${req.params.id}`);
        const id = req.params.id as string;
        await this._deletePropertyUseCase.execute(id);
        return ResponseHandler.success(res, null, Property_Response_Messages.DELETED);
    };

    uploadPropertyPhotoUrls = async (req: Request, res: Response): Promise<Response> => {
        const ownerId = req.user!.id;
        const { files } = req.body as {
            files?: Array<{ fileName: string; contentType: string }>;
        };

        if (!Array.isArray(files) || files.length === 0) {
            throw new BadRequestError(Property_Response_Messages.FILES_REQUIRED);
        }

        const awsBucket = process.env.AWS_BUCKET_NAME;
        const awsRegion = process.env.AWS_REGION;
        if (!awsBucket || !awsRegion) {
            return ResponseHandler.error(
                res,
                Property_Response_Messages.S3_CONFIG_ERROR,
                Http_StatusCodes.INTERNAL_SERVER_ERROR,
            );
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

        logger.info(`propertuy photos uplods`);

        return ResponseHandler.success(
            res,
            { uploads },
            Property_Response_Messages.PHOTOS_UPLOADED,
        );
    };
}
