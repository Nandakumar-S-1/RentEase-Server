import { IGetPaymentByIdUseCase } from '@application/interfaces/payment/payment.usecase.interface';
import { PaymentResponseDTO } from '@application/dtos/payment/res/payment-response.dto';
import { PaymentResponseMapper } from '@application/mappers/payment/payment-response.mapper';
import { IPaymentRepository } from '@core/interfaces/repository/payment-repository.interface';
import { TokenTypes } from '@shared/types/tokens';
import { inject, injectable } from 'tsyringe';
import {
    PaymentNotFoundError,
    UnauthorizedPaymentAccessError,
} from '@shared/errors/payment-errors';

@injectable()
export class GetPaymentByIdUseCase implements IGetPaymentByIdUseCase {
    constructor(
        @inject(TokenTypes.IPaymentRepository) private paymentRepository: IPaymentRepository,
    ) {}

    async execute(paymentId: string, userId: string): Promise<PaymentResponseDTO> {
        const payment = await this.paymentRepository.findById(paymentId);
        if (!payment) {
            throw new PaymentNotFoundError();
        }

        if (payment.payerId !== userId && payment.payeeId !== userId) {
            throw new UnauthorizedPaymentAccessError();
        }

        return PaymentResponseMapper.toResponse(payment);
    }
}
