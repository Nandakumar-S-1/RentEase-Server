import { AgreementStatus, DepositRefundStatus } from '@core/types/agreement.types';

export interface AgreementUserDetailsDTO {
    id: string;
    fullname: string;
    email: string;
    phone?: string;
    avatarUrl?: string;
}

export interface AgreementResponseDTO {
    id: string;
    agreementNumber: string;
    propertyId: string;
    ownerId: string;
    tenantId: string;

    property?: { title: string; locationCity: string };
    owner?: AgreementUserDetailsDTO;
    tenant?: AgreementUserDetailsDTO;

    startDate: Date;
    endDate: Date;
    lockInPeriodMonths: number;
    noticePeriodMonths: number;

    monthlyRent: number;
    depositAmount: number;
    maintenanceCharges: number;
    maintenanceIncluded: boolean;
    lateFeePerDay: number;
    lateFeeGracePeriodDays: number;
    rentEscalationPercentage: number;

    termsAndConditions: object[];
    customClauses?: string;
    tenantRemarks?: string;

    ownerSignatureUrl?: string;
    ownerSignedAt?: Date;
    tenantSignatureUrl?: string;
    tenantSignedAt?: Date;
    agreementPdfUrl?: string;
    tenantKycDocumentUrl?: string;

    status: AgreementStatus;
    terminationReason?: string;
    terminatedAt?: Date;
    terminatedById?: string;

    depositPaid: boolean;
    depositPaidAt?: Date;
    depositRefundStatus?: DepositRefundStatus;
    depositRefundAmount?: number;
    depositRefundDate?: Date;

    createdAt: Date;
    updatedAt: Date;
}
