import { CreatePropertyDTO } from '@application/dtos/property/property.dto';
import { IUpdatePropertyUseCase } from '@application/interfaces/property/property.usecase.interface';
import { PropertyResponseMapper } from '@application/mappers/property/property-response.mapper';
import { IPropertyRepository } from '@core/interfaces/repository/property-repository.interface';
import { IUserRepository } from '@core/interfaces/repository/user-repository.interface';
import { ICreateNotificationUsecase } from '@application/interfaces/notification/notification.usecase.interface';
import { PropertyTypeData } from '@core/types/property.types';
import { PropertyDetailsTypeData } from '@core/types/PropertyDetailsTypeData';
import { PropertyType } from '@shared/enums/property-type-status.enum';
import { PropertyNotFoundError } from '@shared/errors/property-errors';
import { TokenTypes } from '@shared/types/tokens';
import { UserRole } from '@shared/enums/user-role.enum';
import { NotificationType } from '@shared/enums/notification-type.enum';
import { inject, injectable } from 'tsyringe';

@injectable()
export class UpdatePropertyUseCase implements IUpdatePropertyUseCase {
    constructor(
        @inject(TokenTypes.IPropertyRepository)
        private readonly _propertyRepo: IPropertyRepository,
        @inject(TokenTypes.IUserRepository)
        private readonly _userRepository: IUserRepository,
        @inject(TokenTypes.ICreateNotificationUseCase)
        private readonly _createNotification: ICreateNotificationUsecase,
    ) {}

    async execute(id: string, dto: Partial<CreatePropertyDTO>): Promise<PropertyTypeData> {
        const property = await this._propertyRepo.findById(id);

        if (!property) {
            throw new PropertyNotFoundError();
        }

        // Map DTO to Entity structure
        const updateData: Partial<PropertyTypeData> = {
            ...dto,
            propertyType: dto.propertyType as PropertyType | undefined,
            ...((dto.bhk !== undefined ||
                dto.bathrooms !== undefined ||
                dto.floorNumber !== undefined ||
                dto.totalFloors !== undefined ||
                dto.propertyAge !== undefined ||
                dto.facingDirection !== undefined ||
                dto.furnishingStatus !== undefined ||
                dto.amenities !== undefined ||
                dto.preferredTenantType !== undefined ||
                dto.petsAllowed !== undefined ||
                dto.smokingAllowed !== undefined ||
                dto.maximumOccupants !== undefined ||
                dto.landType !== undefined ||
                dto.isCornerPlot !== undefined ||
                dto.roadWidthFeet !== undefined ||
                dto.shopType !== undefined ||
                dto.hasParking !== undefined) && {
                details: {
                    bhk: dto.bhk,
                    bathrooms: dto.bathrooms,
                    floorNumber: dto.floorNumber,
                    totalFloors: dto.totalFloors,
                    propertyAge: dto.propertyAge,
                    facingDirection: dto.facingDirection,
                    furnishingStatus: dto.furnishingStatus,
                    amenities: dto.amenities,
                    preferredTenantType: dto.preferredTenantType,
                    petsAllowed: dto.petsAllowed,
                    smokingAllowed: dto.smokingAllowed,
                    maximumOccupants: dto.maximumOccupants,
                    landType: dto.landType,
                    isCornerPlot: dto.isCornerPlot,
                    roadWidthFeet: dto.roadWidthFeet,
                    shopType: dto.shopType,
                    hasParking: dto.hasParking,
                } as PropertyDetailsTypeData,
            }),
        };

        property.update(updateData);

        const updatedProperty = await this._propertyRepo.update(property);

        try {
            const allUsers = await this._userRepository.findAll();
            const admins = allUsers.filter((u) => u.role === UserRole.ADMIN);
            for (const admin of admins) {
                await this._createNotification.execute({
                    userId: admin.id,
                    notificationType: NotificationType.PROPERTY_SUBMITTED,
                    title: 'Property Update Pending Approval',
                    message: `Property listing "${updatedProperty.title}" has been updated and is pending verification.`,
                    actionUrl: `/admin/properties/${updatedProperty.id}`,
                    relatedEntityType: 'Property',
                    relatedEntityId: updatedProperty.id,
                    notificationData: { propertyId: updatedProperty.id, title: updatedProperty.title, ownerId: updatedProperty.ownerId }
                });
            }
        } catch (error) {
            console.error('Failed to send admin notifications for property update:', error);
        }

        return PropertyResponseMapper.toGeneralResponse(updatedProperty);
    }
}
