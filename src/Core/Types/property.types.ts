import { PropertyStatus, PropertyType } from '@shared/enums/property-type-status.enum';
import { PropertyDetailsTypeData } from './PropertyDetailsTypeData';

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
    maintenanceIncluded: boolean;

    photos: string[];
    primaryPhotoIndex: number;
    videoTourUrl?: string | null;

    status?: PropertyStatus | null;
    isFeatured?: boolean | null;
    availableFrom?: Date | null;

    viewsCount?: number | null;
    inquiryCount?: number | null;
    wishlistCount?: number | null;

    approvedBy?: string | null;
    approvedAt?: Date | null;
    rejectionReason?: string | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;

    details?: PropertyDetailsTypeData;
};
