import Stripe from 'stripe';

export type StripeClient = Stripe.Stripe;
export type StripeWebhookEvent = ReturnType<StripeClient['webhooks']['constructEvent']>;

export type StripeCheckoutSession = {
    id: string;
    metadata?: Record<string, string> | null;
    payment_intent?: string | { id: string } | null;
};
