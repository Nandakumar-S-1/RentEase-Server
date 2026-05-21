import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import {
    ICreateAgreementUseCase,
    ISignOwnerUseCase,
    ISignTenantUseCase,
    IGeneratePdfUseCase,
    IUploadTenantKycUseCase,
} from '@application/interfaces/agreement/agreement.usecase.interface';
import { CreateAgreementDTO, SignAgreementDTO } from '@application/dtos/agreement/agreement.dto';
import { logger } from '@shared/log/logger';
import { IS3Service } from '@application/interfaces/services/s3.service.interface';
import { TokenTypes } from '@shared/types/tokens';
import crypto from 'crypto';

@injectable()
export class AgreementController {
    constructor(
        @inject('ICreateAgreementUseCase') private createAgreementUseCase: ICreateAgreementUseCase,
        @inject('ISignOwnerUseCase') private signOwnerUseCase: ISignOwnerUseCase,
        @inject('ISignTenantUseCase') private signTenantUseCase: ISignTenantUseCase,
        @inject('IGeneratePdfUseCase') private generatePdfUseCase: IGeneratePdfUseCase,
        @inject('IUploadTenantKycUseCase') private uploadTenantKycUseCase: IUploadTenantKycUseCase,
        @inject(TokenTypes.IS3Service) private s3Service: IS3Service,
    ) { }

    async createAgreement(req: Request, res: Response): Promise<void> {
        try {
            const dto: CreateAgreementDTO = req.body;
            dto.ownerId = req.user?.id;
            
            const result = await this.createAgreementUseCase.execute(dto);
            res.status(201).json(result);
        } catch (error) {
            const err = error as Error;
            logger.error({ error: err }, 'Error creating agreement');
            res.status(400).json({ message: err.message || 'Failed to create agreement' });
        }
    }

    async signOwner(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            const dto: SignAgreementDTO = req.body;
            await this.signOwnerUseCase.execute(id, dto);
            res.status(200).json({ message: 'Owner signed successfully' });
        } catch (error) {
            const err = error as Error;
            logger.error({ error: err }, 'Error in owner signature');
            res.status(400).json({ message: err.message || 'Failed to sign agreement' });
        }
    }

    async signTenant(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            const dto: SignAgreementDTO = req.body;

            await this.signTenantUseCase.execute(id, dto);

            const pdfUrl = await this.generatePdfUseCase.execute(id);

            res.status(200).json({ message: 'Tenant signed successfully', pdfUrl });
        } catch (error) {
            const err = error as Error;
            logger.error({ error: err }, 'Error in tenant signature');
            res.status(400).json({ message: err.message || 'Failed to sign agreement' });
        }
    }

    async generatePdf(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            const pdfUrl = await this.generatePdfUseCase.execute(id);
            res.status(200).json({ pdfUrl });
        } catch (error) {
            const err = error as Error;
            logger.error({ error: err }, 'Error generating PDF');
            res.status(400).json({ message: err.message || 'Failed to generate PDF' });
        }
    }

    async uploadKyc(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            const { kycUrl } = req.body;
            if (!kycUrl) {
                res.status(400).json({ message: 'kycUrl is required' });
                return;
            }
            const result = await this.uploadTenantKycUseCase.execute(id, kycUrl);
            res.status(200).json(result);
        } catch (error) {
            const err = error as Error;
            logger.error({ error: err }, 'Error uploading KYC');
            res.status(400).json({ message: err.message || 'Failed to upload KYC' });
        }
    }

    async getUploadUrls(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            const { files } = req.body as {
                files?: Array<{ fileName: string; contentType: string }>;
            };
            if (!Array.isArray(files) || files.length === 0) {
                res.status(400).json({ message: 'Files are required' });
                return;
            }

            const awsBucket = process.env.AWS_BUCKET_NAME;
            const awsRegion = process.env.AWS_REGION;
            if (!awsBucket || !awsRegion) {
                res.status(500).json({ message: 'S3 config error' });
                return;
            }

            const uploads = await Promise.all(
                files.map(async (file, index) => {
                    const safeFileName = (file.fileName || `kyc-${index}`).replace(
                        /[^a-zA-Z0-9._-]/g,
                        '',
                    );

                    const key = `rentease/agreements/${id}/${crypto.randomUUID()}-${index}-${safeFileName}`;
                    const uploadUrl = await this.s3Service.getUrl(
                        key,
                        file.contentType || 'application/pdf',
                    );

                    const publicUrl = `https://${awsBucket}.s3.${awsRegion}.amazonaws.com/${key}`;
                    return { key, uploadUrl, publicUrl };
                }),
            );

            res.status(200).json({ uploads });
        } catch (error) {
            const err = error as Error;
            logger.error({ error: err }, 'Error generating upload URLs');
            res.status(400).json({ message: err.message || 'Failed to generate upload URLs' });
        }
    }
}
