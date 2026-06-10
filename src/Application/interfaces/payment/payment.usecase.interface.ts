import { InitiateCheckoutDTO } from '@application/dtos/payment/payment.dto';
import {
    CheckoutResponseDTO,
    PaymentResponseDTO,
} from '@application/dtos/payment/res/payment-response.dto';

export interface ICreateActivationPaymentUseCase {
    execute(agreementId: string): Promise<PaymentResponseDTO>;
}

export interface IInitiatePaymentCheckoutUseCase {
    execute(
        paymentId: string,
        userId: string,
        dto: InitiateCheckoutDTO,
    ): Promise<CheckoutResponseDTO>;
}

export interface IHandleStripeWebhookUseCase {
    execute(payload: Buffer, signature: string): Promise<void>;
}

export interface IGetAgreementPaymentsUseCase {
    execute(agreementId: string, userId: string): Promise<PaymentResponseDTO[]>;
}

export interface IGetPaymentByIdUseCase {
    execute(paymentId: string, userId: string): Promise<PaymentResponseDTO>;
}
