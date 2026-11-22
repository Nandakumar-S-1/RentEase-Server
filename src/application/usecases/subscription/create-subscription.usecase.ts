import { inject, injectable } from 'tsyringe';
import { TokenTypes } from '@shared/types/tokens';
import { ISubscriptionRepository } from '@core/interfaces/repository/subscription-repository.interface';
import { SubscriptionEntity } from '@core/entities/subscription.entity';
import { IStripeService } from '@application/interfaces/services/stripe.service.interface';

export interface CreateSubscriptionDTO {
    ownerId: string;
    subscriptionTier: 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
    billingCycle: 'MONTHLY' | 'YEARLY';
}

export interface ICreateSubscriptionUseCase {
    execute(dto: CreateSubscriptionDTO): Promise<{ checkoutUrl: string; subscriptionId: string }>;
}

@injectable()
export class CreateSubscriptionUseCase implements ICreateSubscriptionUseCase {
    constructor(
        @inject(TokenTypes.ISubscriptionRepository)
        private readonly _subscriptionRepo: ISubscriptionRepository,
        @inject(TokenTypes.IStripeService)
        private readonly _stripeService: IStripeService,
    ) {}

    async execute(dto: CreateSubscriptionDTO): Promise<{ checkoutUrl: string; subscriptionId: string }> {
        // Cancel any existing active subscription
        const existingSubscription = await this._subscriptionRepo.findActiveByOwnerId(dto.ownerId);
        if (existingSubscription) {
            await this._subscriptionRepo.cancelSubscription(
                existingSubscription.id,
                'Upgraded to new subscription tier'
            );
        }

        // Get subscription configuration
        const config = this.getSubscriptionConfig(dto.subscriptionTier, dto.billingCycle);
        
        // Create subscription entity
        const startDate = new Date();
        const endDate = new Date();
        
        if (dto.billingCycle === 'MONTHLY') {
            endDate.setMonth(endDate.getMonth() + 1);
        } else {
            endDate.setFullYear(endDate.getFullYear() + 1);
        }

        const subscriptionEntity = SubscriptionEntity.create({
            id: crypto.randomUUID(),
            ownerId: dto.ownerId,
            subscriptionTier: dto.subscriptionTier,
            subscriptionStatus: 'PENDING',
            startDate,
            endDate,
            autoRenew: true,
            billingCycle: dto.billingCycle,
            amountPaid: config.price,
            propertiesLimit: config.propertiesLimit,
            featuredListingsLimit: config.featuredListingsLimit,
            canUseAnalytics: config.canUseAnalytics,
            canUseVirtualTours: config.canUseVirtualTours,
            prioritySupport: config.prioritySupport,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const subscription = await this._subscriptionRepo.create(subscriptionEntity);

        // Create Stripe checkout session
        const checkoutSession = await this._stripeService.createCheckoutSession({
            paymentId: subscription.id,
            amount: config.price,
            description: `${dto.subscriptionTier} subscription - ${dto.billingCycle}`,
            successUrl: `${process.env.CLIENT_SIDE_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
            cancelUrl: `${process.env.CLIENT_SIDE_URL}/subscription/cancel`,
        });

        return {
            checkoutUrl: checkoutSession.checkoutUrl,
            subscriptionId: subscription.id,
        };
    }

    private getSubscriptionConfig(tier: string, cycle: string) {
        const configs = {
            BASIC: {
                MONTHLY: {
                    price: 29.99,
                    stripePriceId: 'price_basic_monthly', // Replace with actual Stripe price ID
                    propertiesLimit: 5,
                    featuredListingsLimit: 1,
                    canUseAnalytics: true,
                    canUseVirtualTours: false,
                    prioritySupport: false,
                },
                YEARLY: {
                    price: 299.99,
                    stripePriceId: 'price_basic_yearly',
                    propertiesLimit: 5,
                    featuredListingsLimit: 1,
                    canUseAnalytics: true,
                    canUseVirtualTours: false,
                    prioritySupport: false,
                },
            },
            PREMIUM: {
                MONTHLY: {
                    price: 79.99,
                    stripePriceId: 'price_premium_monthly',
                    propertiesLimit: 25,
                    featuredListingsLimit: 5,
                    canUseAnalytics: true,
                    canUseVirtualTours: true,
                    prioritySupport: true,
                },
                YEARLY: {
                    price: 799.99,
                    stripePriceId: 'price_premium_yearly',
                    propertiesLimit: 25,
                    featuredListingsLimit: 5,
                    canUseAnalytics: true,
                    canUseVirtualTours: true,
                    prioritySupport: true,
                },
            },
            ENTERPRISE: {
                MONTHLY: {
                    price: 199.99,
                    stripePriceId: 'price_enterprise_monthly',
                    propertiesLimit: -1, // Unlimited
                    featuredListingsLimit: -1, // Unlimited
                    canUseAnalytics: true,
                    canUseVirtualTours: true,
                    prioritySupport: true,
                },
                YEARLY: {
                    price: 1999.99,
                    stripePriceId: 'price_enterprise_yearly',
                    propertiesLimit: -1, // Unlimited
                    featuredListingsLimit: -1, // Unlimited
                    canUseAnalytics: true,
                    canUseVirtualTours: true,
                    prioritySupport: true,
                },
            },
        };

        return configs[tier as keyof typeof configs][cycle as keyof typeof configs.BASIC];
    }
}