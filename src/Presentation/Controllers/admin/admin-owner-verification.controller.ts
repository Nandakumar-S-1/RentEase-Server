import { VerifyOwnerUseCase } from 'application/usecases/owner/verify-owner.usecase';
import { Http_StatusCodes } from 'shared/enums/http-status-codes.enum';
import { TokenTypes } from 'shared/types/tokens';
import { inject, injectable } from 'tsyringe';
import { Request, Response } from 'express';
import { Admin_Response_Messages } from 'shared/types/messages/Response.messages';

@injectable()
export class AdminOwnerVerificationController {
    constructor(
        @inject(TokenTypes.VerifyOwnerUseCase)
        private readonly _verifyOwner: VerifyOwnerUseCase,
    ) {}

    verifyOwner = async (req: Request, res: Response): Promise<Response> => {
        const ownerId = req.params.ownerId as string;
        await this._verifyOwner.verifyOwner(ownerId);

        return res.status(Http_StatusCodes.OK).json({
            success: true,
            message: Admin_Response_Messages.OWNER_VERIFIED,
        });
    };
    rejectOwner = async (req: Request, res: Response): Promise<Response> => {
        const ownerId = req.params.ownerId as string;
        const { rejectionReason } = req.body;

        if (!rejectionReason) {
            return res.status(Http_StatusCodes.BAD_REQUEST).json({
                success: false,
                message: Admin_Response_Messages.REJECTION_REASON_REQUIRED,
            });
        }
        await this._verifyOwner.rejectOwner(ownerId, rejectionReason);
        return res.status(Http_StatusCodes.OK).json({
            success: true,
            message: Admin_Response_Messages.OWNER_REJECTED,
        });
    };
    listPendingOwners = async (req: Request, res: Response): Promise<Response> => {
        const result = await this._verifyOwner.getPendingOwners();
        return res.status(Http_StatusCodes.OK).json({
            success: true,
            message: Admin_Response_Messages.PENDING_OWNERS_FETCHED,
            data: result,
        });
    };

    ownerVerificationDetails = async (req: Request, res: Response): Promise<Response> => {
        const ownerId = req.params.ownerId as string;
        const result = await this._verifyOwner.getOwnerVerificationDetails(ownerId);
        return res.status(Http_StatusCodes.OK).json({
            success: true,
            message: 'Owner verification details fetched',
            data: result,
        });
    };
}
