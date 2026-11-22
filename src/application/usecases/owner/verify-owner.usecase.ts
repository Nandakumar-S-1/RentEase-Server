import { IVerifyOwnerUseCase } from 'application/interfaces/admin/verify-owner.usecase.interface';
import { OwnerVerificationMapper } from 'application/mappers/profile/owner-verification.mapper';
import { IOwnerProfileRepository } from '@core/interfaces/repository/owner-repository.interface';
import { Owner_Verification_Status } from 'shared/enums/owner-verification-status.enum';
import { OwnerProfileNotFoundError } from 'shared/errors/owner-errors';
import { TokenTypes } from 'shared/types/tokens';
import { ICreateNotificationUsecase } from '@application/interfaces/notification/notification.usecase.interface';
import { NotificationType } from '@shared/enums/notification-type.enum';
import { inject, injectable } from 'tsyringe';

@injectable()
export class VerifyOwnerUseCase implements IVerifyOwnerUseCase {
    constructor(
        @inject(TokenTypes.IOwnerProfileRepository)
        private readonly _ownerRepository: IOwnerProfileRepository,
        @inject(TokenTypes.ICreateNotificationUseCase)
        private readonly _createNotification: ICreateNotificationUsecase,
    ) {}
    async verifyOwner(ownerId: string) {
        const ownerProfile = await this._ownerRepository.findByUserId(ownerId);
        if (!ownerProfile) {
            throw new OwnerProfileNotFoundError();
        }
        ownerProfile.approve(); //entity method to handle validation
        const updated = await this._ownerRepository.updateVerificationStatus(
            ownerId,
            Owner_Verification_Status.VERIFIED,
        );

        await this._createNotification.execute({
            userId: ownerId,
            notificationType: NotificationType.OWNER_VERIFICATION_APPROVED,
            title: 'Landlord Verification Approved',
            message:
                'Your landlord verification status has been approved! You can now list properties.',
            actionUrl: '/profile',
            relatedEntityType: 'OwnerProfile',
            relatedEntityId: ownerProfile.id,
        });

        return OwnerVerificationMapper.toResponse(updated);
    }
    async rejectOwner(ownerId: string, reason: string) {
        const ownerProfile = await this._ownerRepository.findByUserId(ownerId);
        if (!ownerProfile) {
            throw new OwnerProfileNotFoundError();
        }
        ownerProfile.reject(reason);
        const updated = await this._ownerRepository.updateVerificationStatus(
            ownerId,
            Owner_Verification_Status.REJECTED,
            reason,
        );

        await this._createNotification.execute({
            userId: ownerId,
            notificationType: NotificationType.OWNER_VERIFICATION_REJECTED,
            title: 'Landlord Verification Rejected',
            message: `Your landlord verification status was rejected. Reason: ${reason}`,
            actionUrl: '/profile',
            relatedEntityType: 'OwnerProfile',
            relatedEntityId: ownerProfile.id,
            notificationData: { reason },
        });

        return OwnerVerificationMapper.toResponse(updated);
    }
    async getPendingOwners() {
        const pending = await this._ownerRepository.findAllPending();
        return OwnerVerificationMapper.toPendingListResponse(pending);
    }

    async getOwnerVerificationDetails(ownerId: string) {
        const ownerProfile = await this._ownerRepository.findByUserId(ownerId);
        if (!ownerProfile) {
            throw new OwnerProfileNotFoundError();
        }
        return OwnerVerificationMapper.toResponse(ownerProfile);
    }
}
