import { IGeneratePdfUseCase } from '@application/interfaces/agreement/agreement.usecase.interface';
import { IAgreementRepository } from '@core/interfaces/repository/agreement-repository.interface';
import { IUserRepository } from '@core/interfaces/repository/user-repository.interface';
import { IPropertyRepository } from '@core/interfaces/repository/property-repository.interface';
import { inject, injectable } from 'tsyringe';
import { logger } from '@shared/log/logger';
import { IPdfService, PdfParties } from '@application/interfaces/services/pdf.service.interface';
import { TokenTypes } from '@shared/types/tokens';
import {
    AgreementNotFoundError,
    AgreementSignatureRequiredError,
} from '@shared/errors/agreement-errors';
import { uploadToCloudinary } from '@shared/uploads/cloudinary.service';

@injectable()
export class GenerateAgreementPdfUseCase implements IGeneratePdfUseCase {
    constructor(
        @inject(TokenTypes.IAgreementRepository) private _agreementRepository: IAgreementRepository,
        @inject(TokenTypes.IUserRepository) private _userRepository: IUserRepository,
        @inject(TokenTypes.IPropertyRepository) private _propertyRepository: IPropertyRepository,
        @inject(TokenTypes.IPdfService) private _pdfService: IPdfService,
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

        // Upload PDF buffer directly to Cloudinary (resource_type: 'raw' for PDFs)
        const pdfUrl = await uploadToCloudinary(pdfBuffer, 'application/pdf', 'rentease/agreements/pdfs');

        agreement.setPdfUrl(pdfUrl);
        await this._agreementRepository.update(agreement);

        logger.info({ agreementId: id, pdfUrl }, 'Agreement PDF uploaded to Cloudinary');

        return pdfUrl;
    }
}
