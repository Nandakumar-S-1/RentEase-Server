import { ISignTenantUseCase } from '@application/interfaces/agreement/agreement.usecase.interface';
import { SignAgreementDTO } from '@application/dtos/agreement/agreement.dto';
import { IAgreementRepository } from '@core/interfaces/repository/agreement-repository.interface';
import { ICreateNotificationUsecase } from '@application/interfaces/notification/notification.usecase.interface';
import { TokenTypes } from '@shared/types/tokens';
import { NotificationType } from '@shared/enums/notification-type.enum';
import { inject, injectable } from 'tsyringe';
import { logger } from '@shared/log/logger';

@injectable()
export class SignTenantUseCase implements ISignTenantUseCase {
    constructor(
        @inject('IAgreementRepository') private agreementRepository: IAgreementRepository,
        @inject(TokenTypes.ICreateNotificationUseCase) private createNotification: ICreateNotificationUsecase,
    ) {}

    async execute(id: string, dto: SignAgreementDTO): Promise<void> {
        logger.info({ agreementId: id }, 'Tenant signing agreement');

        const agreement = await this.agreementRepository.findById(id);
        if (!agreement) {
            throw new Error('Agreement not found');
        }

        if (agreement.status !== 'PENDING_TENANT_SIGNATURE') {
            throw new Error(`Cannot sign agreement in ${agreement.status} status`);
        }

        // Note: Tenant KYC check would typically happen here. E.g., checking if tenantProfile.verificationStatus is 'VERIFIED'.

        agreement.signTenant(dto.signatureUrl);
        await this.agreementRepository.update(agreement);

        try {
            await this.createNotification.execute({
                userId: agreement.ownerId,
                notificationType: NotificationType.AGREEMENT_SIGNED,
                title: 'Rental Agreement Signed',
                message: `The tenant has signed the rental agreement (No. ${agreement.agreementNumber}). The agreement is now ACTIVE.`,
                actionUrl: `/agreements/${agreement.id}`,
                relatedEntityType: 'Agreement',
                relatedEntityId: agreement.id,
                notificationData: { agreementNumber: agreement.agreementNumber }
            });
        } catch (error) {
            logger.error({ err: error }, 'Failed to trigger notification for tenant signing');
        }
    }
}
