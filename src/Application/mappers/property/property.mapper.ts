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
        });
    }
}
