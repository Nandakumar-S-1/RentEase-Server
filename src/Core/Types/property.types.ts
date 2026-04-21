import { PropertyStatus, PropertyType } from '@shared/enums/property-type-status.enum';

export type PropertyTypeData = {
    id: string;
    ownerId: string;
    title: string;
    description: string;
    propertyType: PropertyType;

    areaSqft?: number | null;
    locationDistrict: string;
    locationCity: string;
    locationPincode: string;
    fullAddress: string;

    latitude?: number | null;
    longitude?: number | null;
    nearbyLandmarks?: string | null;

    monthlyRent: number;
    depositAmount: number;
    maintenanceCharges?: number;
    maintenanceIncluded?: boolean;

    photos?: string[];
    primaryPhotoIndex?: number;
    videoTourUrl?: string;

    status?: PropertyStatus;
    isFeatured?: boolean;
    availableFrom?: Date;

    viewsCount?: number;
    inquiryCount?: number;
    wishlistCount?: number;

    approvedBy?: string;
    approvedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
};
