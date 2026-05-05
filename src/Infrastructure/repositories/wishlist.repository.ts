import { IWishlistRepository } from '@core/interfaces/repository/wishlist.repository.interface';
import { PropertyResponseMapper } from '@application/mappers/property/property-response.mapper';
import { PropertyTypeData } from '@core/types/property.types';
import { prisma } from '@infrastructure/database/prisma/prisma.client';
import { Property, PropertyDetails } from '@prisma/client';
import { PropertyPersistenceMapper } from '@infrastructure/mappers/property-persistence.mapper';
import { injectable } from 'tsyringe';

@injectable()
export class WishlistRepository implements IWishlistRepository {
    async add(userId: string, propertyId: string): Promise<void> {
        await prisma.$transaction([
            prisma.wishlist.create({
                data: { userId, propertyId },
            }),
            prisma.property.update({
                where: { id: propertyId },
                data: { wishlistCount: { increment: 1 } },
            }),
        ]);
    }

    async remove(userId: string, propertyId: string): Promise<void> {
        await prisma.$transaction([
            prisma.wishlist.delete({
                where: {
                    userId_propertyId: { userId, propertyId },
                },
            }),
            prisma.property.update({
                where: { id: propertyId },
                data: { wishlistCount: { decrement: 1 } },
            }),
        ]);
    }

    async findByUserId(userId: string): Promise<PropertyTypeData[]> {
        const results = await prisma.wishlist.findMany({
            where: { userId },
            include: {
                property: {
                    include: { details: true },
                },
            },
        });

        return results.map((r) => {
            const propertyEntity = PropertyPersistenceMapper.toEntity(r.property as Property & { details: PropertyDetails | null });
            return PropertyResponseMapper.toGeneralResponse(propertyEntity);
        });
    }

    async isWishlisted(userId: string, propertyId: string): Promise<boolean> {
        const count = await prisma.wishlist.count({
            where: { userId, propertyId },
        });
        return count > 0;
    }
}
