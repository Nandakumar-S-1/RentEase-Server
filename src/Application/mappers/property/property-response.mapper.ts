import { CreatePropertyResponseDTO } from "@application/dtos/property/res/create-property-response.dto";
import { PropertyEntity } from "@core/entities/property.entity";

export class PropertyResponseMapper{
    static toCreateResponse(entity:PropertyEntity):CreatePropertyResponseDTO{
        return{
            id:entity.id,
            title:entity.title,
            status:entity.status
        }
    }

    static toGeneralResponse(entity: PropertyEntity) {
        return {
            id: entity.id,
            title: entity.title,
            description: entity.description,
            propertyType: entity.propertyType,
            locationCity: entity.locationCity,
            locationDistrict: entity.locationDistrict,
            monthlyRent: entity.monthleyRent,
            depositAmount: entity.depositAmount,
            status: entity.status,
            photos: entity.photos,
            primaryPhotoIndex: entity.primaryPhotoIndex,
            createdAt: entity.createdAt
        }
    }
}