import { SubscriptionEntity } from '@core/entities/subscription.entity';

export interface ISubscriptionRepository {
    create(subscription: SubscriptionEntity): Promise<SubscriptionEntity>;
    findById(id: string): Promise<SubscriptionEntity | null>;
    findActiveByOwnerId(ownerId: string): Promise<SubscriptionEntity | null>;
    findAllByOwnerId(ownerId: string): Promise<SubscriptionEntity[]>;
    update(id: string, subscription: Partial<SubscriptionEntity>): Promise<SubscriptionEntity>;
    cancelSubscription(id: string, reason?: string): Promise<SubscriptionEntity>;
}