import type { StripeWebhookEvent } from '@shared/types/stripe.types';

export interface CreateCheckoutSessionInput {
    paymentId: string;
    amount: number;
    description: string;
    successUrl: string;
    cancelUrl: string;
}

export interface CreateCheckoutSessionResult {
    sessionId: string;
    checkoutUrl: string;
}

export interface IStripeService {
    createCheckoutSession(input: CreateCheckoutSessionInput): Promise<CreateCheckoutSessionResult>;
    constructWebhookEvent(payload: Buffer, signature: string): StripeWebhookEvent;
}
