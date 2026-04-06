import { PropertyEntity } from "@core/entities/property.entity";
import { PropertyTypeData } from "@core/types/property.types";
import { Property } from "@prisma/client"; 
import { PropertyStatus, PropertyType } from "@shared/enums/property-type-status.enum";
export class PropertyPersistenceMapper {
    static toEntity(raw:Property):PropertyEntity{
        const data :PropertyTypeData={
            id:raw.id,
            ownerId:raw.ownerId,
            title:raw.title,
            description:raw.description,
            propertyType:raw.propertyType as PropertyType,

            locationDistrict:raw.locationDistrict,
            locationCity:raw.locationCity,
            locationPincode:raw.locationPincode,
            fullAddress:raw.fullAddress,

            monthlyRent:Number(raw.monthlyRent),
            depositAmount:Number(raw.depositAmount),
            photos:raw.photos,
            status:raw.status as PropertyStatus,
            
            createdAt:raw.createdAt,
            updatedAt:raw.updatedAt

        }
        return PropertyEntity.create(data)
    }

    static toPersistence(entity:PropertyEntity){
        return{
            id:entity.id,
            ownerId:entity.ownerId,
            title:entity['_title'],
            description:entity['_description'],
            propertyType:entity['_propertyType'],
            locationDistrict:entity['_locationDistrict'],
            locationCity:entity['_locationCity'],
            locationPincode:entity['_locationPincode'],
            fullAddress:entity['_fullAddress'],

            monthlyRent:entity['_monthlyRent'],
            depositAmount:entity['_depositAmount'],
            photos:entity.photos,
            status:entity.status
        }
    }
}