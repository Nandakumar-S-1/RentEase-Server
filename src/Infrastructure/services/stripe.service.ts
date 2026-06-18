import Stripe from 'stripe';
import {
    CreateCheckoutSessionInput,
    CreateCheckoutSessionResult,
    IStripeService,
} from '@application/interfaces/services/stripe.service.interface';
import type { StripeClient, StripeWebhookEvent } from '@shared/types/stripe.types';

export class StripeService implements IStripeService {
    private _stripe: StripeClient;
    constructor() {
        const secretKey = process.env.STRIPE_SECRET_KEY;
        if (!secretKey) {
            throw new Error('STRIPE_SECRET_KEY is not configured');
        }
        this._stripe = new Stripe(secretKey);
    }

    async createCheckoutSession(
        input: CreateCheckoutSessionInput,
    ): Promise<CreateCheckoutSessionResult> {
        const currency = process.env.STRIPE_CURRENCY || 'inr';
        const amountInSmallestUnit = Math.round(input.amount * 100);

        const session = await this._stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency,
                        product_data: {
                            name: input.description,
                        },
                        unit_amount: amountInSmallestUnit,
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                paymentId: input.paymentId,
            },
            success_url: input.successUrl,
            cancel_url: input.cancelUrl,
        });

        if (!session.url) {
            throw new Error('Stripe did not return a checkout URL');
        }

        return {
            sessionId: session.id,
            checkoutUrl: session.url,
        };
    }

    constructWebhookEvent(payload: Buffer, signature: string): StripeWebhookEvent {
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        if (!webhookSecret) {
            throw new Error('STRIPE_WEBHOOK_SECRET is not configured');
        }

        return this._stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    }
}
