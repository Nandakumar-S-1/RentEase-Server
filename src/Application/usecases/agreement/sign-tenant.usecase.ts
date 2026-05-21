import { ISignTenantUseCase } from '@application/interfaces/agreement/agreement.usecase.interface';
import { SignAgreementDTO } from '@application/dtos/agreement/agreement.dto';
import { IAgreementRepository } from '@core/interfaces/repository/agreement-repository.interface';
import { inject, injectable } from 'tsyringe';
import { logger } from '@shared/log/logger';

@injectable()
export class SignTenantUseCase implements ISignTenantUseCase {
    constructor(
        @inject('IAgreementRepository') private agreementRepository: IAgreementRepository,
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
    }
}
