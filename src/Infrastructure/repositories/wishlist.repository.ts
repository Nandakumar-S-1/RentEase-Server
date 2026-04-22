import { IWishlistRepository } from '@core/interfaces/repository/wishlist.repository.interface';
import { prisma } from '@infrastructure/database/prisma/prisma.client';
import { injectable } from 'tsyringe';

@injectable()
export class WishlistRepository implements IWishlistRepository {
    async add(userId: string, propertyId: string): Promise<void> {
        await prisma.wishlist.create({
            data: { userId, propertyId },
        });
    }

    async remove(userId: string, propertyId: string): Promise<void> {
        await prisma.wishlist.delete({
            where: {
                userId_propertyId: { userId, propertyId },
            },
        });
    }

    async findByUserId(userId: string): Promise<any[]> {
        return await prisma.wishlist.findMany({
            where: { userId },
            include: {
                property: {
                    include: { details: true },
                },
            },
        });
    }

    async isWishlisted(userId: string, propertyId: string): Promise<boolean> {
        const count = await prisma.wishlist.count({
            where: { userId, propertyId },
        });
        return count > 0;
    }
}
