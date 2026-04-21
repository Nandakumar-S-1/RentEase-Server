import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import {
    IGetProfileUseCase,
    IUpdateProfileUseCase,
} from 'application/interfaces/profile/profile.usecase.interface';
import { Http_StatusCodes } from 'shared/enums/http-status-codes.enum';
import { TokenTypes } from 'shared/types/tokens';
import { Profile_Response_Messages } from 'shared/types/messages/Response.messages';
import { uploadToCloudinary } from 'shared/uploads/cloudinary.service';
import { ResponseHandler } from '../../utils/response-handler';
import { logger } from '@shared/log/logger';
import { IModerationService } from '@application/interfaces/services/moderation.service.interface';

@injectable()
export class ProfileController {
    constructor(
        @inject(TokenTypes.GetProfileUseCase)
        private readonly _getProfile: IGetProfileUseCase,
        @inject(TokenTypes.UpdateProfileUseCase)
        private readonly _updateProfile: IUpdateProfileUseCase,
        @inject(TokenTypes.IModerationService)
        private readonly _moderationService: IModerationService,
    ) { }

    getProfile = async (req: Request, res: Response): Promise<Response> => {
        const userId = req.user!.id;
        const role = req.user!.role;

        logger.info(`Fetching profile for user: ${userId}`);
        const profile = await this._getProfile.execute(userId, role);
        return ResponseHandler.success(res, profile, Profile_Response_Messages.FETCHED);
    };

    updateProfile = async (req: Request, res: Response): Promise<Response> => {
        const userId = req.user!.id;
        const role = req.user!.role;

        logger.info(`Updating profile for user: ${userId}`);
        const result = await this._updateProfile.execute({
            userId,
            role,
            ...req.body,
        });
        return ResponseHandler.success(res, result, Profile_Response_Messages.UPDATED);
    };

    uploadAvatar = async (req: Request, res: Response): Promise<Response> => {
        const userId = req.user!.id;

        if (!req.file) {
            return ResponseHandler.error(res, 'No file uploaded', Http_StatusCodes.BAD_REQUEST);
        }

        logger.info(`Uploading avatar for user: ${userId}`);
        const moderation = await this._moderationService.checkImage(req.file.buffer);
        if (moderation.status === 'UNSAFE') {
            logger.warn(`Avatar upload blocked for user ${userId}: Unsafe content detected`);
            return ResponseHandler.error(
                res,
                `Avatar failed safety moderation: ${moderation.reason}`,
                Http_StatusCodes.BAD_REQUEST
            );
        }

        const avatarUrl = await uploadToCloudinary(req.file.buffer, req.file.mimetype);

        const result = await this._updateProfile.execute({
            userId,
            role: req.user!.role,
            avatarUrl,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);

        return ResponseHandler.success(res, result, Profile_Response_Messages.AVATAR_UPLOADED);
    };
}
