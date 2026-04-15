import { CreatePropertyDTO } from "@application/dtos/property/property.dto";
import { CreatePropertyResponseDTO } from "@application/dtos/property/res/create-property-response.dto";
import { PropertyStatus } from "@shared/enums/property-type-status.enum";

export interface ICreatePropertyUseCase {
    execute(dto: CreatePropertyDTO): Promise<CreatePropertyResponseDTO>
}

export interface GetMyPropertiesDTO {
    ownerId: string;
    status?: PropertyStatus;
    page: number;
    limit: number;
}

export interface PaginatedPropertyResponse {
    properties: any[];
    total: number;
    page: number;
    limit: number;
}

export interface IGetMyPropertiesUseCase {
    execute(dto: GetMyPropertiesDTO): Promise<PaginatedPropertyResponse>;
}