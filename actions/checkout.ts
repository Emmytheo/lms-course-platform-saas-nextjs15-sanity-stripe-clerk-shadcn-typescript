'use server';

import { getPaymentProvider } from "@/lib/payments/factory";
import { getAuth } from "@/lib/auth-wrapper";

export async function createCheckoutSessionAction(
    itemId: string,
    itemType: 'course' | 'exam' | 'learning-path',
    title: string,
    description: string,
    price: number,
    returnUrl: string
) {
    const { userId, userEmail } = await getAuth();

    if (!userId || !userEmail) {
        throw new Error("User not authenticated");
    }

    const provider = getPaymentProvider();

    try {
        const result = await provider.createCheckoutSession({
            userId,
            email: userEmail,
            itemId,
            itemType,
            title,
            description,
            price,
            returnUrl,
            currency: 'usd' // Could be configurable
        });

        return { url: result.url };
    } catch (error: any) {
        console.error("Checkout Creation Error:", error);
        throw new Error(error.message || "Failed to initiate checkout");
    }
}
