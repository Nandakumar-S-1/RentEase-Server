import { IGetAgreementPaymentsUseCase } from '@application/interfaces/payment/payment.usecase.interface';
import { PaymentResponseDTO } from '@application/dtos/payment/res/payment-response.dto';
import { PaymentResponseMapper } from '@application/mappers/payment/payment-response.mapper';
import { IAgreementRepository } from '@core/interfaces/repository/agreement-repository.interface';
import { IPaymentRepository } from '@core/interfaces/repository/payment-repository.interface';
import { TokenTypes } from '@shared/types/tokens';
import { inject, injectable } from 'tsyringe';
import { AgreementNotFoundError } from '@shared/errors/agreement-errors';
import { UnauthorizedPaymentAccessError } from '@shared/errors/payment-errors';

@injectable()
export class GetAgreementPaymentsUseCase implements IGetAgreementPaymentsUseCase {
    constructor(
        @inject(TokenTypes.IAgreementRepository)
        private agreementRepository: IAgreementRepository,
        @inject(TokenTypes.IPaymentRepository) private paymentRepository: IPaymentRepository,
    ) {}

    async execute(agreementId: string, userId: string): Promise<PaymentResponseDTO[]> {
        const agreement = await this.agreementRepository.findById(agreementId);
        if (!agreement) {
            throw new AgreementNotFoundError();
        }

        if (agreement.ownerId !== userId && agreement.tenantId !== userId) {
            throw new UnauthorizedPaymentAccessError();
        }

        const payments = await this.paymentRepository.findByAgreementId(agreementId);
        return PaymentResponseMapper.toListResponse(payments);
    }
}
