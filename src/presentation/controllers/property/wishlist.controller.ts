import { TokenTypes } from '@shared/types/tokens';
import { inject, injectable } from 'tsyringe';
import { Request, Response } from 'express';
import { logger } from '@shared/log/logger';
import { IWishlistUseCase } from '@application/interfaces/property/property.usecase.interface';
import { ResponseHandler } from '../../utils/response-handler';

@injectable()
export class WishlistController {
    constructor(
        @inject(TokenTypes.IWishlistUseCase)
        private readonly _wishlistUseCase: IWishlistUseCase,
    ) {}

    toggleWishlist = async (req: Request, res: Response): Promise<Response> => {
        const userId = req.user!.id;
        const propertyId = req.params.propertyId as string;
        logger.info(`user ${userId} toggling wishlist for property ${propertyId}`);
        const result = await this._wishlistUseCase.toggleWishlist(userId, propertyId);
        return ResponseHandler.success(
            res,
            result,
            result.isWishlisted ? 'Added to wishlist' : 'Removed from wishlist',
        );
    };

    getMyWishlist = async (req: Request, res: Response): Promise<Response> => {
        const userId = req.user!.id;
        logger.info(`fetching wishlist for user ${userId}`);
        const result = await this._wishlistUseCase.getMyWishlist(userId);
        return ResponseHandler.success(res, result, 'Wishlist fetched successfully');
    };

    checkWishlisted = async (req: Request, res: Response): Promise<Response> => {
        const userId = req.user!.id;
        const propertyId = req.params.propertyId as string;
        const result = await this._wishlistUseCase.isWishlisted(userId, propertyId);
        return ResponseHandler.success(res, { isWishlisted: result }, 'Status checked');
    };
}
