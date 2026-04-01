import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

import { ISubmitVerificationUseCase } from 'application/interfaces/owner/submit-verification.usecase.interface';
import { Http_StatusCodes } from 'shared/enums/http-status-codes.enum';
import { TokenTypes } from 'shared/types/tokens';
import { uploadToCloudinary } from 'shared/uploads/cloudinary.service';
import { Owner_Response_Messages } from 'shared/types/messages/Response.messages';
import { logger } from 'shared/log/logger';
import { IOwnerProfileRepository } from 'core/interfaces/owner-repository.interface';
import { Owner_Verification_Status } from 'shared/enums/owner-verification-status.enum';

@injectable()
export class OwnerVerificationController {
    constructor(
        @inject(TokenTypes.SubmitVerificationUseCase)
        private readonly _submitVerification: ISubmitVerificationUseCase,
        @inject(TokenTypes.IOwnerProfileRepository)
        private readonly _ownerRepository: IOwnerProfileRepository,
    ) {}

    submit = async (req: Request, res: Response): Promise<Response> => {
        const ownerId = req.user!.id;
        logger.info(`--owner verification started----`);
        const { documentType } = req.body;

        if (!req.file) {
            return res.status(Http_StatusCodes.BAD_REQUEST).json({
                success: false,
                message: Owner_Response_Messages.DOCUMENT_REQUIRED,
            });
        }

        const documentUrl = await uploadToCloudinary(req.file.buffer, req.file.mimetype);

        const result = await this._submitVerification.execute({
            ownerId,
            documentType,
            documentUrl,
        });
        return res.status(Http_StatusCodes.CREATED).json({
            success: true,
            message: Owner_Response_Messages.DOCUMENT_SUBMITTED,
            data: result,
        });
    };
    getStatus = async (req: Request, res: Response): Promise<Response> => {
        const user = req.user;
        const userId = user?.id;
        if (!userId) {
            return res.status(Http_StatusCodes.UN_AUTHORIZED).json({
                success: false,
                message: 'Unauthorized',
            });
        }

        const ownerProfile = await this._ownerRepository.findByUserId(userId);
        const verificationStatus = ownerProfile?.verificationStatus ?? Owner_Verification_Status.PENDING;

        logger.info(`--owner status fetched----`);
        return res.status(Http_StatusCodes.OK).json({
            success: true,
            message: Owner_Response_Messages.VERIFICATION_STATUS_FETCHED,
            data: {
                verificationStatus,
                rejectionReason: ownerProfile?.rejectionReason ?? null,
                documentUrl: ownerProfile?.documentUrl ? ownerProfile.documentUrl : null,
                documentType: ownerProfile?.documentType ? ownerProfile.documentType : null,
            },
        });
    };
}
