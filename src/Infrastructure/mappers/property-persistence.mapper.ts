import { PropertyEntity } from '@core/entities/property.entity';
import { PropertyDetailsEntity } from '@core/entities/property-details.entity';
import { PropertyTypeData } from '@core/types/property.types';
import { User, Property, PropertyDetails, PropertyVerificationStatus } from '@prisma/client';
import { PropertyStatus, PropertyType } from '@shared/enums/property-type-status.enum';

type PrismaPropertyWithDetails = Property & {
    details?: PropertyDetails | null;
    owner?: User | null;
};
export class PropertyPersistenceMapper {
    // db to domain
    static toEntity(raw: PrismaPropertyWithDetails): PropertyEntity {
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

            status: PropertyPersistenceMapper._mapStatus(raw.status),
            isFeatured: raw.isFeatured ?? false,
            availableFrom: raw.availableFrom ?? undefined,

            viewsCount: raw.viewsCount ?? 0,
            inquiryCount: raw.inquiryCount ?? 0,
            wishlistCount: raw.wishlistCount ?? 0,

            approvedBy: raw.approvedBy ?? undefined,
            approvedAt: raw.approvedAt ?? undefined,
            rejectionReason: raw.rejectionReason ?? undefined,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,

            details: raw.details
                ? {
                      id: raw.details.id,
                      propertyId: raw.details.propertyId,
                      bhk: raw.details.bhk ?? undefined,
                      bathrooms: raw.details.bathrooms ?? undefined,
                      floorNumber: raw.details.floorNumber ?? undefined,
                      totalFloors: raw.details.totalFloors ?? undefined,
                      propertyAge: raw.details.propertyAge ?? undefined,
                      facingDirection: raw.details.facingDirection ?? undefined,
                      furnishingStatus: raw.details.furnishingStatus ?? undefined,
                      landType: raw.details.landType ?? undefined,
                      isCornerPlot: raw.details.isCornerPlot ?? undefined,
                      roadWidthFeet: raw.details.roadWidthFeet ?? undefined,
                      shopType: raw.details.shoptype ?? undefined,
                      hasParking: raw.details.hasParking ?? undefined,
                      amenities: raw.details.amenities ?? [],
                      preferredTenantType: raw.details.preferredTenantType
                          ? (raw.details.preferredTenantType as string[])
                          : undefined,
                      petsAllowed: raw.details.petsAllowed,
                      smokingAllowed: raw.details.smokingAllowed,
                      maximumOccupants: raw.details.maximumOccupants ?? undefined,
                      createdAt: raw.details.createdAt,
                      updatedAt: raw.details.updatedAt,
                  }
                : undefined,
            owner: raw.owner
                ? {
                      fullName: raw.owner.fullName,
                      email: raw.owner.email,
                      phone: raw.owner.phone,
                  }
                : undefined,
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

    //domain to db for creation
    static toCreatePersistence(entity: PropertyEntity) {
        return {
            ...this._toSharedPersistence(entity),
            ...(entity.details && {
                details: {
                    create: this._mapDetails(entity.details),
                },
            }),
        };
    }

    //domain to db for updates
    static toUpdatePersistence(entity: PropertyEntity) {
        return {
            ...this._toSharedPersistence(entity),
            ...(entity.details && {
                details: {
                    upsert: {
                        create: this._mapDetails(entity.details),
                        update: this._mapDetails(entity.details),
                    },
                },
            }),
        };
    }

    private static _toSharedPersistence(entity: PropertyEntity) {
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

            monthlyRent: entity.monthlyRent,
            depositAmount: entity.depositAmount,

            areaSqrt: entity.areaSqft,
            latitude: entity.latitude,
            longitude: entity.longitude,
            nearbyLandmarks: entity.nearbyLandmarks,
            maintenanceCharges: entity.maintenanceCharges,
            maintenanceIncluded: entity.maintenanceIncluded,

            photos: entity.photos,
            mainPhotoIndex: entity.primaryPhotoIndex,
            videoTourUrl: entity.videoToursUrl,

            status: PropertyPersistenceMapper._mapStatusToPrisma(entity.status),
            approvedBy: entity.approvedBy,
            approvedAt: entity.approvedAt,
            rejectionReason: entity.rejectionReason,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }

    private static _mapDetails(details: PropertyDetailsEntity) {
        return {
            bhk: details.bhk ?? undefined,
            bathrooms: details.bathrooms ?? undefined,
            floorNumber: details.floorNumber ?? undefined,
            totalFloors: details.totalFloors ?? undefined,
            propertyAge: details.propertyAge ?? undefined,
            facingDirection: details.facingDirection ?? undefined,
            furnishingStatus: details.furnishingStatus ?? undefined,
            amenities: details.amenities ?? [],
            landType: details.landType ?? undefined,
            isCornerPlot: details.isCornerPlot ?? undefined,
            roadWidthFeet: details.roadWidthFeet ?? undefined,
            shoptype: details.shopType ?? undefined,
            hasParking: details.hasParking ?? undefined,
            petsAllowed: details.petsAllowed ?? false,
            smokingAllowed: details.smokingAllowed ?? false,
            maximumOccupants: details.maximumOccupants ?? undefined,
            preferredTenantType: details.preferredTenantType
                ? JSON.parse(JSON.stringify(details.preferredTenantType))
                : undefined,
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
            case PropertyStatus.APPROVED:
                return 'ACTIVE';
            default:
                throw new Error('Unknown property status');
        }
    }
}
