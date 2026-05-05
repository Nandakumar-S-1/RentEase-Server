import { Http_StatusCodes } from '@shared/enums/http-status-codes.enum';
import { TokenTypes } from '@shared/types/tokens';
import { inject, injectable } from 'tsyringe';
import { Request, Response } from 'express';
import { IVerifyPropertyUseCase } from '@application/interfaces/property/property.usecase.interface';
import { Admin_Response_Messages, Property_Response_Messages } from '@shared/types/messages/Response.messages';
import { PropertyStatus } from '@shared/enums/property-type-status.enum';

@injectable()
export class AdminPropertyVerificationController {
    constructor(
        @inject(TokenTypes.IVerifyPropertyUseCase)
        private readonly _verifyProperty: IVerifyPropertyUseCase,
    ) {}

    listPendingProperties = async (req: Request, res: Response): Promise<Response> => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const result = await this._verifyProperty.getPendingProperties(page, limit);
        return res.status(Http_StatusCodes.OK).json({
            success: true,
            message: Property_Response_Messages.FETCHED,
            data: result,
        });
    };

    listAllProperties = async (req: Request, res: Response): Promise<Response> => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const status = (req.query.status as PropertyStatus) || PropertyStatus.PENDING_APPROVAL;

        const result = await this._verifyProperty.getAllProperties(status, page, limit);
        return res.status(Http_StatusCodes.OK).json({
            success: true,
            message: Property_Response_Messages.FETCHED,
            data: result,
        });
    };

    approveProperty = async (req: Request, res: Response): Promise<Response> => {
        const propertyId = req.params.propertyId as string;
        const adminId = req.user?.id || 'admin';

        await this._verifyProperty.approveProperty(propertyId, adminId);

        return res.status(Http_StatusCodes.OK).json({
            success: true,
            message: Property_Response_Messages.APPROVED,
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
        if (rejectionReason.trim().length < 10) {
            return res.status(Http_StatusCodes.BAD_REQUEST).json({
                success: false,
                message: Admin_Response_Messages.REJECTION_REASON_TOO_SHORT,
            });
        }

        await this._verifyProperty.rejectProperty(propertyId, rejectionReason);

        return res.status(Http_StatusCodes.OK).json({
            success: true,
            message: Property_Response_Messages.REJECTED,
        });
    };
}
