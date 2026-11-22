import { IWishlistUseCase } from '@application/interfaces/property/property.usecase.interface';
import { IWishlistRepository } from '@core/interfaces/repository/wishlist.repository.interface';
import { PropertyTypeData } from '@core/types/property.types';
import { TokenTypes } from '@shared/types/tokens';
import { inject, injectable } from 'tsyringe';

@injectable()
export class WishlistUseCase implements IWishlistUseCase {
    constructor(
        @inject(TokenTypes.IWishlistRepository)
        private readonly _wishlistRepo: IWishlistRepository,
    ) {}

    async toggleWishlist(userId: string, propertyId: string): Promise<{ isWishlisted: boolean }> {
        const exists = await this._wishlistRepo.isWishlisted(userId, propertyId);
        if (exists) {
            await this._wishlistRepo.remove(userId, propertyId);
            return { isWishlisted: false };
        } else {
            await this._wishlistRepo.add(userId, propertyId);
            return { isWishlisted: true };
        }
    }

    async getMyWishlist(userId: string): Promise<PropertyTypeData[]> {
        return await this._wishlistRepo.findByUserId(userId);
    }

    async isWishlisted(userId: string, propertyId: string): Promise<boolean> {
        return await this._wishlistRepo.isWishlisted(userId, propertyId);
    }
}
