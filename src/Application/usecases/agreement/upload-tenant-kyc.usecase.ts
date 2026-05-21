import { IUploadTenantKycUseCase } from '@application/interfaces/agreement/agreement.usecase.interface';
import { AgreementResponseDTO } from '@application/dtos/agreement/res/agreement-response.dto';
import { IAgreementRepository } from '@core/interfaces/repository/agreement-repository.interface';
import { inject, injectable } from 'tsyringe';
import { logger } from '@shared/log/logger';
import { NotFoundError } from '@shared/errors/common-errors';

@injectable()
export class UploadTenantKycUseCase implements IUploadTenantKycUseCase {
    constructor(
        @inject('IAgreementRepository') private agreementRepository: IAgreementRepository,
    ) {}

    async execute(id: string, kycUrl: string): Promise<AgreementResponseDTO> {
        logger.info({ id, kycUrl }, 'Uploading tenant KYC document for agreement');

        const agreement = await this.agreementRepository.findById(id);
        if (!agreement) {
            throw new NotFoundError('Agreement not found');
        }

        agreement.updateKycDocument(kycUrl);
        const updated = await this.agreementRepository.update(agreement);

        return {
            id: updated.id,
            agreementNumber: updated.agreementNumber,
            propertyId: updated.propertyId,
            ownerId: updated.ownerId,
            tenantId: updated.tenantId,
            startDate: updated.startDate,
            endDate: updated.endDate,
            lockInPeriodMonths: updated.lockInPeriodMonths,
            noticePeriodMonths: updated.noticePeriodMonths,
            monthlyRent: updated.monthlyRent,
            depositAmount: updated.depositAmount,
            maintenanceCharges: updated.maintenanceCharges,
            maintenanceIncluded: updated.maintenanceIncluded,
            lateFeePerDay: updated.lateFeePerDay,
            lateFeeGracePeriodDays: updated.lateFeeGracePeriodDays,
            rentEscalationPercentage: updated.rentEscalationPercentage,
            termsAndConditions: updated.termsAndConditions,
            customClauses: updated.customClauses,
            tenantRemarks: updated.tenantRemarks,
            ownerSignatureUrl: updated.ownerSignatureUrl,
            ownerSignedAt: updated.ownerSignedAt,
            tenantSignatureUrl: updated.tenantSignatureUrl,
            tenantSignedAt: updated.tenantSignedAt,
            agreementPdfUrl: updated.agreementPdfUrl,
            status: updated.status,
            terminationReason: updated.terminationReason,
            terminatedAt: updated.terminatedAt,
            terminatedById: updated.terminatedById,
            depositPaid: updated.depositPaid,
            createdAt: updated.createdAt,
            updatedAt: updated.updatedAt,
        };
    }
}
