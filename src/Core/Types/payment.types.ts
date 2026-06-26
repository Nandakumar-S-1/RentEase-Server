export enum PaymentStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    FAILED = 'FAILED',
    PARTIALLY_PAID = 'PARTIALLY_PAID',
    OVERDUE = 'OVERDUE',
    CANCELLED = 'CANCELLED',
    REFUNDED = 'REFUNDED',
}

export enum PaymentCategory {
    RENT = 'RENT',
    SECURITY_DEPOSIT = 'SECURITY_DEPOSIT',
    MAINTENANCE = 'MAINTENANCE',
    LATE_FEE = 'LATE_FEE',
    OTHER = 'OTHER',
}

export interface PaymentTypeData {
    id: string;
    transactionId?: string;

    agreementId: string;
    propertyId: string;
    payerId: string;
    payeeId: string;

    property?: { title: string; locationCity: string };
    payer?: { fullName: string; email: string; phone?: string; avatarUrl?: string };
    payee?: { fullName: string; email: string; phone?: string; avatarUrl?: string };
    agreement?: { agreementNumber: string };

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
