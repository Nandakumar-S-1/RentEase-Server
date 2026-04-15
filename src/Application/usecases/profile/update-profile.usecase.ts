import { UpdateProfileDTO } from 'application/dtos/profile/update-profile.dto';
import { IUpdateProfileUseCase } from 'application/interfaces/profile/profile.usecase.interface';
import { IUserRepository } from '@core/interfaces/repository/user-repository.interface';
import { IOwnerProfileRepository } from '@core/interfaces/repository/owner-repository.interface';
import { ITenantProfileRepository } from '@core/interfaces/repository/tenant-repository.interface';
import { UserEntity } from 'core/entities/user.entity';
import { TokenTypes } from 'shared/types/tokens';
import { inject, injectable } from 'tsyringe';
import { logger } from 'shared/log/logger';

@injectable()
export class UpdateProfileUseCase implements IUpdateProfileUseCase {
    constructor(
        @inject(TokenTypes.IUserRepository)
        private readonly _userRepo: IUserRepository,
        @inject(TokenTypes.IOwnerProfileRepository)
        private readonly _ownerRepo: IOwnerProfileRepository,
        @inject(TokenTypes.ITenantProfileRepository)
        private readonly _tenantRepo: ITenantProfileRepository,
    ) {}

    async execute(dto: UpdateProfileDTO) {
        const user = await this._userRepo.findById(dto.userId);
        if (!user) {
            logger.warn(`Profile update failed: User ${dto.userId} not found`);
            throw new Error('User not found');
        }

        logger.info(`Updating profile for user ${dto.userId} (${dto.role})`);

        // rebuild user entity with updated fields for the repo update call
        const updatedUserData = UserEntity.create({
            id: user.id,
            email: user.email,
            fullname: dto.fullName ?? user.fullname,
            passwordHash: user.password,
            phone: dto.phone ?? user.phone,
            role: user.role,
            isActive: user.isActive,
            isSuspended: user.isSuspended,
            isEmailVerified: user.isEmailVerified,
            avatarUrl: dto.avatarUrl ?? user.avatarUrl,
            createdAt: user.createdAt,
        });

        const updatedUser = await this._userRepo.update(dto.userId, updatedUserData);

        // update role specific profile fields
        if (dto.role === 'OWNER') {
            const ownerProfile = await this._ownerRepo.findByUserId(dto.userId);
            if (ownerProfile) {
                if (dto.bio !== undefined) ownerProfile.updateBio(dto.bio ?? null);
                if (dto.occupation !== undefined) ownerProfile.updateOccupation(dto.occupation ?? null);
                await this._ownerRepo.save(ownerProfile);
            }
        }

        if (dto.role === 'TENANT') {
            const tenantProfile = await this._tenantRepo.findByUserId(dto.userId);
            if (tenantProfile) {
                if (dto.bio !== undefined) tenantProfile.updateBio(dto.bio ?? null);
                if (dto.occupation !== undefined) tenantProfile.updateOccupation(dto.occupation ?? null);
                await this._tenantRepo.save(tenantProfile);
            }
        }

        return {
            fullName: updatedUser.fullname,
            email: updatedUser.email,
            phone: updatedUser.phone,
            role: updatedUser.role,
            avatarUrl: updatedUser.avatarUrl,
        };
    }
}
