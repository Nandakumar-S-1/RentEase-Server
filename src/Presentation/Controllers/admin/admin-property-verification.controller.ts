import { Http_StatusCodes } from '@shared/enums/http-status-codes.enum';
import { TokenTypes } from '@shared/types/tokens';
import { inject, injectable } from 'tsyringe';
import { Request, Response } from 'express';
import { IVerifyPropertyUseCase } from '@application/interfaces/property/property.usecase.interface';
import { Admin_Response_Messages } from '@shared/types/messages/Response.messages';

@injectable()
export class AdminPropertyVerificationController {
    constructor(
        @inject(TokenTypes.IVerifyPropertyUseCase)
        private readonly _verifyProperty: IVerifyPropertyUseCase,
    ) {}

    listPendingProperties = async (req: Request, res: Response): Promise<Response> => {
        const result = await this._verifyProperty.getPendingProperties();
        return res.status(Http_StatusCodes.OK).json({
            success: true,
            message: 'Pending properties fetched successfully',
            data: result,
        });
    };

    approveProperty = async (req: Request, res: Response): Promise<Response> => {
        const propertyId = req.params.propertyId as string;
        const adminId = req.user?.id || 'admin';

        await this._verifyProperty.approveProperty(propertyId, adminId);

        return res.status(Http_StatusCodes.OK).json({
            success: true,
            message: 'Property approved successfully',
        });
    };

    rejectProperty = async (req: Request, res: Response): Promise<Response> => {
        const propertyId = req.params.propertyId as string;
        const { rejectionReason } = req.body;

        if (!rejectionReason) {
            return res.status(Http_StatusCodes.BAD_REQUEST).json({
                success: false,
                message: Admin_Response_Messages.REJECTION_REASON_REQUIRED,
            });
        }

        await this._verifyProperty.rejectProperty(propertyId);

        return res.status(Http_StatusCodes.OK).json({
            success: true,
            message: 'Property rejected successfully',
        });
    };
}
