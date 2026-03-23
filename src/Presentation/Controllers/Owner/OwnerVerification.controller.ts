import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

import { ISubmitVerificationUseCase } from '@application/Interfaces/Owner/ISubmitVerificationUseCase';
import { Http_StatusCodes } from '@shared/Enums/Http_StatusCodes';
import { TokenTypes } from '@shared/Types/tokens';
import { uploadToCloudinary } from '@shared/Uploads/cloudinary.service';
import { Owner_Response_Messages } from '@shared/Types/Messages/Response.messages';

@injectable()
export class OwnerVerificationController {
    constructor(
        @inject(TokenTypes.SubmitVerificationUseCase)
        private readonly _submitVerification: ISubmitVerificationUseCase,
    ) {}

    submit = async (req: Request, res: Response): Promise<Response> => {
        const ownerId = req.user!.id;

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
        const user = req.user!;

        return res.status(Http_StatusCodes.OK).json({
            success: true,
            message: Owner_Response_Messages.VERIFICATION_STATUS_FETCHED,
            data: {
                verificationStatus: user.verificationStatus ?? 'PENDING',
            },
        });
    };
}
