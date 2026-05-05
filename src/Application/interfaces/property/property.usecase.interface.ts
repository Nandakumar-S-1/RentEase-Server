import { CreatePropertyResponseDTO } from '@application/dtos/property/res/create-property-response.dto';
import { PropertyStatus } from '@shared/enums/property-type-status.enum';
import { PropertyTypeData } from '@core/types/property.types';
import { CreatePropertyDTO } from '@application/dtos/property/property.dto';
import { CreateServiceProviderDTO, ServiceProviderResponseDTO } from '@application/dtos/property/service-provider.dto';

export interface ICreatePropertyUseCase {
    execute(dto: CreatePropertyDTO): Promise<CreatePropertyResponseDTO>;
}

export interface IGetPropertyByIdUseCase {
    execute(id: string): Promise<PropertyTypeData | null>;
}

export interface GetMyPropertiesDTO {
    ownerId: string;
    status?: PropertyStatus;
    page: number;
    limit: number;
}

export interface PaginatedPropertyResponse {
    properties: PropertyTypeData[];
    total: number;
    page: number;
    limit: number;
}

export interface IGetMyPropertiesUseCase {
    execute(dto: GetMyPropertiesDTO): Promise<PaginatedPropertyResponse>;
}

export interface GetAllPropertiesDTO {
    status?: PropertyStatus;
    page: number;
    limit: number;
    query?: string;
    city?: string;
    propertyType?: string;
    minRent?: number;
    maxRent?: number;
    minArea?: number;
    maxArea?: number;
    bhk?: number;
}

export interface IGetAllPropertiesUseCase {
    execute(dto: GetAllPropertiesDTO): Promise<PaginatedPropertyResponse>;
}

export interface IVerifyPropertyUseCase {
    getPendingProperties(page: number, limit: number): Promise<PaginatedPropertyResponse>;
    getAllProperties(status: PropertyStatus, page: number, limit: number): Promise<PaginatedPropertyResponse>;
    approveProperty(propertyId: string, adminId: string): Promise<void>;
    rejectProperty(propertyId: string, reason?: string): Promise<void>;
}

export interface IUpdatePropertyUseCase {
    execute(id: string, dto: Partial<CreatePropertyDTO>): Promise<PropertyTypeData>;
}

export interface IUnlistPropertyUseCase {
    execute(id: string): Promise<void>;
}

export interface IDeletePropertyUseCase {
    execute(id: string): Promise<void>;
}

export interface IRelistPropertyUseCase {
    execute(id: string): Promise<void>;
}

export interface IServiceProviderUseCase {
    addProvider(data: CreateServiceProviderDTO): Promise<ServiceProviderResponseDTO>;
    getProvidersByProperty(propertyId: string): Promise<ServiceProviderResponseDTO[]>;
    deleteProvider(id: string): Promise<void>;
    toggleProviderStatus(id: string, isActive: boolean): Promise<void>;
}

export interface IWishlistUseCase {
    toggleWishlist(userId: string, propertyId: string): Promise<{ isWishlisted: boolean }>;
    getMyWishlist(userId: string): Promise<PropertyTypeData[]>;
    isWishlisted(userId: string, propertyId: string): Promise<boolean>;
}
