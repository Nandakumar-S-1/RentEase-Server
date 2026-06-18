import { ISignOwnerUseCase } from '@application/interfaces/agreement/agreement.usecase.interface';
import { SignAgreementDTO } from '@application/dtos/agreement/agreement.dto';
import { IAgreementRepository } from '@core/interfaces/repository/agreement-repository.interface';
import { ICreateNotificationUsecase } from '@application/interfaces/notification/notification.usecase.interface';
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

        try {
            await this.createNotification.execute({
                userId: agreement.tenantId,
                notificationType: NotificationType.AGREEMENT_CREATED,
                title: 'Agreement Signature Pending',
                message: `The landlord has signed the rental agreement (No. ${agreement.agreementNumber}). It is now ready for your signature.`,
                actionUrl: `/agreements/${agreement.id}`,
                relatedEntityType: 'Agreement',
                relatedEntityId: agreement.id,
                notificationData: { agreementNumber: agreement.agreementNumber },
            });
        } catch (error) {
            logger.error({ err: error }, 'Failed to trigger notification for landlord signing');
        }
    }
}
