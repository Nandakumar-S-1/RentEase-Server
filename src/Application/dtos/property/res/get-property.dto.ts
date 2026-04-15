import { PropertyStatus } from "@shared/enums/property-type-status.enum";

export interface GetMyPropertiesDTO {
    ownerId: string;
    status?: PropertyStatus;
    page: number;
    limit: number;
}