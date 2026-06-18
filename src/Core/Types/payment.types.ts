export type PaymentStatus =
    | 'PENDING'
    | 'PAID'
    | 'FAILED'
    | 'PARTIALLY_PAID'
    | 'OVERDUE'
    | 'CANCELLED'
    | 'REFUNDED';

export type PaymentCategory = 'RENT' | 'SECURITY_DEPOSIT' | 'MAINTENANCE' | 'LATE_FEE' | 'OTHER';

export interface PaymentTypeData {
    id: string;
    transactionId?: string;

    agreementId: string;
    propertyId: string;
    payerId: string;
    payeeId: string;

    amount: number;
    category: PaymentCategory;
    dueDate?: Date;
    paidDate?: Date;

    paymentGateway?: string;
    paymentMethod?: string;

    status: PaymentStatus;
    lateFeeApplied: number;
    daysLate: number;

    gatewayOrderId?: string;
    gatewayPaymentId?: string;
    failureReason?: string;

    receiptUrl?: string;

    isRefunded: boolean;
    refundAmount?: number;
    refundDate?: Date;
    refundReason?: string;
    gatewayRefundId?: string;

    createdAt: Date;
    updatedAt: Date;
}
