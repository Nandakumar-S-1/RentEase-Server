export enum AgreementStatus {
    DRAFT = 'DRAFT',
    PENDING_TENANT_SIGNATURE = 'PENDING_TENANT_SIGNATURE',
    PENDING_PAYMENT = 'PENDING_PAYMENT',
    ACTIVE = 'ACTIVE',
    EXPIRED = 'EXPIRED',
    TERMINATED = 'TERMINATED',
}

export enum DepositRefundStatus {
    PENDING = 'PENDING',
    PARTIAL = 'PARTIAL',
    FULL = 'FULL',
    DISPUTED = 'DISPUTED',
}

export interface AgreementTypeData {
    id: string;
    agreementNumber: string;
    propertyId: string;
    ownerId: string;
    tenantId: string;

    property?: { title: string; locationCity: string };
    owner?: { fullName: string; email: string; phone?: string; avatarUrl?: string };
    tenant?: { fullName: string; email: string; phone?: string; avatarUrl?: string };

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
    tenantKycDocumentUrl?: string;

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
