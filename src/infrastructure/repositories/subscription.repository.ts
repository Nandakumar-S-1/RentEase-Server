import { injectable } from 'tsyringe';
import { ISubscriptionRepository } from '@core/interfaces/repository/subscription-repository.interface';
import { SubscriptionEntity } from '@core/entities/subscription.entity';
import { prisma } from '@infrastructure/database/prisma/prisma.client';
import { SubscriptionPersistenceMapper } from '@infrastructure/mappers/subscription-persistence.mapper';

@injectable()
export class SubscriptionRepository implements ISubscriptionRepository {
    async create(subscription: SubscriptionEntity): Promise<SubscriptionEntity> {
        const prismaData = SubscriptionPersistenceMapper.toPrismaCreate(subscription);
        const result = await prisma.subscription.create({
            data: prismaData,
        });
        return SubscriptionPersistenceMapper.toEntity(result);
    }

    async findById(id: string): Promise<SubscriptionEntity | null> {
        const result = await prisma.subscription.findUnique({
            where: { id },
        });
        return result ? SubscriptionPersistenceMapper.toEntity(result) : null;
    }

    async findActiveByOwnerId(ownerId: string): Promise<SubscriptionEntity | null> {
        const result = await prisma.subscription.findFirst({
            where: {
                ownerId,
                subscriptionStatus: 'ACTIVE',
                endDate: {
                    gt: new Date(),
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return result ? SubscriptionPersistenceMapper.toEntity(result) : null;
    }

    async findAllByOwnerId(ownerId: string): Promise<SubscriptionEntity[]> {
        const results = await prisma.subscription.findMany({
            where: { ownerId },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return results.map(SubscriptionPersistenceMapper.toEntity);
    }

    async update(id: string, subscription: Partial<SubscriptionEntity>): Promise<SubscriptionEntity> {
        const prismaData = SubscriptionPersistenceMapper.toPrismaUpdate(subscription);
        const result = await prisma.subscription.update({
            where: { id },
            data: prismaData,
        });
        return SubscriptionPersistenceMapper.toEntity(result);
    }

    async cancelSubscription(id: string, reason?: string): Promise<SubscriptionEntity> {
        const result = await prisma.subscription.update({
            where: { id },
            data: {
                subscriptionStatus: 'CANCELLED',
                cancelledAt: new Date(),
                cancellationReason: reason,
                updatedAt: new Date(),
            },
        });
        return SubscriptionPersistenceMapper.toEntity(result);
    }
}