import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import {
    ICreateAgreementUseCase,
    ISignOwnerUseCase,
    ISignTenantUseCase,
    IGeneratePdfUseCase,
    IUploadTenantKycUseCase,
    IGetAgreementUseCase,
    IGetMyAgreementsUseCase,
} from '@application/interfaces/agreement/agreement.usecase.interface';
import { CreateAgreementDTO, SignAgreementDTO } from '@application/dtos/agreement/agreement.dto';
import { AgreementStatus } from '@core/types/agreement.types';
import { UserRole } from '@shared/enums/user-role.enum';
import { logger } from '@shared/log/logger';
import { TokenTypes } from '@shared/types/tokens';
import { ResponseHandler } from '@presentation/utils/response-handler';
import {
    Agreement_Response_Messages,
    Common_Response_Messages,
} from '@shared/types/messages/Response.messages';
import { Http_StatusCodes } from '@shared/enums/http-status-codes.enum';
import { BadRequestError } from '@shared/errors/common-errors';
import { uploadToCloudinary } from '@shared/uploads/cloudinary.service';

@injectable()
export class AgreementController {
    constructor(
        @inject(TokenTypes.ICreateAgreementUseCase)
        private readonly _createAgreementUseCase: ICreateAgreementUseCase,
        @inject(TokenTypes.ISignOwnerUseCase)
        private readonly _signOwnerUseCase: ISignOwnerUseCase,
        @inject(TokenTypes.ISignTenantUseCase)
        private readonly _signTenantUseCase: ISignTenantUseCase,
        @inject(TokenTypes.IGeneratePdfUseCase)
        private readonly _generatePdfUseCase: IGeneratePdfUseCase,
        @inject(TokenTypes.IUploadTenantKycUseCase)
        private readonly _uploadTenantKycUseCase: IUploadTenantKycUseCase,
        @inject(TokenTypes.IGetAgreementUseCase)
        private readonly _getAgreementUseCase: IGetAgreementUseCase,
        @inject(TokenTypes.IGetMyAgreementsUseCase)
        private readonly _getMyAgreementsUseCase: IGetMyAgreementsUseCase,
    ) {}

    createAgreement = async (req: Request, res: Response): Promise<Response> => {
        logger.info('Create agreement requested');
        const dto: CreateAgreementDTO = req.body;
        dto.ownerId = req.user?.id;

        const result = await this._createAgreementUseCase.execute(dto);

        return ResponseHandler.success(
            res,
            result,
            Agreement_Response_Messages.CREATED,
            Http_StatusCodes.CREATED,
        );
    };

    signOwner = async (req: Request, res: Response): Promise<Response> => {
        const id = req.params.id as string;
        const dto: SignAgreementDTO = req.body;
        logger.info({ agreementId: id }, 'Owner signature requested');

        await this._signOwnerUseCase.execute(id, dto);

        return ResponseHandler.success(
            res,
            null,
            Agreement_Response_Messages.OWNER_SIGNED,
            Http_StatusCodes.OK,
        );
    };

    signTenant = async (req: Request, res: Response): Promise<Response> => {
        const id = req.params.id as string;
        const dto: SignAgreementDTO = req.body;
        logger.info({ agreementId: id }, 'Tenant signature requested');

        const pdfUrl = await this._signTenantUseCase.execute(id, req.user!.id, dto);

        return ResponseHandler.success(
            res,
            { pdfUrl },
            Agreement_Response_Messages.TENANT_SIGNED,
            Http_StatusCodes.OK,
        );
    };

    generatePdf = async (req: Request, res: Response): Promise<Response> => {
        const id = req.params.id as string;
        logger.info({ agreementId: id }, 'Generate PDF requested');

        const pdfUrl = await this._generatePdfUseCase.execute(id);

        return ResponseHandler.success(
            res,
            { pdfUrl },
            Agreement_Response_Messages.PDF_GENERATED,
            Http_StatusCodes.OK,
        );
    };

    /**
     * POST /agreements/:id/kyc  — multipart/form-data, field name: "document"
     * Uploads the file directly to Cloudinary and saves the URL on the agreement.
     */
    uploadKyc = async (req: Request, res: Response): Promise<Response> => {
        const id = req.params.id as string;
        logger.info({ agreementId: id }, 'Upload KYC requested');

        if (!req.file) {
            throw new BadRequestError('KYC document file is required');
        }

        const kycUrl = await uploadToCloudinary(
            req.file.buffer,
            req.file.mimetype,
            'rentease/agreements/kyc',
        );

        const result = await this._uploadTenantKycUseCase.execute(id, kycUrl);

        return ResponseHandler.success(
            res,
            result,
            Agreement_Response_Messages.KYC_UPLOADED,
            Http_StatusCodes.OK,
        );
    };

    /**
     * POST /agreements/:id/upload-file  — multipart/form-data, field name: "file"
     * Generic single-file upload (used for signature images).
     * Returns the Cloudinary URL so the client can pass it to signOwner / signTenant.
     */
    uploadFile = async (req: Request, res: Response): Promise<Response> => {
        const id = req.params.id as string;
        logger.info({ agreementId: id }, 'Agreement file upload requested');

        if (!req.file) {
            throw new BadRequestError('File is required');
        }

        const fileUrl = await uploadToCloudinary(
            req.file.buffer,
            req.file.mimetype,
            'rentease/agreements/signatures',
        );

        return ResponseHandler.success(
            res,
            { fileUrl },
            Agreement_Response_Messages.UPLOAD_URLS_GENERATED,
            Http_StatusCodes.OK,
        );
    };

    getAgreementById = async (req: Request, res: Response): Promise<Response> => {
        const id = req.params.id as string;
        logger.info({ agreementId: id }, 'Get agreement by ID requested');

        const result = await this._getAgreementUseCase.execute(id);

        return ResponseHandler.success(
            res,
            result,
            Agreement_Response_Messages.FETCHED,
            Http_StatusCodes.OK,
        );
    };

    getMyAgreements = async (req: Request, res: Response): Promise<Response> => {
        const userId = req.user?.id;
        const role = req.user?.role;
        const status = req.query.status as AgreementStatus | undefined;
        logger.info({ userId }, 'Get my agreements requested');

        if (!userId || !role) {
            return ResponseHandler.error(
                res,
                Common_Response_Messages.UNAUTHORIZED,
                Http_StatusCodes.UN_AUTHORIZED,
            );
        }

        const result = await this._getMyAgreementsUseCase.execute({
            userId,
            role: role as UserRole,
            status,
        });

        return ResponseHandler.success(
            res,
            result,
            Agreement_Response_Messages.FETCHED,
            Http_StatusCodes.OK,
        );
    };
}
