import { AgreementEntity } from '@core/entities/agreement.entity';

export interface PdfParties {
    ownerName: string;
    ownerEmail: string;
    ownerPhone: string;
    tenantName: string;
    tenantEmail: string;
    tenantPhone: string;
    propertyTitle: string;
    propertyAddress: string;
}

export interface IPdfService {
    generateRentalAgreement(agreement: AgreementEntity, parties: PdfParties): Promise<Buffer>;
}
