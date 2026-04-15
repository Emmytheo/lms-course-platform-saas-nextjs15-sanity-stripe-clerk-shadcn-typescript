import { PaymentProvider } from "./interface";
import { StripeProvider } from "./stripe-provider";

export function getPaymentProvider(): PaymentProvider {
    const provider = process.env.NEXT_PUBLIC_PAYMENT_PROVIDER || 'stripe';

    switch (provider) {
        case 'stripe':
            return new StripeProvider();
        // Future:
        // case 'paystack':
        //    return new PaystackProvider();
        // case 'flutterwave':
        //    return new FlutterwaveProvider();
        default:
            console.warn(`Unknown payment provider '${provider}', defaulting to Stripe.`);
            return new StripeProvider();
    }
}
