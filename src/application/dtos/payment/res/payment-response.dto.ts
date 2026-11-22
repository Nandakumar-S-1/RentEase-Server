import { PaymentCategory, PaymentStatus } from '@core/types/payment.types';

export interface PaymentResponseDTO {
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
    gatewayOrderId?: string;
    gatewayPaymentId?: string;
    failureReason?: string;
    receiptUrl?: string;
    isRefunded: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CheckoutResponseDTO {
    checkoutUrl: string;
    sessionId: string;
    paymentId: string;
}
