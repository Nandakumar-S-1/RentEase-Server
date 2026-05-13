import { AgreementResponseDTO } from '@application/dtos/agreement/res/agreement-response.dto';
import { AgreementEntity } from '@core/entities/agreement.entity';

export class AgreementResponseMapper {
    static toResponse(entity: AgreementEntity): AgreementResponseDTO {
        return {
            id: entity.id,
            agreementNumber: entity.agreementNumber,
            propertyId: entity.propertyId,
            ownerId: entity.ownerId,
            tenantId: entity.tenantId,

            startDate: entity.startDate,
            endDate: entity.endDate,
            lockInPeriodMonths: entity.lockInPeriodMonths,
            noticePeriodMonths: entity.noticePeriodMonths,

            monthlyRent: entity.monthlyRent,
            depositAmount: entity.depositAmount,
            maintenanceCharges: entity.maintenanceCharges,
            maintenanceIncluded: entity.maintenanceIncluded,
            lateFeePerDay: entity.lateFeePerDay,
            lateFeeGracePeriodDays: entity.lateFeeGracePeriodDays,
            rentEscalationPercentage: entity.rentEscalationPercentage,

            termsAndConditions: entity.termsAndConditions,
            customClauses: entity.customClauses,
            tenantRemarks: entity.tenantRemarks,

            ownerSignatureUrl: entity.ownerSignatureUrl,
            ownerSignedAt: entity.ownerSignedAt,
            tenantSignatureUrl: entity.tenantSignatureUrl,
            tenantSignedAt: entity.tenantSignedAt,
            agreementPdfUrl: entity.agreementPdfUrl,

            status: entity.status,
            terminationReason: entity.terminationReason,
            terminatedAt: entity.terminatedAt,
            terminatedById: entity.terminatedById,

            depositPaid: entity.depositPaid,
            depositPaidAt: entity.depositPaidAt,
            depositRefundStatus: entity.depositRefundStatus,
            depositRefundAmount: entity.depositRefundAmount,
            depositRefundDate: entity.depositRefundDate,

            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }

    static toListResponse(entities: AgreementEntity[]): AgreementResponseDTO[] {
        return entities.map((entity) => this.toResponse(entity));
    }
}
