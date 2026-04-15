export interface CheckoutPayload {
    userId: string;
    email: string;
    itemId: string;
    itemType: 'course' | 'exam' | 'learning-path';
    title: string;
    description?: string;
    price: number;
    currency?: string; // default 'usd'
    returnUrl: string; // The URL to redirect to after payment
}

export interface SessionResult {
    url: string; // The URL to redirect the user to (e.g. Stripe Checkout)
    sessionId: string;
    provider: string;
}

export interface WebhookEvent {
    type: 'checkout.completed' | 'other';
    metadata: {
        userId: string;
        itemId: string;
        itemType: 'course' | 'exam' | 'learning-path';
    } | null;
    rawEvent: any;
}

export interface PaymentProvider {
    createCheckoutSession(payload: CheckoutPayload): Promise<SessionResult>;
    verifyWebhook(request: Request): Promise<WebhookEvent>;
}
