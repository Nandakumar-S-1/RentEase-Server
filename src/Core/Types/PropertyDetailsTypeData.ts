export type PropertyDetailsTypeData = {
    id: string;
    propertyId: string;

    // house,flat,PG
    bhk?: number | null;
    bathrooms?: number | null;
    floorNumber?: string | null;
    totalFloors?: number | null;
    propertyAge?: string | null;
    facingDirection?: string | null;
    furnishingStatus?: string | null;

    //land
    landType?: string | null; // residential, commercial, farmland
    isCornerPlot?: boolean | null;
    roadWidthFeet?: number | null;

    // shop
    shopType?: string | null; // retail, office, warehouse
    hasParking?: boolean | null;
    parkingSpaces?: number | null;

    preferredTenantType?: string[] | null;
    petsAllowed?: boolean | null;
    smokingAllowed?: boolean | null;
    maximumOccupants?: number | null;
    amenities: string[];

    createdAt?: Date;
    updatedAt?: Date;
};
