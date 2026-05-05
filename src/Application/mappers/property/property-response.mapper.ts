import { CreatePropertyResponseDTO } from '@application/dtos/property/res/create-property-response.dto';
import { PropertyEntity } from '@core/entities/property.entity';

export class PropertyResponseMapper {
    static toCreateResponse(entity: PropertyEntity): CreatePropertyResponseDTO {
        return {
            id: entity.id,
            title: entity.title,
            status: entity.status,
        };
    }

    static toGeneralResponse(entity: PropertyEntity) {
        return {
            id: entity.id,
            ownerId: entity.ownerId,
            title: entity.title,
            description: entity.description,
            propertyType: entity.propertyType,
            locationCity: entity.locationCity,
            locationDistrict: entity.locationDistrict,
            locationPincode: entity.locationPincode,
            fullAddress: entity.fullAddress,
            latitude: entity.latitude,
            longitude: entity.longitude,
            nearbyLandmarks: entity.nearbyLandmarks,
            areaSqft: entity.areaSqft,

            monthlyRent: entity.monthlyRent,
            depositAmount: entity.depositAmount,
            maintenanceCharges: entity.maintenanceCharges,
            maintenanceIncluded: entity.maintenanceIncluded,

            status: entity.status,
            photos: entity.photos,
            primaryPhotoIndex: entity.primaryPhotoIndex,
            createdAt: entity.createdAt,
            viewsCount: entity.viewsCount,
            wishlistCount: entity.wishlistCount,
            rejectionReason: entity.rejectionReason,
            approvedAt: entity.approvedAt,

            // Flattened details
            bhk: entity.details?.bhk,
            bathrooms: entity.details?.bathrooms,
            floorNumber: entity.details?.floorNumber,
            totalFloors: entity.details?.totalFloors,
            propertyAge: entity.details?.propertyAge,
            facingDirection: entity.details?.facingDirection,
            furnishingStatus: entity.details?.furnishingStatus,
            amenities: entity.details?.amenities,
            preferredTenantType: entity.details?.preferredTenantType,
            petsAllowed: entity.details?.petsAllowed,
            smokingAllowed: entity.details?.smokingAllowed,
            maximumOccupants: entity.details?.maximumOccupants,
            landType: entity.details?.landType,
            isCornerPlot: entity.details?.isCornerPlot,
            roadWidthFeet: entity.details?.roadWidthFeet,
            shopType: entity.details?.shopType,
            hasParking: entity.details?.hasParking,

            ...(entity.details && {
                details: {
                    id: entity.details.id,
                    propertyId: entity.details.propertyId,
                    bhk: entity.details.bhk,
                    bathrooms: entity.details.bathrooms,
                    floorNumber: entity.details.floorNumber,
                    totalFloors: entity.details.totalFloors,
                    propertyAge: entity.details.propertyAge,
                    facingDirection: entity.details.facingDirection,
                    furnishingStatus: entity.details.furnishingStatus,
                    amenities: entity.details.amenities,
                    preferredTenantType: entity.details.preferredTenantType,
                    petsAllowed: entity.details.petsAllowed,
                    smokingAllowed: entity.details.smokingAllowed,
                    maximumOccupants: entity.details.maximumOccupants,
                    landType: entity.details.landType,
                    isCornerPlot: entity.details.isCornerPlot,
                    roadWidthFeet: entity.details.roadWidthFeet,
                    shopType: entity.details.shopType,
                    hasParking: entity.details.hasParking,
                },
            }),
        };
    }
}
