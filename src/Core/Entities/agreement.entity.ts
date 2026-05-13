import { AgreementTypeData, AgreementStatus, DepositRefundStatus } from '@core/types/agreement.types';

export class AgreementEntity {
    private constructor(
        private readonly _id: string,
        private _agreementNumber: string,
        private readonly _propertyId: string,
        private readonly _ownerId: string,
        private readonly _tenantId: string,

        private readonly _startDate: Date,
        private readonly _endDate: Date,
        private _lockInPeriodMonths: number,
        private _noticePeriodMonths: number,

        private _monthlyRent: number,
        private _depositAmount: number,
        private _maintenanceCharges: number,
        private _maintenanceIncluded: boolean,
        private _lateFeePerDay: number,
        private _lateFeeGracePeriodDays: number,
        private _rentEscalationPercentage: number,

        private _termsAndConditions: object[],
        private _customClauses: string | undefined,
        private _tenantRemarks: string | undefined,

        private _ownerSignatureUrl: string | undefined,
        private _ownerSignedAt: Date | undefined,
        private _tenantSignatureUrl: string | undefined,
        private _tenantSignedAt: Date | undefined,
        private _agreementPdfUrl: string | undefined,

        private _status: AgreementStatus,
        private _terminationReason: string | undefined,
        private _terminatedAt: Date | undefined,
        private _terminatedById: string | undefined,
        private _depositPaid: boolean,
        private _depositPaidAt: Date | undefined,
        private _depositRefundStatus: DepositRefundStatus | undefined,
        private _depositRefundAmount: number | undefined,
        private _depositRefundDate: Date | undefined,

        private readonly _createdAt: Date,
        private _updatedAt: Date,
    ) { }


    static create(data: AgreementTypeData): AgreementEntity {
        return new AgreementEntity(
            data.id,
            data.agreementNumber,
            data.propertyId,
            data.ownerId,
            data.tenantId,

            data.startDate,
            data.endDate,
            data.lockInPeriodMonths,
            data.noticePeriodMonths,

            data.monthlyRent,
            data.depositAmount,
            data.maintenanceCharges ?? 0,
            data.maintenanceIncluded ?? true,
            data.lateFeePerDay ?? 100,
            data.lateFeeGracePeriodDays ?? 3,
            data.rentEscalationPercentage ?? 0,

            data.termsAndConditions ?? [],
            data.customClauses,
            data.tenantRemarks,

            data.ownerSignatureUrl,
            data.ownerSignedAt,
            data.tenantSignatureUrl,
            data.tenantSignedAt,
            data.agreementPdfUrl,

            data.status ?? 'draft',
            data.terminationReason,
            data.terminatedAt,
            data.terminatedById,

            data.depositPaid ?? false,
            data.depositPaidAt,
            data.depositRefundStatus,
            data.depositRefundAmount,
            data.depositRefundDate,

            data.createdAt ?? new Date(),
            data.updatedAt ?? new Date(),
        );
    }


    signOwner(signatureUrl: string): void {
        this._ownerSignatureUrl = signatureUrl;
        this._ownerSignedAt = new Date();
        this._status = 'PENDING_TENANT_SIGNATURE';
        this._updatedAt = new Date();
    }

    signTenant(signatureUrl: string): void {
        this._tenantSignatureUrl = signatureUrl;
        this._tenantSignedAt = new Date();
        this._status = 'ACTIVE';
        this._updatedAt = new Date();
    }

    addTenantRemarks(remarks: string): void {
        this._tenantRemarks = remarks;
        this._updatedAt = new Date();
    }

    setPdfUrl(url: string): void {
        this._agreementPdfUrl = url;
        this._updatedAt = new Date();
    }

    terminate(reason: string, terminatedById: string): void {
        this._status = 'TERMINATED';
        this._terminationReason = reason;
        this._terminatedById = terminatedById;
        this._terminatedAt = new Date();
        this._updatedAt = new Date();
    }

    markDepositPaid(): void {
        this._depositPaid = true;
        this._depositPaidAt = new Date();
        this._updatedAt = new Date();
    }

    setDepositRefund(
        status: DepositRefundStatus,
        amount: number,
        refundDate: Date,
    ): void {
        this._depositRefundStatus = status;
        this._depositRefundAmount = amount;
        this._depositRefundDate = refundDate;
        this._updatedAt = new Date();
    }

    markExpired(): void {
        this._status = 'EXPIRED';
        this._updatedAt = new Date();
    }


    get id() { return this._id; }
    get agreementNumber() { return this._agreementNumber; }
    get propertyId() { return this._propertyId; }
    get ownerId() { return this._ownerId; }
    get tenantId() { return this._tenantId; }

    get startDate() { return this._startDate; }
    get endDate() { return this._endDate; }
    get lockInPeriodMonths() { return this._lockInPeriodMonths; }
    get noticePeriodMonths() { return this._noticePeriodMonths; }

    get monthlyRent() { return this._monthlyRent; }
    get depositAmount() { return this._depositAmount; }
    get maintenanceCharges() { return this._maintenanceCharges; }
    get maintenanceIncluded() { return this._maintenanceIncluded; }
    get lateFeePerDay() { return this._lateFeePerDay; }
    get lateFeeGracePeriodDays() { return this._lateFeeGracePeriodDays; }
    get rentEscalationPercentage() { return this._rentEscalationPercentage; }

    get termsAndConditions() { return this._termsAndConditions; }
    get customClauses() { return this._customClauses; }
    get tenantRemarks() { return this._tenantRemarks; }

    get ownerSignatureUrl() { return this._ownerSignatureUrl; }
    get ownerSignedAt() { return this._ownerSignedAt; }
    get tenantSignatureUrl() { return this._tenantSignatureUrl; }
    get tenantSignedAt() { return this._tenantSignedAt; }
    get agreementPdfUrl() { return this._agreementPdfUrl; }

    get status() { return this._status; }
    get terminationReason() { return this._terminationReason; }
    get terminatedAt() { return this._terminatedAt; }
    get terminatedById() { return this._terminatedById; }

    get depositPaid() { return this._depositPaid; }
    get depositPaidAt() { return this._depositPaidAt; }
    get depositRefundStatus() { return this._depositRefundStatus; }
    get depositRefundAmount() { return this._depositRefundAmount; }
    get depositRefundDate() { return this._depositRefundDate; }

    get createdAt() { return this._createdAt; }
    get updatedAt() { return this._updatedAt; }
}
