import { ISignOwnerUseCase } from '@application/interfaces/agreement/agreement.usecase.interface';
import { SignAgreementDTO } from '@application/dtos/agreement/agreement.dto';
import { IAgreementRepository } from '@core/interfaces/repository/agreement-repository.interface';
import { inject, injectable } from 'tsyringe';
import { logger } from '@shared/log/logger';

@injectable()
export class SignOwnerUseCase implements ISignOwnerUseCase {
    constructor(
        @inject('IAgreementRepository') private agreementRepository: IAgreementRepository,
    ) {}

    async execute(id: string, dto: SignAgreementDTO): Promise<void> {
        logger.info({ agreementId: id }, 'Owner signing agreement');

        const agreement = await this.agreementRepository.findById(id);
        if (!agreement) {
            throw new Error('Agreement not found');
        }

        if (agreement.status !== 'DRAFT') {
            throw new Error(`Cannot sign agreement in ${agreement.status} status`);
        }

        agreement.signOwner(dto.signatureUrl);
        await this.agreementRepository.update(agreement);
    }
}
