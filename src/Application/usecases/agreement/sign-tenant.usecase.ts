import { ISignTenantUseCase, IGeneratePdfUseCase } from '@application/interfaces/agreement/agreement.usecase.interface';
import { SignAgreementDTO } from '@application/dtos/agreement/agreement.dto';
import { IAgreementRepository } from '@core/interfaces/repository/agreement-repository.interface';
import { ICreateNotificationUsecase } from '@application/interfaces/notification/notification.usecase.interface';
import { TokenTypes } from '@shared/types/tokens';
import { NotificationType } from '@shared/enums/notification-type.enum';
import { inject, injectable } from 'tsyringe';
import { logger } from '@shared/log/logger';
import { AgreementNotFoundError, InvalidAgreementStatusError } from '@shared/errors/agreement-errors';
import { AgreementStatus } from '@prisma/client';

@injectable()
export class SignTenantUseCase implements ISignTenantUseCase {
    constructor(
        @inject(TokenTypes.IAgreementRepository) private agreementRepository: IAgreementRepository,
        @inject(TokenTypes.ICreateNotificationUseCase) private createNotification: ICreateNotificationUsecase,
        @inject(TokenTypes.IGeneratePdfUseCase) private generatePdfUseCase: IGeneratePdfUseCase,
    ) { }

    async execute(id: string, dto: SignAgreementDTO): Promise<string> {
        logger.info({ agreementId: id }, 'Tenant signing agreement');

        const agreement = await this.agreementRepository.findById(id);
        if (!agreement) {
            throw new AgreementNotFoundError();
        }

        if (agreement.status !== AgreementStatus.PENDING_TENANT_SIGNATURE) {
            throw new InvalidAgreementStatusError(agreement.status);
        }

        agreement.signTenant(dto.signatureUrl);
        await this.agreementRepository.update(agreement);

        let pdfUrl: string;
        try {
            pdfUrl = await this.generatePdfUseCase.execute(id);
        } catch (error) {
            logger.error({ agreementId: id, err: error }, 'Failed to generate PDF, reverting tenant signature');
            agreement.revertTenantSignature();
            await this.agreementRepository.update(agreement);
            throw error;
        }

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

        return pdfUrl;
    }
}
