import { CreatePropertyResponseDTO } from '@application/dtos/property/res/create-property-response.dto';
import { PropertyStatus } from '@shared/enums/property-type-status.enum';
import { PropertyTypeData } from '@core/types/property.types';
import { CreatePropertyDTO } from '@application/dtos/property/property.dto';

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
}

export interface IGetAllPropertiesUseCase {
    execute(dto: GetAllPropertiesDTO): Promise<PaginatedPropertyResponse>;
}

export interface IVerifyPropertyUseCase {
    getPendingProperties(): Promise<any[]>;
    approveProperty(propertyId: string, adminId: string): Promise<void>;
    rejectProperty(propertyId: string): Promise<void>;
}

export interface IUpdatePropertyUseCase {
    execute(id: string, dto: any): Promise<any>;
}

export interface IUnlistPropertyUseCase {
    execute(id: string): Promise<void>;
}

export interface IDeletePropertyUseCase {
    execute(id: string): Promise<void>;
}

export interface IServiceProviderUseCase {
    addProvider(data: any): Promise<any>;
    getProvidersByProperty(propertyId: string): Promise<any[]>;
    deleteProvider(id: string): Promise<void>;
    toggleProviderStatus(id: string, isActive: boolean): Promise<void>;
}

export interface IWishlistUseCase {
    toggleWishlist(userId: string, propertyId: string): Promise<{ isWishlisted: boolean }>;
    getMyWishlist(userId: string): Promise<any[]>;
    isWishlisted(userId: string, propertyId: string): Promise<boolean>;
}
