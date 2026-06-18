import { IGetMyAgreementsUseCase } from '@application/interfaces/agreement/agreement.usecase.interface';
import { AgreementResponseDTO } from '@application/dtos/agreement/res/agreement-response.dto';
import { GetMyAgreementsDTO } from '@application/dtos/agreement/agreement.dto';
import { IAgreementRepository } from '@core/interfaces/repository/agreement-repository.interface';
import { IUserRepository } from '@core/interfaces/repository/user-repository.interface';
import { AgreementResponseMapper } from '@application/mappers/agreement/agreement-response.mapper';
import { UserRole } from '@shared/enums/user-role.enum';
import { inject, injectable } from 'tsyringe';
import { TokenTypes } from '@shared/types/tokens';
import { UnauthorizedRoleAccessError } from '@shared/errors/agreement-errors';

@injectable()
export class GetMyAgreementsUseCase implements IGetMyAgreementsUseCase {
    constructor(
        @inject(TokenTypes.IAgreementRepository) private _agreementRepository: IAgreementRepository,
        @inject(TokenTypes.IUserRepository) private _userRepository: IUserRepository,
    ) {}

    async execute(dto: GetMyAgreementsDTO): Promise<AgreementResponseDTO[]> {
        let agreements = [];
        if (dto.role === UserRole.TENANT) {
            agreements = await this._agreementRepository.findByTenantId(dto.userId, dto.status);
        } else if (dto.role === UserRole.OWNER) {
            agreements = await this._agreementRepository.findByOwnerId(dto.userId, dto.status);
        } else {
            throw new UnauthorizedRoleAccessError();
        }

        const responses = AgreementResponseMapper.toListResponse(agreements);

        const userIds = new Set<string>();
        agreements.forEach((a) => {
            userIds.add(a.ownerId);
            userIds.add(a.tenantId);
        });

        const users = await Promise.all(
            Array.from(userIds).map((id) => this._userRepository.findById(id)),
        );

        const userMap = new Map(users.filter((u) => u).map((u) => [u!.id, u!]));

        responses.forEach((response) => {
            const owner = userMap.get(response.ownerId);
            const tenant = userMap.get(response.tenantId);

            if (owner) {
                response.owner = {
                    id: owner.id,
                    fullname: owner.fullname,
                    email: owner.email,
                    phone: owner.phone || undefined,
                    avatarUrl: owner.avatarUrl || undefined,
                };
            }

            if (tenant) {
                response.tenant = {
                    id: tenant.id,
                    fullname: tenant.fullname,
                    email: tenant.email,
                    phone: tenant.phone || undefined,
                    avatarUrl: tenant.avatarUrl || undefined,
                };
            }
        });

        return responses;
    }
}
