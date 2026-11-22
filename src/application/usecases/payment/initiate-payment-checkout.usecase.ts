import { IInitiatePaymentCheckoutUseCase } from '@application/interfaces/payment/payment.usecase.interface';
import { InitiateCheckoutDTO } from '@application/dtos/payment/payment.dto';
import { CheckoutResponseDTO } from '@application/dtos/payment/res/payment-response.dto';
import { IAgreementRepository } from '@core/interfaces/repository/agreement-repository.interface';
import { IPaymentRepository } from '@core/interfaces/repository/payment-repository.interface';
import { IStripeService } from '@application/interfaces/services/stripe.service.interface';
import { TokenTypes } from '@shared/types/tokens';
import { inject, injectable } from 'tsyringe';
import {
    InvalidPaymentStatusError,
    PaymentAlreadyPaidError,
    PaymentNotFoundError,
    UnauthorizedPaymentAccessError,
} from '@shared/errors/payment-errors';

@injectable()
export class InitiatePaymentCheckoutUseCase implements IInitiatePaymentCheckoutUseCase {
    constructor(
        @inject(TokenTypes.IPaymentRepository) private paymentRepository: IPaymentRepository,
        @inject(TokenTypes.IAgreementRepository)
        private agreementRepository: IAgreementRepository,
        @inject(TokenTypes.IStripeService) private stripeService: IStripeService,
    ) {}

    async execute(
        paymentId: string,
        userId: string,
        dto: InitiateCheckoutDTO,
    ): Promise<CheckoutResponseDTO> {
        const payment = await this.paymentRepository.findById(paymentId);
        if (!payment) {
            throw new PaymentNotFoundError();
        }

        if (payment.payerId !== userId) {
            throw new UnauthorizedPaymentAccessError();
        }

        if (payment.status === 'PAID') {
            throw new PaymentAlreadyPaidError();
        }

        if (payment.status !== 'PENDING') {
            throw new InvalidPaymentStatusError(payment.status);
        }

        const agreement = await this.agreementRepository.findById(payment.agreementId);
        if (!agreement) {
            throw new InvalidPaymentStatusError('UNKNOWN');
        }
        const validAgreementStatus =
            payment.category === 'SECURITY_DEPOSIT'
                ? agreement.status === 'PENDING_PAYMENT'
                : agreement.status === 'ACTIVE';

        if (!validAgreementStatus) {
            throw new InvalidPaymentStatusError(agreement.status);
        }

        const description =
            payment.category === 'SECURITY_DEPOSIT' ? 'Security Deposit' : 'Rent Payment';

        const session = await this.stripeService.createCheckoutSession({
            paymentId: payment.id,
            amount: payment.amount,
            description,
            successUrl: dto.successUrl,
            cancelUrl: dto.cancelUrl,
        });

        payment.startCheckout(session.sessionId);
        await this.paymentRepository.update(payment);

        return {
            checkoutUrl: session.checkoutUrl,
            sessionId: session.sessionId,
            paymentId: payment.id,
        };
    }
}
