import { CreateAgreementDTO } from '@application/dtos/agreement/agreement.dto';
import { AgreementEntity } from '@core/entities/agreement.entity';

export class AgreementMapper {
    static toEntity(dto: CreateAgreementDTO): AgreementEntity {
        const now = new Date();
        const year = now.getFullYear();
        const agreementNumber = `AGR-${year}-${Math.floor(1000 + Math.random() * 9000)}`;

        return AgreementEntity.create({
            id: crypto.randomUUID(),
            agreementNumber: agreementNumber,
            propertyId: dto.propertyId,
            ownerId: dto.ownerId,
            tenantId: dto.tenantId,

            startDate: new Date(dto.startDate),
            endDate: new Date(dto.endDate),
            lockInPeriodMonths: dto.lockInPeriodMonths,
            noticePeriodMonths: dto.noticePeriodMonths,

            monthlyRent: dto.monthlyRent,
            depositAmount: dto.depositAmount,
            maintenanceCharges: dto.maintenanceCharges ?? 0,
            maintenanceIncluded: dto.maintenanceIncluded ?? true,
            lateFeePerDay: dto.lateFeePerDay ?? 100,
            lateFeeGracePeriodDays: dto.lateFeeGracePeriodDays ?? 3,
            rentEscalationPercentage: dto.rentEscalationPercentage ?? 0,

            termsAndConditions: dto.termsAndConditions ?? [],
            customClauses: dto.customClauses,
            status: 'DRAFT',
            depositPaid: false,
            createdAt: now,
            updatedAt: now,
        });
    }
}
