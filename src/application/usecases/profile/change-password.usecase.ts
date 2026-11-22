import { inject, injectable } from 'tsyringe';
import { IChangePasswordUseCase } from 'application/interfaces/profile/profile.usecase.interface';
import { IUserRepository } from '@core/interfaces/repository/user-repository.interface';
import { IHashService } from 'application/interfaces/services/hash.service.interface';
import { ChangePasswordDTO } from 'application/dtos/profile/change-password-request.dto';
import { TokenTypes } from 'shared/types/tokens';
import { NotFoundError, BadRequestError } from 'shared/errors/common-errors';

@injectable()
export class ChangePasswordUseCase implements IChangePasswordUseCase {
    constructor(
        @inject(TokenTypes.IUserRepository)
        private readonly _userRepository: IUserRepository,
        @inject(TokenTypes.IHashService)
        private readonly _hashService: IHashService,
    ) {}

    async execute(userId: string, dto: ChangePasswordDTO): Promise<void> {
        const user = await this._userRepository.findById(userId);

        if (!user) {
            throw new NotFoundError('User not found');
        }

        const isCurrentPasswordValid = await this._hashService.compare(
            dto.currentPassword,
            user.password,
        );

        if (!isCurrentPasswordValid) {
            throw new BadRequestError('Invalid current password');
        }

        const newPasswordHash = await this._hashService.hash(dto.newPassword);

        user.setPassword(newPasswordHash);

        await this._userRepository.update(userId, user);
    }
}
