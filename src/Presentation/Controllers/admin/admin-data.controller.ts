import { injectable, inject } from 'tsyringe';
import { Request, Response } from 'express';
import { GetAllAgreementsUseCase } from '@application/usecases/admin/get-all-agreements.usecase';
import { GetAllPaymentsUseCase } from '@application/usecases/admin/get-all-payments.usecase';
import { GetUserAgreementsUseCase } from '@application/usecases/admin/get-user-agreements.usecase';
import { GetUserPaymentsUseCase } from '@application/usecases/admin/get-user-payments.usecase';
import { GetAgreementUseCase } from '@application/usecases/agreement/get-agreement.usecase';
import { GetUserNotificationsUseCase } from '@application/usecases/notification/get-user-notifications.usecase';
import { IGetUserNotificationRequestDTO } from '@application/dtos/notification/get-user-notification-request-dto';
import { prisma } from '@infrastructure/database/prisma/prisma.client';

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
    ) {}

    async getAllAgreements(req: Request, res: Response): Promise<void> {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const status = req.query.status as string | undefined;
        const search = req.query.search as string | undefined;

        const result = await this._getAllAgreementsUseCase.execute({
            page,
            limit,
            status,
            search,
        });

        res.status(200).json({
            success: true,
            data: result,
        });
    }

    async getAllPayments(req: Request, res: Response): Promise<void> {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const status = req.query.status as string | undefined;
        const category = req.query.category as string | undefined;

        const result = await this._getAllPaymentsUseCase.execute({
            page,
            limit,
            status,
            category,
        });

        res.status(200).json({
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

        res.status(200).json({
            success: true,
            data: result,
        });
    }

    async getTenantKycDocument(req: Request, res: Response): Promise<void> {
        const userId = req.params.id as string;

        const agreement = await prisma.agreement.findFirst({
            where: { tenantId: userId },
            select: {
                id: true,
                agreementNumber: true,
                tenantKycDocumentUrl: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        if (!agreement) {
            res.status(200).json({
                success: true,
                data: null,
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: {
                documentUrl: agreement.tenantKycDocumentUrl,
                agreementNumber: agreement.agreementNumber,
                agreementId: agreement.id,
            },
        });
    }

    async getUserAgreements(req: Request, res: Response): Promise<void> {
        const userId = req.params.id as string;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const result = await this._getUserAgreementsUseCase.execute({
            userId,
            page,
            limit,
        });

        res.status(200).json({
            success: true,
            data: result,
        });
    }

    async getUserPayments(req: Request, res: Response): Promise<void> {
        const userId = req.params.id as string;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const result = await this._getUserPaymentsUseCase.execute({
            userId,
            page,
            limit,
        });

        res.status(200).json({
            success: true,
            data: result,
        });
    }

    async getAgreementDetails(req: Request, res: Response): Promise<void> {
        const agreementId = req.params.id as string;

        const result = await this._getAgreementUseCase.execute(agreementId);

        res.status(200).json({
            success: true,
            data: result,
        });
    }
}
