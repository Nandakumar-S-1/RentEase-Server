import { ICreateAgreementUseCase } from '@application/interfaces/agreement/agreement.usecase.interface';
import { CreateAgreementDTO } from '@application/dtos/agreement/agreement.dto';
import { AgreementResponseDTO } from '@application/dtos/agreement/res/agreement-response.dto';
import { AgreementResponseMapper } from '@application/mappers/agreement/agreement-response.mapper';
import { IAgreementRepository } from '@core/interfaces/repository/agreement-repository.interface';
import { AgreementEntity } from '@core/entities/agreement.entity';
import { ICreateNotificationUsecase } from '@application/interfaces/notification/notification.usecase.interface';
import { TokenTypes } from '@shared/types/tokens';
import { NotificationType } from '@shared/enums/notification-type.enum';
import crypto from 'crypto';
import { inject, injectable } from 'tsyringe';
import { logger } from '@shared/log/logger';
import { IUserRepository } from '@core/interfaces/repository/user-repository.interface';
import {
    TenantEmailRequiredError,
    TenantUserNotFoundError,
    InvalidTenantRoleError,
    OwnerIdRequiredError,
} from '@shared/errors/agreement-errors';

@injectable()
export class CreateAgreementUseCase implements ICreateAgreementUseCase {
    constructor(
        @inject(TokenTypes.IAgreementRepository) private agreementRepository: IAgreementRepository,
        @inject(TokenTypes.IUserRepository) private userRepository: IUserRepository,
        @inject(TokenTypes.ICreateNotificationUseCase)
        private createNotification: ICreateNotificationUsecase,
    ) {}

    async execute(dto: CreateAgreementDTO): Promise<AgreementResponseDTO> {
        logger.info({ propertyId: dto.propertyId }, 'Creating new agreement');

        if (!dto.tenantEmail) {
            throw new TenantEmailRequiredError();
        }

        const tenant = await this.userRepository.findByEmail(dto.tenantEmail);
        if (!tenant) {
            throw new TenantUserNotFoundError();
        }
        if (tenant.role !== 'TENANT') {
            throw new InvalidTenantRoleError();
        }

        if (!dto.ownerId) {
            throw new OwnerIdRequiredError();
        }

        const agreementNumber = `AGR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const newAgreement = AgreementEntity.create({
            id: crypto.randomUUID(),
            agreementNumber,
            propertyId: dto.propertyId,
            ownerId: dto.ownerId,
            tenantId: tenant.id,

            startDate: new Date(dto.startDate),
            endDate: new Date(dto.endDate),
            lockInPeriodMonths: dto.lockInPeriodMonths,
            noticePeriodMonths: dto.noticePeriodMonths,

            monthlyRent: dto.monthlyRent,
            depositAmount: dto.depositAmount,
            maintenanceCharges: dto.maintenanceCharges ?? 0,
            maintenanceIncluded: dto.maintenanceIncluded ?? true,
            lateFeePerDay: dto.lateFeePerDay ?? 0,
            lateFeeGracePeriodDays: dto.lateFeeGracePeriodDays ?? 0,
            rentEscalationPercentage: dto.rentEscalationPercentage ?? 0,

            termsAndConditions: dto.termsAndConditions ?? [],
            customClauses: dto.customClauses,

            status: 'DRAFT',
            depositPaid: false,

            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const created = await this.agreementRepository.create(newAgreement);

        try {
            await this.createNotification.execute({
                userId: tenant.id,
                notificationType: NotificationType.AGREEMENT_CREATED,
                title: 'Rental Agreement Created',
                message: `A new rental agreement draft (No. ${created.agreementNumber}) has been created by the landlord. Please review and sign it.`,
                actionUrl: `/agreements/${created.id}`,
                relatedEntityType: 'Agreement',
                relatedEntityId: created.id,
                notificationData: { agreementNumber: created.agreementNumber },
            });
        } catch (error) {
            logger.error({ err: error }, 'Failed to trigger notification for agreement creation');
        }

        return AgreementResponseMapper.toResponse(created);
    }
}
