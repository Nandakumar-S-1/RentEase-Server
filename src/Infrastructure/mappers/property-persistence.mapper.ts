import { PropertyEntity } from '@core/entities/property.entity';
import { PropertyTypeData } from '@core/types/property.types';
import { Property, PropertyVerificationStatus } from '@prisma/client';
import { PropertyStatus, PropertyType } from '@shared/enums/property-type-status.enum';
export class PropertyPersistenceMapper {
    // db to domain
    static toEntity(raw: Property): PropertyEntity {
        const data: PropertyTypeData = {
            id: raw.id,
            ownerId: raw.ownerId,
            title: raw.title,
            description: raw.description,
            propertyType: raw.propertyType as PropertyType,

            areaSqft: raw.areaSqrt ?? undefined,
            locationDistrict: raw.locationDistrict,
            locationCity: raw.locationCity,
            locationPincode: raw.locationPincode,
            fullAddress: raw.fullAddress,

            latitude: raw.latitude ? Number(raw.latitude) : undefined,
            longitude: raw.longitude ? Number(raw.longitude) : undefined,
            nearbyLandmarks: raw.nearbyLandmarks ?? undefined,

            monthlyRent: raw.monthlyRent.toNumber(),
            depositAmount: raw.depositAmount.toNumber(),
            maintenanceCharges: raw.maintenanceCharges?.toNumber() ?? 0,
            maintenanceIncluded: raw.maintenanceIncluded ?? true,

            photos: raw.photos,
            primaryPhotoIndex: raw.mainPhotoIndex ?? 0,
            videoTourUrl: raw.videoTourUrl ?? undefined,

            status: this._mapStatus(raw.status),
            isFeatured: raw.isFeatured ?? false,
            availableFrom: raw.availableFrom ?? undefined,

            viewsCount: raw.viewsCount ?? 0,
            inquiryCount: raw.inquiryCount ?? 0,
            wishlistCount: raw.wishlistCount ?? 0,

            approvedBy: raw.approvedBy ?? undefined,
            approvedAt: raw.approvedAt ?? undefined,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        };
        return PropertyEntity.create(data);
    }

    private static _mapStatus(status: PropertyVerificationStatus): PropertyStatus {
        switch (status) {
            case 'PENDING_APPROVAL':
                return PropertyStatus.PENDING_APPROVAL;
            case 'ACTIVE':
                return PropertyStatus.ACTIVE;
            case 'RENTED':
                return PropertyStatus.RENTED;
            case 'UNLISTED':
                return PropertyStatus.UNLISTED;
            case 'REJECTED':
                return PropertyStatus.REJECTED;
            default:
                throw new Error('Unknown property status');
        }
    }

    //domain to db
    static toPersistence(entity: PropertyEntity) {
        return {
            id: entity.id,
            ownerId: entity.ownerId,
            title: entity.title,
            description: entity.description,
            propertyType: entity.propertyType,
            locationDistrict: entity.locationDistrict,
            locationCity: entity.locationCity,
            locationPincode: entity.locationPincode,
            fullAddress: entity.fullAddress,

            monthlyRent: entity.monthleyRent,
            depositAmount: entity.depositAmount,

            maintenanceCharges: entity.maintenanceCharges,
            maintenanceIncluded: entity.maintenanceIncluded,

            photos: entity.photos,
            mainPhotoIndex: entity.primaryPhotoIndex,
            videoTourUrl: entity.videoToursUrl,

            status: this._mapStatusToPrisma(entity.status),
            approvedBy: entity.approvedBy,
            approvedAt: entity.approvedAt,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }

    private static _mapStatusToPrisma(status: PropertyStatus): PropertyVerificationStatus {
        switch (status) {
            case PropertyStatus.PENDING_APPROVAL:
                return 'PENDING_APPROVAL';
            case PropertyStatus.ACTIVE:
                return 'ACTIVE';
            case PropertyStatus.RENTED:
                return 'RENTED';
            case PropertyStatus.UNLISTED:
                return 'UNLISTED';
            case PropertyStatus.REJECTED:
                return 'REJECTED';
            default:
                throw new Error('Unknown property status');
        }
    }
}
