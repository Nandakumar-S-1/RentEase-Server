import { SubscriptionEntity, SubscriptionTypeData } from '@core/entities/subscription.entity';
import { Subscription, Prisma } from '@prisma/client';

export class SubscriptionPersistenceMapper {
    static toEntity(prisma: Subscription): SubscriptionEntity {
        const data: SubscriptionTypeData = {
            id: prisma.id,
            ownerId: prisma.ownerId,
            subscriptionTier: prisma.subscriptionTier as 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE',
            subscriptionStatus: prisma.subscriptionStatus as 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'PENDING',
            startDate: prisma.startDate,
            endDate: prisma.endDate,
            autoRenew: prisma.autoRenew,
            billingCycle: prisma.billingCycle as 'MONTHLY' | 'YEARLY' | undefined,
            amountPaid: prisma.amountPaid ? Number(prisma.amountPaid) : undefined,
            paymentId: prisma.paymentId || undefined,
            propertiesLimit: prisma.propertiesLimit,
            featuredListingsLimit: prisma.featuredListingsLimit,
            canUseAnalytics: prisma.canUseAnalytics,
            canUseVirtualTours: prisma.canUseVirtualTours,
            prioritySupport: prisma.prioritySupport,
            cancelledAt: prisma.cancelledAt || undefined,
            cancellationReason: prisma.cancellationReason || undefined,
            createdAt: prisma.createdAt,
            updatedAt: prisma.updatedAt,
        };
        return SubscriptionEntity.create(data);
    }

    static toPrismaCreate(entity: SubscriptionEntity): Prisma.SubscriptionCreateInput {
        return {
            id: entity.id,
            owner: { connect: { id: entity.ownerId } },
            subscriptionTier: entity.subscriptionTier,
            subscriptionStatus: entity.subscriptionStatus,
            startDate: entity.startDate,
            endDate: entity.endDate,
            autoRenew: entity.autoRenew,
            billingCycle: entity.billingCycle,
            amountPaid: entity.amountPaid ? new Prisma.Decimal(entity.amountPaid) : null,
            paymentId: entity.paymentId,
            propertiesLimit: entity.propertiesLimit,
            featuredListingsLimit: entity.featuredListingsLimit,
            canUseAnalytics: entity.canUseAnalytics,
            canUseVirtualTours: entity.canUseVirtualTours,
            prioritySupport: entity.prioritySupport,
            cancelledAt: entity.cancelledAt,
            cancellationReason: entity.cancellationReason,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }

    static toPrismaUpdate(entity: Partial<SubscriptionEntity>): Prisma.SubscriptionUpdateInput {
        const updateData: Prisma.SubscriptionUpdateInput = {};
        
        if (entity.subscriptionTier) updateData.subscriptionTier = entity.subscriptionTier;
        if (entity.subscriptionStatus) updateData.subscriptionStatus = entity.subscriptionStatus;
        if (entity.startDate) updateData.startDate = entity.startDate;
        if (entity.endDate) updateData.endDate = entity.endDate;
        if (entity.autoRenew !== undefined) updateData.autoRenew = entity.autoRenew;
        if (entity.billingCycle) updateData.billingCycle = entity.billingCycle;
        if (entity.amountPaid) updateData.amountPaid = new Prisma.Decimal(entity.amountPaid);
        if (entity.paymentId) updateData.paymentId = entity.paymentId;
        if (entity.propertiesLimit !== undefined) updateData.propertiesLimit = entity.propertiesLimit;
        if (entity.featuredListingsLimit !== undefined) updateData.featuredListingsLimit = entity.featuredListingsLimit;
        if (entity.canUseAnalytics !== undefined) updateData.canUseAnalytics = entity.canUseAnalytics;
        if (entity.canUseVirtualTours !== undefined) updateData.canUseVirtualTours = entity.canUseVirtualTours;
        if (entity.prioritySupport !== undefined) updateData.prioritySupport = entity.prioritySupport;
        if (entity.cancelledAt) updateData.cancelledAt = entity.cancelledAt;
        if (entity.cancellationReason) updateData.cancellationReason = entity.cancellationReason;
        
        updateData.updatedAt = new Date();
        
        return updateData;
    }
}