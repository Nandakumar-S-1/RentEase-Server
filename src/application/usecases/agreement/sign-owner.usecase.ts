import { ISignOwnerUseCase } from '@application/interfaces/agreement/agreement.usecase.interface';
import { SignAgreementDTO } from '@application/dtos/agreement/agreement.dto';
import { IAgreementRepository } from '@core/interfaces/repository/agreement-repository.interface';
import { ICreateNotificationUsecase } from '@application/interfaces/notification/notification.usecase.interface';
import { ICreateActivationPaymentUseCase } from '@application/interfaces/payment/payment.usecase.interface';
import { TokenTypes } from '@shared/types/tokens';
import { NotificationType } from '@shared/enums/notification-type.enum';
import { inject, injectable } from 'tsyringe';
import { logger } from '@shared/log/logger';
import {
    AgreementNotFoundError,
    InvalidAgreementStatusError,
} from '@shared/errors/agreement-errors';
import { AgreementStatus } from '@prisma/client';

@injectable()
export class SignOwnerUseCase implements ISignOwnerUseCase {
    constructor(
        @inject(TokenTypes.IAgreementRepository) private agreementRepository: IAgreementRepository,
        @inject(TokenTypes.ICreateNotificationUseCase)
        private createNotification: ICreateNotificationUsecase,
        @inject(TokenTypes.ICreateActivationPaymentUseCase)
        private createActivationPayment: ICreateActivationPaymentUseCase,
    ) {}

    async execute(id: string, dto: SignAgreementDTO): Promise<void> {
        logger.info({ agreementId: id }, 'Owner signing agreement');

        const agreement = await this.agreementRepository.findById(id);
        if (!agreement) {
            throw new AgreementNotFoundError();
        }

        if (agreement.status !== AgreementStatus.DRAFT) {
            throw new InvalidAgreementStatusError(agreement.status);
        }

        agreement.signOwner(dto.signatureUrl);
        await this.agreementRepository.update(agreement);

        const payment = await this.createActivationPayment.execute(id);

        try {
            await this.createNotification.execute({
                userId: agreement.tenantId,
                notificationType: NotificationType.PAYMENT_PENDING,
                title: 'Deposit Payment Required',
                message: `The landlord has signed the rental agreement (No. ${agreement.agreementNumber}). Please pay the security deposit to proceed.`,
                actionUrl: `/payments/${payment.id}`,
                relatedEntityType: 'Payment',
                relatedEntityId: payment.id,
                notificationData: {
                    agreementNumber: agreement.agreementNumber,
                    amount: payment.amount,
                },
            });
        } catch (error) {
            logger.error({ err: error }, 'Failed to trigger notification for landlord signing');
        }
    }
}
