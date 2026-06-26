import { ICreateActivationPaymentUseCase } from '@application/interfaces/payment/payment.usecase.interface';
import { PaymentResponseDTO } from '@application/dtos/payment/res/payment-response.dto';
import { PaymentCategory, PaymentStatus } from '@core/types/payment.types';
import { PaymentResponseMapper } from '@application/mappers/payment/payment-response.mapper';
import { IAgreementRepository } from '@core/interfaces/repository/agreement-repository.interface';
import { IPaymentRepository } from '@core/interfaces/repository/payment-repository.interface';
import { PaymentEntity } from '@core/entities/payment.entity';
import { TokenTypes } from '@shared/types/tokens';
import { inject, injectable } from 'tsyringe';
import crypto from 'crypto';
import { AgreementNotFoundError } from '@shared/errors/agreement-errors';
import { logger } from '@shared/log/logger';

@injectable()
export class CreateActivationPaymentUseCase implements ICreateActivationPaymentUseCase {
    constructor(
        @inject(TokenTypes.IAgreementRepository)
        private agreementRepository: IAgreementRepository,
        @inject(TokenTypes.IPaymentRepository) private paymentRepository: IPaymentRepository,
    ) {}

    async execute(agreementId: string): Promise<PaymentResponseDTO> {
        const agreement = await this.agreementRepository.findById(agreementId);
        if (!agreement) {
            throw new AgreementNotFoundError();
        }

        if (agreement.status !== 'PENDING_PAYMENT') {
            throw new AgreementNotFoundError();
        }

        const existingPayments = await this.paymentRepository.findByAgreementId(agreementId);
        const existingDeposit = existingPayments.find((p) => p.category === 'SECURITY_DEPOSIT');
        if (existingDeposit) {
            return PaymentResponseMapper.toResponse(existingDeposit);
        }

        const payment = PaymentEntity.create({
            id: crypto.randomUUID(),
            transactionId: crypto.randomUUID(),
            agreementId: agreement.id,
            propertyId: agreement.propertyId,
            payerId: agreement.tenantId,
            payeeId: agreement.ownerId,
            amount: agreement.depositAmount,
            category: PaymentCategory.SECURITY_DEPOSIT,
            status: PaymentStatus.PENDING,
            lateFeeApplied: 0,
            daysLate: 0,
            isRefunded: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const saved = await this.paymentRepository.create(payment);
        logger.info({ paymentId: saved.id, agreementId }, 'Activation payment created');

        return PaymentResponseMapper.toResponse(saved);
    }
}
