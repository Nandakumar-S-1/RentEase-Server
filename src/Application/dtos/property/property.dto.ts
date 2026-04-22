export interface CreatePropertyDTO {
    ownerId: string;
    title: string;
    description: string;
    propertyType: string;

    locationDistrict: string;
    locationCity: string;
    locationPinCode: string;
    fullAddress: string;

    monthlyRent: number;
    depositAmount: number;
    photos?: string[];
    primaryPhotoIndex?: number;

    areaSqft?: number | null;
    latitude?: number | null;
    longitude?: number | null;
    nearbyLandmarks?: string | null;

    bhk?: number | null;
    bathrooms?: number | null;
    floorNumber?: string | null;
    totalFloors?: number | null;
    propertyAge?: string | null;
    facingDirection?: string | null;
    furnishingStatus?: string | null;

    maintenanceCharges?: number;
    maintenanceIncluded?: boolean;

    amenities?: string[];
    preferredTenantType?: string[];
}

export interface UploadPropertyPhotosDTO {
    propertyId: string;
    files: Express.Multer.File[];
}
