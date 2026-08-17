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

    maintenanceCharges?: number;
    maintenanceIncluded?: boolean;

    specificDetails?: Record<string, any>;
    amenities?: string[]; // Assuming frontend still sends an array of UUIDs or strings
    preferredTenantType?: string[];

    petsAllowed?: boolean;
    smokingAllowed?: boolean;
    maximumOccupants?: number | null;
}

export interface UploadPropertyPhotosDTO {
    propertyId: string;
    files: Express.Multer.File[];
}
