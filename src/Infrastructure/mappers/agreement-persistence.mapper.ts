import { AgreementEntity } from '@core/entities/agreement.entity';
import {
    AgreementTypeData,
    AgreementStatus,
    DepositRefundStatus,
} from '@core/types/agreement.types';
import { Agreement, Prisma } from '@prisma/client';

export class AgreementPersistenceMapper {
    static toEntity(raw: Agreement): AgreementEntity {
        const data: AgreementTypeData = {
            id: raw.id,
            agreementNumber: raw.agreementNumber,
            propertyId: raw.propertyId,
            ownerId: raw.ownerId,
            tenantId: raw.tenantId,

            startDate: raw.startDate,
            endDate: raw.endDate,
            lockInPeriodMonths: raw.lockInPeriodMonths,
            noticePeriodMonths: raw.noticePeriodMonths,

            monthlyRent: Number(raw.monthlyRent),
            depositAmount: Number(raw.depositAmount),
            maintenanceCharges: Number(raw.maintenanceCharges),
            maintenanceIncluded: raw.maintenanceIncluded,
            lateFeePerDay: Number(raw.lateFeePerDay),
            lateFeeGracePeriodDays: raw.lateFeeGracePeriodDays,
            rentEscalationPercentage: Number(raw.rentEscalationPercentage),

            termsAndConditions: raw.termsAndConditions as object[],
            customClauses: raw.customClauses ?? undefined,
            tenantRemarks: raw.tenantRemarks ?? undefined,

            ownerSignatureUrl: raw.ownerSignatureUrl ?? undefined,
            ownerSignedAt: raw.ownerSignedAt ?? undefined,
            tenantSignatureUrl: raw.tenantSignatureUrl ?? undefined,
            tenantSignedAt: raw.tenantSignedAt ?? undefined,
            agreementPdfUrl: raw.agreementPdfUrl ?? undefined,

            status: raw.status as AgreementStatus,
            terminationReason: raw.terminationReason ?? undefined,
            terminatedAt: raw.terminatedAt ?? undefined,
            terminatedById: raw.terminatedById ?? undefined,

            depositPaid: raw.depositPaid,
            depositPaidAt: raw.depositPaidAt ?? undefined,
            depositRefundStatus: (raw.depositRefundStatus as DepositRefundStatus) ?? undefined,
            depositRefundAmount: raw.depositRefundAmount
                ? Number(raw.depositRefundAmount)
                : undefined,
            depositRefundDate: raw.depositRefundDate ?? undefined,

            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        };
        return AgreementEntity.create(data);
    }

    static toPersistence(
        entity: AgreementEntity,
    ): Prisma.AgreementCreateInput | Prisma.AgreementUpdateInput {
        return {
            id: entity.id,
            agreementNumber: entity.agreementNumber,
            property: { connect: { id: entity.propertyId } },
            owner: { connect: { id: entity.ownerId } },
            tenant: { connect: { id: entity.tenantId } },

            startDate: entity.startDate,
            endDate: entity.endDate,
            lockInPeriodMonths: entity.lockInPeriodMonths,
            noticePeriodMonths: entity.noticePeriodMonths,

            monthlyRent: new Prisma.Decimal(entity.monthlyRent),
            depositAmount: new Prisma.Decimal(entity.depositAmount),
            maintenanceCharges: new Prisma.Decimal(entity.maintenanceCharges),
            maintenanceIncluded: entity.maintenanceIncluded,
            lateFeePerDay: new Prisma.Decimal(entity.lateFeePerDay),
            lateFeeGracePeriodDays: entity.lateFeeGracePeriodDays,
            rentEscalationPercentage: new Prisma.Decimal(entity.rentEscalationPercentage),

            termsAndConditions: entity.termsAndConditions as Prisma.InputJsonValue,
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
            terminatedBy: entity.terminatedById
                ? { connect: { id: entity.terminatedById } }
                : undefined,

            depositPaid: entity.depositPaid,
            depositPaidAt: entity.depositPaidAt,
            depositRefundStatus: entity.depositRefundStatus,
            depositRefundAmount: entity.depositRefundAmount
                ? new Prisma.Decimal(entity.depositRefundAmount)
                : undefined,
            depositRefundDate: entity.depositRefundDate,

            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
}
