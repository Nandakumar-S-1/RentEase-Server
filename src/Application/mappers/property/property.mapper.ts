import { CreatePropertyDTO } from '@application/dtos/property/property.dto';
import { PropertyEntity } from '@core/entities/property.entity';
import { PropertyType } from '@shared/enums/property-type-status.enum';

// dto too entity
export class PropertyMapper {
    static toEntity(dto: CreatePropertyDTO): PropertyEntity {
        return PropertyEntity.create({
            id: crypto.randomUUID(),
            ownerId: dto.ownerId,
            title: dto.title,
            description: dto.description,
            propertyType: dto.propertyType as PropertyType,

            locationDistrict: dto.locationDistrict,
            locationCity: dto.locationCity,
            locationPincode: dto.locationPinCode,
            fullAddress: dto.fullAddress,
            monthlyRent: dto.monthlyRent,
            depositAmount: dto.depositAmount,

            photos: dto.photos ?? [],
            primaryPhotoIndex: dto.primaryPhotoIndex ?? 0,

            areaSqft: dto.areaSqft,
            latitude: dto.latitude,
            longitude: dto.longitude,
            nearbyLandmarks: dto.nearbyLandmarks,

            maintenanceCharges: dto.maintenanceCharges ?? 0,
            maintenanceIncluded: dto.maintenanceIncluded ?? true,

            details: {
                id: crypto.randomUUID(),
                propertyId: '',
                bhk: dto.bhk ?? undefined,
                bathrooms: dto.bathrooms ?? undefined,
                floorNumber: dto.floorNumber ?? undefined,
                totalFloors: dto.totalFloors ?? undefined,
                propertyAge: dto.propertyAge ?? undefined,
                facingDirection: dto.facingDirection ?? undefined,
                furnishingStatus: dto.furnishingStatus ?? undefined,
                amenities: dto.amenities ?? [],
                preferredTenantType: dto.preferredTenantType ?? [],
            },
        });
    }
}
