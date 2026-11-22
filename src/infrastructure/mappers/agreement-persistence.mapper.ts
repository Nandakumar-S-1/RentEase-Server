import { AgreementEntity } from '@core/entities/agreement.entity';
import {
    AgreementTypeData,
    AgreementStatus,
    DepositRefundStatus,
} from '@core/types/agreement.types';
import { Agreement, Prisma, Property, User } from '@prisma/client';

export type AgreementWithRelations = Agreement & {
    property?: Property | null;
    owner?: User | null;
    tenant?: User | null;
};

export class AgreementPersistenceMapper {
    static toEntity(raw: AgreementWithRelations): AgreementEntity {
        const data: AgreementTypeData = {
            id: raw.id,
            agreementNumber: raw.agreementNumber,
            propertyId: raw.propertyId,
            ownerId: raw.ownerId,
            tenantId: raw.tenantId,

            property: raw.property
                ? { title: raw.property.title, locationCity: raw.property.locationCity }
                : undefined,
            owner: raw.owner
                ? {
                      fullName: raw.owner.fullName,
                      email: raw.owner.email,
                      phone: raw.owner.phone || undefined,
                      avatarUrl: raw.owner.avatarUrl || undefined,
                  }
                : undefined,
            tenant: raw.tenant
                ? {
                      fullName: raw.tenant.fullName,
                      email: raw.tenant.email,
                      phone: raw.tenant.phone || undefined,
                      avatarUrl: raw.tenant.avatarUrl || undefined,
                  }
                : undefined,

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
            tenantKycDocumentUrl: raw.tenantKycDocumentUrl ?? undefined,

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

    static toPrismaCreate(entity: AgreementEntity): Prisma.AgreementCreateInput {
        return this.toPersistence(entity) as Prisma.AgreementCreateInput;
    }

    static toPrismaUpdate(entity: Partial<AgreementEntity>): Prisma.AgreementUpdateInput {
        if (!entity.id) throw new Error('Entity ID is required for update');
        return this.toPersistence(entity as AgreementEntity) as Prisma.AgreementUpdateInput;
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
            tenantKycDocumentUrl: entity.tenantKycDocumentUrl,

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
