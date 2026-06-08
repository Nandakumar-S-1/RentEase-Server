import { IGetAgreementUseCase } from '@application/interfaces/agreement/agreement.usecase.interface';
import { AgreementResponseDTO } from '@application/dtos/agreement/res/agreement-response.dto';
import { IAgreementRepository } from '@core/interfaces/repository/agreement-repository.interface';
import { AgreementResponseMapper } from '@application/mappers/agreement/agreement-response.mapper';
import { inject, injectable } from 'tsyringe';
import { TokenTypes } from '@shared/types/tokens';
import { AgreementNotFoundError } from '@shared/errors/agreement-errors';

@injectable()
export class GetAgreementUseCase implements IGetAgreementUseCase {
    constructor(
        @inject(TokenTypes.IAgreementRepository) private agreementRepository: IAgreementRepository,
    ) {}

    async execute(id: string): Promise<AgreementResponseDTO> {
        const agreement = await this.agreementRepository.findById(id);
        if (!agreement) {
            throw new AgreementNotFoundError();
        }
        return AgreementResponseMapper.toResponse(agreement);
    }
}
