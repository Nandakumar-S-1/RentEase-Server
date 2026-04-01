import { IGetProfileUseCase } from 'application/interfaces/profile/profile.usecase.interface';
import { IUserRepository } from 'core/interfaces/user-repository.interface';
import { IOwnerProfileRepository } from 'core/interfaces/owner-repository.interface';
import { ITenantProfileRepository } from 'core/interfaces/tenant-repository.interface';
import { TokenTypes } from 'shared/types/tokens';
import { inject, injectable } from 'tsyringe';

@injectable()
export class GetProfileUseCase implements IGetProfileUseCase {
    constructor(
        @inject(TokenTypes.IUserRepository)
        private readonly _userRepo: IUserRepository,
        @inject(TokenTypes.IOwnerProfileRepository)
        private readonly _ownerRepo: IOwnerProfileRepository,
        @inject(TokenTypes.ITenantProfileRepository)
        private readonly _tenantRepo: ITenantProfileRepository,
    ) { }

    async execute(userId: string, role: string) {
        const user = await this._userRepo.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // base user info shared by both roles
        const profileData: Record<string, unknown> = {
            fullName: user.fullname,
            email: user.email,
            phone: user.phone,
            role: user.role,
            createdAt: user.createdAt,
        };

        if (role === 'OWNER') {
            const ownerProfile = await this._ownerRepo.findByUserId(userId);
            if (ownerProfile) {
                profileData.bio = ownerProfile.bio;
                profileData.occupation = ownerProfile.occupation;
                profileData.verificationStatus = ownerProfile.verificationStatus;
                profileData.documentType = ownerProfile.documentType;
                profileData.documentUrl = ownerProfile.documentUrl;
                profileData.verifiedAt = ownerProfile.verifiedAt;
            }
        }

        if (role === 'TENANT') {
            const tenantProfile = await this._tenantRepo.findByUserId(userId);
            if (tenantProfile) {
                profileData.bio = tenantProfile.bio;
                profileData.occupation = tenantProfile.occupation;
            }
        }

        return profileData;
    }
}
