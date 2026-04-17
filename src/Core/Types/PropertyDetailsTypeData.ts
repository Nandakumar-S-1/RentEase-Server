export type PropertyDetailsTypeData = {
    id: string;
    propertyId: string;

    // house,flat,PG
    bhk?: number;
    bathrooms?: number;
    floorNumber?: string;
    totalFloors?: number;
    propertyAge?: string;
    facingDirection?: string;
    furnishingStatus?: string;

    //land
    landType?: string; // residential, commercial, agricultural
    isCornerPlot?: boolean;
    roadWidthFeet?: number;

    // shop
    shopType?: string; // retail, office, warehouse
    hasParking?: boolean;
    parkingSpaces?: number;

    preferredTenantType?: string[];
    petsAllowed?: boolean;
    smokingAllowed?: boolean;
    maximumOccupants?: number;

    createdAt?: Date;
    updatedAt?: Date;
};
