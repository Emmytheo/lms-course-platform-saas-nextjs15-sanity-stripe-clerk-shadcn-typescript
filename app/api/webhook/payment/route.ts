import { getPaymentProvider } from "@/lib/payments/factory";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const provider = getPaymentProvider();

    try {
        const event = await provider.verifyWebhook(req);

        if (event.type === 'checkout.completed' && event.metadata) {
            const { userId, itemId, itemType } = event.metadata;
            console.log(`Processing enrollment for user ${userId} in ${itemType} ${itemId}`);

            if (itemType === 'course') {
                await db.createEnrollment(userId, itemId);
            } else if (itemType === 'exam') {
                await db.createExamEnrollment(userId, itemId);
            } else if (itemType === 'learning-path') {
                await db.createLearningPathEnrollment(userId, itemId);
            }
        }

        return NextResponse.json({ received: true });
    } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`);
        return NextResponse.json(
            { error: `Webhook Error: ${err.message}` },
            { status: 400 }
        );
    }
}
