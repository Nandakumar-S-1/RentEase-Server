import { injectable, inject } from 'tsyringe';
import { Request, Response } from 'express';
import { GetAllAgreementsUseCase } from '@application/usecases/admin/get-all-agreements.usecase';
import { GetAllPaymentsUseCase } from '@application/usecases/admin/get-all-payments.usecase';
import { GetUserAgreementsUseCase } from '@application/usecases/admin/get-user-agreements.usecase';
import { GetUserPaymentsUseCase } from '@application/usecases/admin/get-user-payments.usecase';
import { GetAgreementUseCase } from '@application/usecases/agreement/get-agreement.usecase';
import { GetUserNotificationsUseCase } from '@application/usecases/notification/get-user-notifications.usecase';
import { GetTenantKycDocumentUseCase } from '@application/usecases/admin/get-tenant-kyc-document.usecase';
import { IGetUserNotificationRequestDTO } from '@application/dtos/notification/get-user-notification-request-dto';
import { GetAllPaymentsInputDTO } from '@application/dtos/admin/admin-payments.dto';
import { GetAllAgreementsInputDTO } from '@application/dtos/admin/admin-agreements.dto';
import { GetUserAgreementsInputDTO } from '@application/dtos/admin/user-agreements.dto';
import { GetUserPaymentsInputDTO } from '@application/dtos/admin/user-payments.dto';
import { Http_StatusCodes } from '@shared/enums/http-status-codes.enum';
import { TokenTypes } from '@shared/types/tokens';
import { ResponseHandler } from '@presentation/utils/response-handler';
import { Admin_Response_Messages } from '@shared/types/messages/Response.messages';

@injectable()
export class AdminDataController {
    constructor(
        @inject(GetAllAgreementsUseCase)
        private _getAllAgreementsUseCase: GetAllAgreementsUseCase,
        @inject(GetAllPaymentsUseCase)
        private _getAllPaymentsUseCase: GetAllPaymentsUseCase,
        @inject(GetUserAgreementsUseCase)
        private _getUserAgreementsUseCase: GetUserAgreementsUseCase,
        @inject(GetUserPaymentsUseCase)
        private _getUserPaymentsUseCase: GetUserPaymentsUseCase,
        @inject(GetAgreementUseCase)
        private _getAgreementUseCase: GetAgreementUseCase,
        @inject(GetUserNotificationsUseCase)
        private _getUserNotificationsUseCase: GetUserNotificationsUseCase,
        @inject(TokenTypes.IGetTenantKycDocumentUseCase)
        private _getTenantKycDocumentUseCase: GetTenantKycDocumentUseCase,
    ) {}

    async getAllAgreements(req: Request, res: Response): Promise<void> {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const status = req.query.status as string | undefined;
        const search = req.query.search as string | undefined;

        const dto:GetAllAgreementsInputDTO={page,limit,status,search}
        const result = await this._getAllAgreementsUseCase.execute(dto);

        res.status(Http_StatusCodes.OK).json({
            success: true,
            data: result,
        });
    }

    async getAllPayments(req: Request, res: Response): Promise<void> {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const status = req.query.status as string | undefined;
        const category = req.query.category as string | undefined;

        const dto: GetAllPaymentsInputDTO = { page, limit, status, category }

        const result = await this._getAllPaymentsUseCase.execute(dto);

        res.status(Http_StatusCodes.OK).json({
            success: true,
            data: result,
        });
    }

    async getUserActivity(req: Request, res: Response): Promise<void> {
        const userId = req.params.id as string;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        
        const dto: IGetUserNotificationRequestDTO = {
            userId,
            page,
            limit,
        };

        const result = await this._getUserNotificationsUseCase.execute(dto);

        res.status(Http_StatusCodes.OK).json({
            success: true,
            data: result,
        });
    }

    async getTenantKycDocument(req: Request, res: Response): Promise<Response> {
        const userId = req.params.id as string;
        const result = await this._getTenantKycDocumentUseCase.execute(userId);
        return ResponseHandler.success(res, result, Admin_Response_Messages.KYC_DOCUMENT_FETCHED);
    }

    async getUserAgreements(req: Request, res: Response): Promise<void> {
        const userId = req.params.id as string;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const role = (req.user?.role ?? '') as string

        const dto:GetUserAgreementsInputDTO={userId,page,limit,role}
        const result = await this._getUserAgreementsUseCase.execute(dto);

        res.status(Http_StatusCodes.OK).json({
            success: true,
            data: result,
        });
    }

    async getUserPayments(req: Request, res: Response): Promise<void> {
        const userId = req.params.id as string;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const dto:GetUserPaymentsInputDTO={userId,page,limit}
        const result = await this._getUserPaymentsUseCase.execute(dto);

        res.status(Http_StatusCodes.OK).json({
            success: true,
            data: result,
        });
    }

    async getAgreementDetails(req: Request, res: Response): Promise<void> {
        const agreementId = req.params.id as string;

        const result = await this._getAgreementUseCase.execute(agreementId);

        res.status(Http_StatusCodes.OK).json({
            success: true,
            data: result,
        });
    }
}
