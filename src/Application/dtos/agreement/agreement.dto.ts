import { AgreementStatus, DepositRefundStatus } from '@core/types/agreement.types';


export interface CreateAgreementDTO {
    propertyId: string;
    tenantId: string;
    ownerId: string;
    startDate: string;
    endDate: string;
    lockInPeriodMonths: number;
    noticePeriodMonths: number;

    monthlyRent: number;
    depositAmount: number;
    maintenanceCharges?: number;
    maintenanceIncluded?: boolean;
    lateFeePerDay?: number;
    lateFeeGracePeriodDays?: number;
    rentEscalationPercentage?: number;

    termsAndConditions?: object[];
    customClauses?: string;
}

export interface SignAgreementDTO {
    signatureUrl: string;
}

export interface AddTenantRemarksDTO {
    tenantRemarks: string;
}

export interface TerminateAgreementDTO {
    terminationReason: string;
}

export interface UpdateDepositDTO {
    depositRefundStatus: DepositRefundStatus;
    depositRefundAmount: number;
    depositRefundDate: string;
}

export interface GetMyAgreementsDTO {
    userId: string;
    role: 'owner' | 'tenant';
    status?: AgreementStatus;
}
