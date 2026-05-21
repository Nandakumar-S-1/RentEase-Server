import { ICreateAgreementUseCase } from '@application/interfaces/agreement/agreement.usecase.interface';
import { CreateAgreementDTO } from '@application/dtos/agreement/agreement.dto';
import { AgreementResponseDTO } from '@application/dtos/agreement/res/agreement-response.dto';
import { IAgreementRepository } from '@core/interfaces/repository/agreement-repository.interface';
import { AgreementEntity } from '@core/entities/agreement.entity';
import crypto from 'crypto';
import { inject, injectable } from 'tsyringe';
import { logger } from '@shared/log/logger';
import { IUserRepository } from '@core/interfaces/repository/user-repository.interface';

@injectable()
export class CreateAgreementUseCase implements ICreateAgreementUseCase {
    constructor(
        @inject('IAgreementRepository') private agreementRepository: IAgreementRepository,
        @inject('IUserRepository') private userRepository: IUserRepository,
    ) {}

    async execute(dto: CreateAgreementDTO): Promise<AgreementResponseDTO> {
        logger.info({ propertyId: dto.propertyId }, 'Creating new agreement');

        if (!dto.tenantEmail) {
            throw new Error('Tenant email is required');
        }

        const tenant = await this.userRepository.findByEmail(dto.tenantEmail);
        if (!tenant) {
            throw new Error('No registered tenant found with the provided email address');
        }
        if (tenant.role !== 'TENANT') {
            throw new Error('The user with the provided email address is not registered as a tenant');
        }

        if (!dto.ownerId) {
            throw new Error('Owner ID is required');
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

            status: 'DRAFT', // Starts as Draft
            depositPaid: false,

            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const created = await this.agreementRepository.create(newAgreement);

        return {
            id: created.id,
            agreementNumber: created.agreementNumber,
            propertyId: created.propertyId,
            ownerId: created.ownerId,
            tenantId: created.tenantId,
            status: created.status,
            startDate: created.startDate,
            endDate: created.endDate,
            monthlyRent: created.monthlyRent,
            depositAmount: created.depositAmount,
        } as AgreementResponseDTO;
    }
}
