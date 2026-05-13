export type AgreementStatus =
    | 'DRAFT'
    | 'PENDING_TENANT_SIGNATURE'
    | 'ACTIVE'
    | 'EXPIRED'
    | 'TERMINATED';

export type DepositRefundStatus = 'PENDING' | 'PARTIAL' | 'FULL' | 'DISPUTED';

export interface AgreementTypeData {
    id: string;
    agreementNumber: string;
    propertyId: string;
    ownerId: string;
    tenantId: string;

    // Terms
    startDate: Date;
    endDate: Date;
    lockInPeriodMonths: number;
    noticePeriodMonths: number;

    // Financial
    monthlyRent: number;
    depositAmount: number;
    maintenanceCharges: number;
    maintenanceIncluded: boolean;
    lateFeePerDay: number;
    lateFeeGracePeriodDays: number;
    rentEscalationPercentage: number;

    // Content
    termsAndConditions: object[];
    customClauses?: string;
    tenantRemarks?: string;

    // Signatures
    ownerSignatureUrl?: string;
    ownerSignedAt?: Date;
    tenantSignatureUrl?: string;
    tenantSignedAt?: Date;
    agreementPdfUrl?: string;

    // Status
    status: AgreementStatus;
    terminationReason?: string;
    terminatedAt?: Date;
    terminatedById?: string;

    // Deposit
    depositPaid: boolean;
    depositPaidAt?: Date;
    depositRefundStatus?: DepositRefundStatus;
    depositRefundAmount?: number;
    depositRefundDate?: Date;

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
}
