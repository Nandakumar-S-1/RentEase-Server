import { IUploadTenantKycUseCase } from '@application/interfaces/agreement/agreement.usecase.interface';
import { AgreementResponseDTO } from '@application/dtos/agreement/res/agreement-response.dto';
import { AgreementResponseMapper } from '@application/mappers/agreement/agreement-response.mapper';
import { IAgreementRepository } from '@core/interfaces/repository/agreement-repository.interface';
import { inject, injectable } from 'tsyringe';
import { logger } from '@shared/log/logger';
import { TokenTypes } from '@shared/types/tokens';
import { AgreementNotFoundError } from '@shared/errors/agreement-errors';

@injectable()
export class UploadTenantKycUseCase implements IUploadTenantKycUseCase {
    constructor(
        @inject(TokenTypes.IAgreementRepository) private agreementRepository: IAgreementRepository,
    ) { }

    async execute(id: string, kycUrl: string): Promise<AgreementResponseDTO> {
        logger.info({ id, kycUrl }, 'uploading tenant KYC document for agreement');

        const agreement = await this.agreementRepository.findById(id);
        if (!agreement) {
            throw new AgreementNotFoundError();
        }

        agreement.updateKycDocument(kycUrl);
        const updated = await this.agreementRepository.update(agreement);

        return AgreementResponseMapper.toResponse(updated);
    }
}
