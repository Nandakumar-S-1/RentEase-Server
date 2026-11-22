export type PropertyDetailsTypeData = {
    id: string;
    propertyId: string;

    specificDetails?: Record<string, any> | null;

    preferredTenantType?: string[] | null;
    petsAllowed?: boolean | null;
    smokingAllowed?: boolean | null;
    maximumOccupants?: number | null;
    amenities?: any[];

    createdAt?: Date;
    updatedAt?: Date;
};
