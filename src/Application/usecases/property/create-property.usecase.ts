import { CreatePropertyDTO } from '@application/dtos/property/property.dto';
import { CreatePropertyResponseDTO } from '@application/dtos/property/res/create-property-response.dto';
import { ICreatePropertyUseCase } from '@application/interfaces/property/property.usecase.interface';
import { PropertyResponseMapper } from '@application/mappers/property/property-response.mapper';
import { PropertyMapper } from '@application/mappers/property/property.mapper';
import { IPropertyRepository } from '@core/interfaces/repository/property-repository.interface';
import { IUserRepository } from '@core/interfaces/repository/user-repository.interface';
import { ICreateNotificationUsecase } from '@application/interfaces/notification/notification.usecase.interface';
import { TokenTypes } from '@shared/types/tokens';
import { UserRole } from '@shared/enums/user-role.enum';
import { NotificationType } from '@shared/enums/notification-type.enum';
import { inject, injectable } from 'tsyringe';
import { logger } from '@shared/log/logger';

@injectable()
export class CreatePropertyUseCase implements ICreatePropertyUseCase {
    constructor(
        @inject(TokenTypes.IPropertyRepository)
        private readonly _propertyRepo: IPropertyRepository,
        @inject(TokenTypes.IUserRepository)
        private readonly _userRepository: IUserRepository,
        @inject(TokenTypes.ICreateNotificationUseCase)
        private readonly _createNotification: ICreateNotificationUsecase,
    ) {}
    async execute(dto: CreatePropertyDTO): Promise<CreatePropertyResponseDTO> {
        const entity = PropertyMapper.toEntity(dto);
        const createdProperty = await this._propertyRepo.create(entity);

        Promise.resolve().then(async () => {
            try {
                const allUsers = await this._userRepository.findAll();
                const admins = allUsers.filter((u) => u.role === UserRole.ADMIN);
                for (const admin of admins) {
                    await this._createNotification.execute({
                        userId: admin.id,
                        notificationType: NotificationType.PROPERTY_SUBMITTED,
                        title: 'New Property Pending Approval',
                        message: `A new property listing "${createdProperty.title}" has been submitted and is pending verification.`,
                        actionUrl: `/admin/properties/${createdProperty.id}`,
                        relatedEntityType: 'Property',
                        relatedEntityId: createdProperty.id,
                        notificationData: {
                            propertyId: createdProperty.id,
                            title: createdProperty.title,
                            ownerId: createdProperty.ownerId,
                        },
                    });
                }
            } catch (error) {
                logger.error(
                    { err: error },
                    'Failed to send admin notifications for property creation',
                );
            }
        });

        return PropertyResponseMapper.toCreateResponse(createdProperty);
    }
}
