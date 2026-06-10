import { PaymentCategory, PaymentStatus, PaymentTypeData } from '@core/types/payment.types';

export class PaymentEntity {
    private constructor(
        private readonly _id: string,
        private _transactionId: string | undefined,
        private readonly _agreementId: string,
        private readonly _propertyId: string,
        private readonly _payerId: string,
        private readonly _payeeId: string,
        private _amount: number,
        private _category: PaymentCategory,
        private _dueDate: Date | undefined,
        private _paidDate: Date | undefined,
        private _paymentGateway: string | undefined,
        private _paymentMethod: string | undefined,
        private _status: PaymentStatus,
        private _lateFeeApplied: number,
        private _daysLate: number,
        private _gatewayOrderId: string | undefined,
        private _gatewayPaymentId: string | undefined,
        private _failureReason: string | undefined,
        private _receiptUrl: string | undefined,
        private _isRefunded: boolean,
        private _refundAmount: number | undefined,
        private _refundDate: Date | undefined,
        private _refundReason: string | undefined,
        private _gatewayRefundId: string | undefined,
        private readonly _createdAt: Date,
        private _updatedAt: Date,
    ) {}

    static create(data: PaymentTypeData): PaymentEntity {
        return new PaymentEntity(
            data.id,
            data.transactionId,
            data.agreementId,
            data.propertyId,
            data.payerId,
            data.payeeId,
            data.amount,
            data.category,
            data.dueDate,
            data.paidDate,
            data.paymentGateway,
            data.paymentMethod,
            data.status ?? 'PENDING',
            data.lateFeeApplied ?? 0,
            data.daysLate ?? 0,
            data.gatewayOrderId,
            data.gatewayPaymentId,
            data.failureReason,
            data.receiptUrl,
            data.isRefunded ?? false,
            data.refundAmount,
            data.refundDate,
            data.refundReason,
            data.gatewayRefundId,
            data.createdAt ?? new Date(),
            data.updatedAt ?? new Date(),
        );
    }

    markPaid(
        paymentGateway: string,
        paymentMethod: string,
        gatewayPaymentId: string,
        gatewayOrderId?: string,
        receiptUrl?: string,
    ): void {
        this._status = 'PAID';
        this._paymentGateway = paymentGateway;
        this._paymentMethod = paymentMethod;
        this._gatewayPaymentId = gatewayPaymentId;
        if (gatewayOrderId) this._gatewayOrderId = gatewayOrderId;
        if (receiptUrl) this._receiptUrl = receiptUrl;
        this._paidDate = new Date();
        this._updatedAt = new Date();
    }

    markFailed(reason: string, gatewayPaymentId?: string): void {
        this._status = 'FAILED';
        this._failureReason = reason;
        if (gatewayPaymentId) this._gatewayPaymentId = gatewayPaymentId;
        this._updatedAt = new Date();
    }

    applyLateFee(lateFee: number, days: number): void {
        this._lateFeeApplied = lateFee;
        this._daysLate = days;
        this._amount += lateFee;
        this._updatedAt = new Date();
    }

    markRefunded(amount: number, reason: string, refundId: string): void {
        this._isRefunded = true;
        this._refundAmount = amount;
        this._refundReason = reason;
        this._gatewayRefundId = refundId;
        this._refundDate = new Date();
        this._status = 'REFUNDED';
        this._updatedAt = new Date();
    }

    startCheckout(orderId: string): void {
        this._gatewayOrderId = orderId;
        this._paymentGateway = 'stripe';
        this._updatedAt = new Date();
    }

    setGatewayPaymentId(paymentId: string): void {
        this._gatewayPaymentId = paymentId;
        this._updatedAt = new Date();
    }

    setTransactionId(transactionId: string): void {
        this._transactionId = transactionId;
        this._updatedAt = new Date();
    }

    get id() {
        return this._id;
    }
    get transactionId() {
        return this._transactionId;
    }
    get agreementId() {
        return this._agreementId;
    }
    get propertyId() {
        return this._propertyId;
    }
    get payerId() {
        return this._payerId;
    }
    get payeeId() {
        return this._payeeId;
    }
    get amount() {
        return this._amount;
    }
    get category() {
        return this._category;
    }
    get dueDate() {
        return this._dueDate;
    }
    get paidDate() {
        return this._paidDate;
    }
    get paymentGateway() {
        return this._paymentGateway;
    }
    get paymentMethod() {
        return this._paymentMethod;
    }
    get status() {
        return this._status;
    }
    get lateFeeApplied() {
        return this._lateFeeApplied;
    }
    get daysLate() {
        return this._daysLate;
    }
    get gatewayOrderId() {
        return this._gatewayOrderId;
    }
    get gatewayPaymentId() {
        return this._gatewayPaymentId;
    }
    get failureReason() {
        return this._failureReason;
    }
    get receiptUrl() {
        return this._receiptUrl;
    }
    get isRefunded() {
        return this._isRefunded;
    }
    get refundAmount() {
        return this._refundAmount;
    }
    get refundDate() {
        return this._refundDate;
    }
    get refundReason() {
        return this._refundReason;
    }
    get gatewayRefundId() {
        return this._gatewayRefundId;
    }
    get createdAt() {
        return this._createdAt;
    }
    get updatedAt() {
        return this._updatedAt;
    }
}
