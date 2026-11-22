import {
    IUnlistPropertyUseCase,
    IDeletePropertyUseCase,
    IRelistPropertyUseCase,
} from '@application/interfaces/property/property.usecase.interface';
import { IPropertyRepository } from '@core/interfaces/repository/property-repository.interface';
import { ICreateNotificationUsecase } from '@application/interfaces/notification/notification.usecase.interface';
import { TokenTypes } from '@shared/types/tokens';
import { NotificationType } from '@shared/enums/notification-type.enum';
import { inject, injectable } from 'tsyringe';
import { PropertyNotFoundError } from '@shared/errors/property-errors';
import { BadRequestError } from '@shared/errors/common-errors';
import { PropertyStatus } from '@shared/enums/property-type-status.enum';

@injectable()
export class UnlistPropertyUseCase implements IUnlistPropertyUseCase {
    constructor(
        @inject(TokenTypes.IPropertyRepository)
        private readonly _propertyRepo: IPropertyRepository,
        @inject(TokenTypes.ICreateNotificationUseCase)
        private readonly _createNotification: ICreateNotificationUsecase,
    ) {}

    async execute(id: string): Promise<void> {
        const property = await this._propertyRepo.findById(id);
        if (!property) throw new PropertyNotFoundError();

        if (property.status !== PropertyStatus.ACTIVE) {
            throw new BadRequestError('Only active properties can be unlisted');
        }

        await this._propertyRepo.unlist(id);

        await this._createNotification.execute({
            userId: property.ownerId,
            notificationType: NotificationType.PROPERTY_UNLISTED,
            title: 'Property Unlisted',
            message: `Your property "${property.title}" has been unlisted.`,
            actionUrl: `/properties/${property.id}`,
            relatedEntityType: 'Property',
            relatedEntityId: property.id,
            notificationData: { propertyId: property.id, title: property.title },
        });
    }
}

@injectable()
export class DeletePropertyUseCase implements IDeletePropertyUseCase {
    constructor(
        @inject(TokenTypes.IPropertyRepository)
        private readonly _propertyRepo: IPropertyRepository,
    ) {}

    async execute(id: string): Promise<void> {
        await this._propertyRepo.delete(id);
    }
}

@injectable()
export class RelistPropertyUseCase implements IRelistPropertyUseCase {
    constructor(
        @inject(TokenTypes.IPropertyRepository)
        private readonly _propertyRepo: IPropertyRepository,
    ) {}

    async execute(id: string): Promise<void> {
        const property = await this._propertyRepo.findById(id);
        if (!property) throw new PropertyNotFoundError();

        if (property.status !== PropertyStatus.UNLISTED) {
            throw new BadRequestError('Only unlisted properties can be relisted');
        }

        await this._propertyRepo.relist(id);
    }
}
