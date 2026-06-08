import { IGetMyAgreementsUseCase } from '@application/interfaces/agreement/agreement.usecase.interface';
import { AgreementResponseDTO } from '@application/dtos/agreement/res/agreement-response.dto';
import { GetMyAgreementsDTO } from '@application/dtos/agreement/agreement.dto';
import { IAgreementRepository } from '@core/interfaces/repository/agreement-repository.interface';
import { AgreementResponseMapper } from '@application/mappers/agreement/agreement-response.mapper';
import { UserRole } from '@shared/enums/user-role.enum';
import { inject, injectable } from 'tsyringe';
import { TokenTypes } from '@shared/types/tokens';
import { UnauthorizedRoleAccessError } from '@shared/errors/agreement-errors';

@injectable()
export class GetMyAgreementsUseCase implements IGetMyAgreementsUseCase {
    constructor(
        @inject(TokenTypes.IAgreementRepository) private agreementRepository: IAgreementRepository,
    ) {}

    async execute(dto: GetMyAgreementsDTO): Promise<AgreementResponseDTO[]> {
        let agreements = [];
        if (dto.role === UserRole.TENANT) {
            agreements = await this.agreementRepository.findByTenantId(dto.userId, dto.status);
        } else if (dto.role === UserRole.OWNER) {
            agreements = await this.agreementRepository.findByOwnerId(dto.userId, dto.status);
        } else {
            throw new UnauthorizedRoleAccessError();
        }

        return AgreementResponseMapper.toListResponse(agreements);
    }
}
