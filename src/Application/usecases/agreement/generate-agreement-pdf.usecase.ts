import { IGeneratePdfUseCase } from '@application/interfaces/agreement/agreement.usecase.interface';
import { IAgreementRepository } from '@core/interfaces/repository/agreement-repository.interface';
import { IUserRepository } from '@core/interfaces/repository/user-repository.interface';
import { IPropertyRepository } from '@core/interfaces/repository/property-repository.interface';
import { inject, injectable } from 'tsyringe';
import { logger } from '@shared/log/logger';
import { IS3Service } from '@application/interfaces/services/s3.service.interface';
import { IPdfService, PdfParties } from '@application/interfaces/services/pdf.service.interface';
import crypto from 'crypto';
import { TokenTypes } from '@shared/types/tokens';
import {
    AgreementNotFoundError,
    AgreementSignatureRequiredError,
} from '@shared/errors/agreement-errors';

@injectable()
export class GenerateAgreementPdfUseCase implements IGeneratePdfUseCase {
    constructor(
        @inject(TokenTypes.IAgreementRepository) private _agreementRepository: IAgreementRepository,
        @inject(TokenTypes.IUserRepository) private _userRepository: IUserRepository,
        @inject(TokenTypes.IPropertyRepository) private _propertyRepository: IPropertyRepository,
        @inject(TokenTypes.IPdfService) private _pdfService: IPdfService,
        @inject(TokenTypes.IS3Service) private _s3Service: IS3Service,
    ) {}

    async execute(id: string): Promise<string> {
        logger.info({ agreementId: id }, 'Generating PDF for agreement');

        const agreement = await this._agreementRepository.findById(id);
        if (!agreement) throw new AgreementNotFoundError();

        if (!agreement.ownerSignatureUrl || !agreement.tenantSignatureUrl) {
            throw new AgreementSignatureRequiredError();
        }

        const [owner, tenant, property] = await Promise.all([
            this._userRepository.findById(agreement.ownerId),
            this._userRepository.findById(agreement.tenantId),
            this._propertyRepository.findById(agreement.propertyId),
        ]);

        const parties: PdfParties = {
            ownerName: owner?.fullname ?? 'N/A',
            ownerEmail: owner?.email ?? 'N/A',
            ownerPhone: owner?.phone ?? 'N/A',
            tenantName: tenant?.fullname ?? 'N/A',
            tenantEmail: tenant?.email ?? 'N/A',
            tenantPhone: tenant?.phone ?? 'N/A',
            propertyTitle: property?.title ?? 'N/A',
            propertyAddress: property
                ? [
                      property.fullAddress,
                      property.locationCity,
                      property.locationDistrict,
                      property.locationPincode,
                  ]
                      .filter(Boolean)
                      .join(', ')
                : 'N/A',
        };

        const pdfBuffer = await this._pdfService.generateRentalAgreement(agreement, parties);
        const fileKey = `agreements/${agreement.agreementNumber}-${crypto.randomUUID()}.pdf`;

        const pdfUrl = await this._s3Service.uploadFile(fileKey, pdfBuffer, 'application/pdf');

        agreement.setPdfUrl(pdfUrl);
        await this._agreementRepository.update(agreement);

        return pdfUrl;
    }
}
