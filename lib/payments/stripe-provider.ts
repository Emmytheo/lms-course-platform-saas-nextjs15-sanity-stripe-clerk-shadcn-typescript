import stripe from "@/lib/stripe";
import { PaymentProvider, CheckoutPayload, SessionResult, WebhookEvent } from "./interface";
import { headers } from "next/headers";

export class StripeProvider implements PaymentProvider {

    async createCheckoutSession(payload: CheckoutPayload): Promise<SessionResult> {
        // Construct absolute URL if returnUrl is relative
        let successUrl = payload.returnUrl;
        if (payload.returnUrl.startsWith('/')) {
            const origin = (await headers()).get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
            successUrl = `${origin}${payload.returnUrl}`;
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: payload.currency || 'usd',
                        product_data: {
                            name: payload.title,
                            description: payload.description,
                        },
                        unit_amount: Math.round(payload.price * 100), // Stripe expects cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: successUrl,
            cancel_url: successUrl, // Basic fallback
            metadata: {
                userId: payload.userId,
                itemId: payload.itemId,
                itemType: payload.itemType
            },
            customer_email: payload.email,
        });

        if (!session.url) {
            throw new Error("Failed to create Stripe session URL");
        }

        return {
            url: session.url,
            sessionId: session.id,
            provider: 'stripe'
        };
    }

    async verifyWebhook(request: Request): Promise<WebhookEvent> {
        const body = await request.text();
        const signature = request.headers.get("stripe-signature") as string;

        let event;
        try {
            event = stripe.webhooks.constructEvent(
                body,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET!
            );
        } catch (err: any) {
            console.error(`Webhook signature verification failed: ${err.message}`);
            throw new Error(`Webhook Error: ${err.message}`);
        }

        if (event.type === "checkout.session.completed") {
            const session = event.data.object as any;
            return {
                type: 'checkout.completed',
                metadata: {
                    userId: session.metadata.userId,
                    itemId: session.metadata.itemId,
                    itemType: session.metadata.itemType as any
                },
                rawEvent: event
            };
        }

        return {
            type: 'other',
            metadata: null,
            rawEvent: event
        };
    }
}
