export interface SubscriptionTypeData {
    id: string;
    ownerId: string;
    subscriptionTier: 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
    subscriptionStatus: 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'PENDING';
    startDate: Date;
    endDate: Date;
    autoRenew: boolean;
    billingCycle?: 'MONTHLY' | 'YEARLY';
    amountPaid?: number;
    paymentId?: string;
    propertiesLimit: number;
    featuredListingsLimit: number;
    canUseAnalytics: boolean;
    canUseVirtualTours: boolean;
    prioritySupport: boolean;
    cancelledAt?: Date;
    cancellationReason?: string;
    createdAt: Date;
    updatedAt: Date;
}

export class SubscriptionEntity {
    private constructor(private data: SubscriptionTypeData) {}

    static create(data: SubscriptionTypeData): SubscriptionEntity {
        return new SubscriptionEntity(data);
    }

    get id(): string {
        return this.data.id;
    }

    get ownerId(): string {
        return this.data.ownerId;
    }

    get subscriptionTier(): string {
        return this.data.subscriptionTier;
    }

    get subscriptionStatus(): string {
        return this.data.subscriptionStatus;
    }

    get startDate(): Date {
        return this.data.startDate;
    }

    get endDate(): Date {
        return this.data.endDate;
    }

    get autoRenew(): boolean {
        return this.data.autoRenew;
    }

    get billingCycle(): string | undefined {
        return this.data.billingCycle;
    }

    get amountPaid(): number | undefined {
        return this.data.amountPaid;
    }

    get paymentId(): string | undefined {
        return this.data.paymentId;
    }

    get propertiesLimit(): number {
        return this.data.propertiesLimit;
    }

    get featuredListingsLimit(): number {
        return this.data.featuredListingsLimit;
    }

    get canUseAnalytics(): boolean {
        return this.data.canUseAnalytics;
    }

    get canUseVirtualTours(): boolean {
        return this.data.canUseVirtualTours;
    }

    get prioritySupport(): boolean {
        return this.data.prioritySupport;
    }

    get cancelledAt(): Date | undefined {
        return this.data.cancelledAt;
    }

    get cancellationReason(): string | undefined {
        return this.data.cancellationReason;
    }

    get createdAt(): Date {
        return this.data.createdAt;
    }

    get updatedAt(): Date {
        return this.data.updatedAt;
    }

    isActive(): boolean {
        const now = new Date();
        return (
            this.data.subscriptionStatus === 'ACTIVE' &&
            this.data.endDate > now
        );
    }

    isExpired(): boolean {
        const now = new Date();
        return this.data.endDate <= now;
    }

    canAddProperty(currentPropertyCount: number): boolean {
        return currentPropertyCount < this.data.propertiesLimit;
    }

    getRemainingProperties(currentPropertyCount: number): number {
        return Math.max(0, this.data.propertiesLimit - currentPropertyCount);
    }

    toData(): SubscriptionTypeData {
        return { ...this.data };
    }
}