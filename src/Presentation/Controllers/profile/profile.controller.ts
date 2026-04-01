import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { IGetProfileUseCase, IUpdateProfileUseCase } from 'application/interfaces/profile/profile.usecase.interface';
import { Http_StatusCodes } from 'shared/enums/http-status-codes.enum';
import { TokenTypes } from 'shared/types/tokens';
import { Profile_Response_Messages } from 'shared/types/messages/Response.messages';
import { logger } from 'shared/log/logger';

@injectable()
export class ProfileController {
    constructor(
        @inject(TokenTypes.GetProfileUseCase)
        private readonly _getProfile: IGetProfileUseCase,
        @inject(TokenTypes.UpdateProfileUseCase)
        private readonly _updateProfile: IUpdateProfileUseCase,
    ) {}

    getProfile = async (req: Request, res: Response): Promise<Response> => {
        const userId = req.user!.id;
        const role = req.user!.role;

        logger.info(`Fetching profile for user: ${userId}`);
        const profile = await this._getProfile.execute(userId, role);

        return res.status(Http_StatusCodes.OK).json({
            success: true,
            message: Profile_Response_Messages.FETCHED,
            data: profile,
        });
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

        return res.status(Http_StatusCodes.OK).json({
            success: true,
            message: Profile_Response_Messages.UPDATED,
            data: result,
        });
    };
}
