import { PropertyTypeData } from '@core/types/property.types';

export interface WishlistData {
    id: string;
    userId: string;
    propertyId: string;
    createdAt: Date;
}

export interface IWishlistRepository {
    add(userId: string, propertyId: string): Promise<void>;
    remove(userId: string, propertyId: string): Promise<void>;
    findByUserId(userId: string): Promise<PropertyTypeData[]>;
    isWishlisted(userId: string, propertyId: string): Promise<boolean>;
}
