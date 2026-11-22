import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { TokenTypes } from '@shared/types/tokens';
import { ResponseHandler } from '@presentation/utils/response-handler';
import { 
    ICreateSubscriptionUseCase,
    CreateSubscriptionDTO 
} from '@application/usecases/subscription/create-subscription.usecase';
import { ICheckPropertyLimitUseCase } from '@application/usecases/subscription/check-property-limit.usecase';
import { logger } from '@shared/log/logger';

@injectable()
export class SubscriptionController {
    constructor(
        @inject(TokenTypes.ICreateSubscriptionUseCase)
        private readonly _createSubscriptionUseCase: ICreateSubscriptionUseCase,
        @inject(TokenTypes.ICheckPropertyLimitUseCase)
        private readonly _checkPropertyLimitUseCase: ICheckPropertyLimitUseCase,
    ) {}

    createSubscription = async (req: Request, res: Response): Promise<Response> => {
        try {
            logger.info('Creating subscription checkout session');
            
            const ownerId = req.user!.id;
            const { subscriptionTier, billingCycle } = req.body;

            const dto: CreateSubscriptionDTO = {
                ownerId,
                subscriptionTier,
                billingCycle,
            };

            const result = await this._createSubscriptionUseCase.execute(dto);

            return ResponseHandler.success(res, {
                message: 'Subscription checkout session created successfully',
                data: result,
            });
        } catch (error) {
            logger.error({ err: error }, 'Failed to create subscription');
            return ResponseHandler.error(res, 'Failed to create subscription checkout session');
        }
    };

    checkPropertyLimit = async (req: Request, res: Response): Promise<Response> => {
        try {
            const ownerId = req.user!.id;
            
            await this._checkPropertyLimitUseCase.execute(ownerId);
            
            return ResponseHandler.success(res, {
                message: 'Property limit check passed',
                data: { canAddProperty: true },
            });
        } catch (error) {
            if (error instanceof Error && error.message.includes('Property limit')) {
                return ResponseHandler.error(res, error.message, 403);
            }
            
            logger.error({ err: error }, 'Failed to check property limit');
            return ResponseHandler.error(res, 'Failed to check property limit');
        }
    };

    getSubscriptionPlans = async (req: Request, res: Response): Promise<Response> => {
        try {
            const plans = [
                {
                    id: 'free',
                    name: 'Free',
                    price: { monthly: 0, yearly: 0 },
                    features: {
                        propertiesLimit: 1,
                        featuredListingsLimit: 0,
                        analytics: false,
                        virtualTours: false,
                        prioritySupport: false,
                    },
                    description: 'Perfect for getting started',
                    popular: false,
                },
                {
                    id: 'basic',
                    name: 'Basic',
                    price: { monthly: 29.99, yearly: 299.99 },
                    features: {
                        propertiesLimit: 5,
                        featuredListingsLimit: 1,
                        analytics: true,
                        virtualTours: false,
                        prioritySupport: false,
                    },
                    description: 'Great for individual property owners',
                    popular: false,
                },
                {
                    id: 'premium',
                    name: 'Premium',
                    price: { monthly: 79.99, yearly: 799.99 },
                    features: {
                        propertiesLimit: 25,
                        featuredListingsLimit: 5,
                        analytics: true,
                        virtualTours: true,
                        prioritySupport: true,
                    },
                    description: 'Ideal for property management companies',
                    popular: true,
                },
                {
                    id: 'enterprise',
                    name: 'Enterprise',
                    price: { monthly: 199.99, yearly: 1999.99 },
                    features: {
                        propertiesLimit: -1, // Unlimited
                        featuredListingsLimit: -1, // Unlimited
                        analytics: true,
                        virtualTours: true,
                        prioritySupport: true,
                    },
                    description: 'For large property management enterprises',
                    popular: false,
                },
            ];

            return ResponseHandler.success(res, {
                message: 'Subscription plans retrieved successfully',
                data: plans,
            });
        } catch (error) {
            logger.error({ err: error }, 'Failed to get subscription plans');
            return ResponseHandler.error(res, 'Failed to retrieve subscription plans');
        }
    };
}