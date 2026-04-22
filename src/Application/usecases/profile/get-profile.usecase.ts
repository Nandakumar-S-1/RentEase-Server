import { IGetProfileUseCase } from 'application/interfaces/profile/profile.usecase.interface';
import { IUserRepository } from '@core/interfaces/repository/user-repository.interface';
import { IOwnerProfileRepository } from '@core/interfaces/repository/owner-repository.interface';
import { ITenantProfileRepository } from '@core/interfaces/repository/tenant-repository.interface';
import { IPropertyRepository } from '@core/interfaces/repository/property-repository.interface';
import { TokenTypes } from 'shared/types/tokens';
import { inject, injectable } from 'tsyringe';
import { logger } from 'shared/log/logger';
import { UserRole } from '@shared/enums/user-role.enum';

@injectable()
export class GetProfileUseCase implements IGetProfileUseCase {
    constructor(
        @inject(TokenTypes.IUserRepository)
        private readonly _userRepo: IUserRepository,
        @inject(TokenTypes.IOwnerProfileRepository)
        private readonly _ownerRepo: IOwnerProfileRepository,
        @inject(TokenTypes.ITenantProfileRepository)
        private readonly _tenantRepo: ITenantProfileRepository,
        @inject(TokenTypes.IPropertyRepository)
        private readonly _propertyRepo: IPropertyRepository,
    ) { }

    async execute(userId: string, role: string) {
        const user = await this._userRepo.findById(userId);
        if (!user) {
            logger.warn(`profile fetching failed: user ${userId} not found`);
            throw new Error('User not found');
        }

        const profileData: Record<string, unknown> = {
            fullName: user.fullname,
            email: user.email,
            phone: user.phone,
            role: user.role,
            avatarUrl: user.avatarUrl,
            createdAt: user.createdAt,
        };

        if (role === UserRole.OWNER) {
            const ownerProfile = await this._ownerRepo.findByUserId(userId);
            if (ownerProfile) {
                profileData.bio = ownerProfile.bio;
                profileData.occupation = ownerProfile.occupation;
                profileData.verificationStatus = ownerProfile.verificationStatus;
                profileData.documentType = ownerProfile.documentType;
                profileData.documentUrl = ownerProfile.documentUrl;
                profileData.verifiedAt = ownerProfile.verifiedAt;

                const listingsCount = await this._propertyRepo.countByOwnerId(userId);
                profileData.listingsCount = listingsCount;
            }
        }

        if (role === UserRole.TENANT) {
            const tenantProfile = await this._tenantRepo.findByUserId(userId);
            if (tenantProfile) {
                profileData.bio = tenantProfile.bio;
                profileData.occupation = tenantProfile.occupation;
            }
        }

        return profileData;
    }
}
