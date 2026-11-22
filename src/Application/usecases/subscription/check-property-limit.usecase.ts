import { inject, injectable } from 'tsyringe';
import { TokenTypes } from '@shared/types/tokens';
import { IPropertyRepository } from '@core/interfaces/repository/property-repository.interface';
import { ISubscriptionRepository } from '@core/interfaces/repository/subscription-repository.interface';
import { BusinessRuleError } from '@shared/errors/BusinessRuleError';

export interface ICheckPropertyLimitUseCase {
    execute(ownerId: string): Promise<boolean>;
}

@injectable()
export class CheckPropertyLimitUseCase implements ICheckPropertyLimitUseCase {
    constructor(
        @inject(TokenTypes.IPropertyRepository)
        private readonly _propertyRepo: IPropertyRepository,
        @inject(TokenTypes.ISubscriptionRepository)
        private readonly _subscriptionRepo: ISubscriptionRepository,
    ) {}

    async execute(ownerId: string): Promise<boolean> {
        // Get owner's current properties count
        const currentProperties = await this._propertyRepo.findByOwnerId(ownerId);
        
        // Get user's active subscription
        const activeSubscription = await this._subscriptionRepo.findActiveByOwnerId(ownerId);
        
        let propertyLimit = 1; // Default free tier limit
        
        if (activeSubscription) {
            propertyLimit = activeSubscription.propertiesLimit;
        }
        
        if (currentProperties.length >= propertyLimit) {
            const upgradeMessage = activeSubscription 
                ? `Property limit of ${propertyLimit} reached. Upgrade your subscription to add more properties.`
                : 'Free tier allows 1 property only. Subscribe to Premium to add unlimited properties.';
                
            throw new BusinessRuleError(
                upgradeMessage,
                'PROPERTY_LIMIT_EXCEEDED'
            );
        }
        
        return true;
    }
}