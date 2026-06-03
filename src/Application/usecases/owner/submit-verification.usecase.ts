import { SubmitVerificationDTO } from 'application/dtos/owner/request/owner-verification-request.dto';
import { ISubmitVerificationUseCase } from 'application/interfaces/owner/submit-verification.usecase.interface';
import { OwnerVerificationMapper } from 'application/mappers/profile/owner-verification.mapper';
import { IOwnerProfileRepository } from '@core/interfaces/repository/owner-repository.interface';
import { IUserRepository } from '@core/interfaces/repository/user-repository.interface';
import { ICreateNotificationUsecase } from '@application/interfaces/notification/notification.usecase.interface';
import { Owner_Verification_Status } from 'shared/enums/owner-verification-status.enum';
import { TokenTypes } from 'shared/types/tokens';
import { UserRole } from '@shared/enums/user-role.enum';
import { NotificationType } from '@shared/enums/notification-type.enum';
import {
    DocumentAlreadySubmittedError,
    OwnerProfileNotFoundError,
} from 'shared/errors/owner-errors';
import { inject, injectable } from 'tsyringe';

@injectable()
export class SubmitVerificationUseCase implements ISubmitVerificationUseCase {
    constructor(
        @inject(TokenTypes.IOwnerProfileRepository)
        private readonly _ownerRepository: IOwnerProfileRepository,
        @inject(TokenTypes.IUserRepository)
        private readonly _userRepository: IUserRepository,
        @inject(TokenTypes.ICreateNotificationUseCase)
        private readonly _createNotification: ICreateNotificationUsecase,
    ) {}

    async execute(dto: SubmitVerificationDTO) {
        const ownerProfile = await this._ownerRepository.findByUserId(dto.ownerId);
        if (!ownerProfile) {
            throw new OwnerProfileNotFoundError();
        }
        if (ownerProfile.verificationStatus === Owner_Verification_Status.SUBMITTED) {
            throw new DocumentAlreadySubmittedError();
        }
        ownerProfile.documentSubmit(dto.documentType, dto.documentUrl);
        const updated = await this._ownerRepository.save(ownerProfile);

        try {
            const allUsers = await this._userRepository.findAll();
            const admins = allUsers.filter((u) => u.role === UserRole.ADMIN);
            for (const admin of admins) {
                await this._createNotification.execute({
                    userId: admin.id,
                    notificationType: NotificationType.OWNER_VERIFICATION_SUBMITTED,
                    title: 'New Owner Verification Request',
                    message: 'Owner verification documents have been submitted. Please review.',
                    actionUrl: `/admin/verifications/${ownerProfile.userId}`,
                    relatedEntityType: 'OwnerProfile',
                    relatedEntityId: ownerProfile.id,
                    notificationData: { ownerId: ownerProfile.userId, profileId: ownerProfile.id }
                });
            }
        } catch (error) {
            console.error('Failed to send admin notifications for owner verification submission:', error);
        }

        return OwnerVerificationMapper.toResponse(updated);
    }
}
